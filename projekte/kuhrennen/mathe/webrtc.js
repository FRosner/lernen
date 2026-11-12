// Serverless WebRTC Netzwerk-Modul für Kuhrennen (1 Spielleiter + bis zu 3 Mitspieler)
// Komplett ohne Drittanbieter-Signaling-Server: Austausch per Einladungs-Link / Kompakt-Code

(function (root) {
  "use strict";

  const DEFAULT_ICE_SERVERS = [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }
  ];

  // Base64url Hilfsfunktionen (UTF-8 & Uint8Array sicher)
  function bytesToBase64Url(bytes) {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function base64UrlToBytes(base64url) {
    const b64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const binary = atob(b64 + pad);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  // Komprimiert ein Signal-Objekt ({ t: "o"|"a", sdp: "..." }) in einen kurzen Base64url-Code
  async function encodeSignalPayload(payloadObj) {
    const jsonStr = JSON.stringify(payloadObj);
    const rawBytes = new TextEncoder().encode(jsonStr);

    if (typeof CompressionStream !== "undefined") {
      try {
        const cs = new CompressionStream("deflate-raw");
        const writer = cs.writable.getWriter();
        writer.write(rawBytes);
        writer.close();
        const compressedBuf = await new Response(cs.readable).arrayBuffer();
        return "z." + bytesToBase64Url(new Uint8Array(compressedBuf));
      } catch (_err) {
        // Fallback auf unkomprimiert
      }
    }
    return "u." + bytesToBase64Url(rawBytes);
  }

  // Dekomprimiert einen Code (oder kompletten Einladungs-Link) zurück in das Signal-Objekt
  async function decodeSignalPayload(inputStr) {
    const code = extractCodeFromInput(inputStr);
    if (!code) {
      throw new Error("Kein gültiger Verbindungs-Code gefunden.");
    }

    if (code.startsWith("z.")) {
      if (typeof DecompressionStream === "undefined") {
        throw new Error("Dein Browser unterstützt diese Code-Komprimierung nicht.");
      }
      const compressedBytes = base64UrlToBytes(code.slice(2));
      const ds = new DecompressionStream("deflate-raw");
      const writer = ds.writable.getWriter();
      writer.write(compressedBytes);
      writer.close();
      const decompressedBuf = await new Response(ds.readable).arrayBuffer();
      const jsonStr = new TextDecoder().decode(decompressedBuf);
      return JSON.parse(jsonStr);
    } else if (code.startsWith("u.")) {
      const rawBytes = base64UrlToBytes(code.slice(2));
      const jsonStr = new TextDecoder().decode(rawBytes);
      return JSON.parse(jsonStr);
    } else {
      throw new Error("Ungültiges Code-Format. Bitte kopiere den vollständigen Code.");
    }
  }

  // Extrahiert den Code sowohl aus reinem Text als auch aus einem vollständigen Einladungs-Link
  function extractCodeFromInput(rawInput) {
    if (!rawInput || typeof rawInput !== "string") return "";
    const trimmed = rawInput.trim();

    // Falls ein kompletter Link mit #invite=... eingefügt wurde
    const inviteMatch = trimmed.match(/[#?&]invite=([A-Za-z0-9._-]+)/);
    if (inviteMatch && inviteMatch[1]) {
      return inviteMatch[1];
    }

    // Falls der Code direkt (z.B. "z.eJx..." oder "u.eyJ...") eingefügt wurde
    const directMatch = trimmed.match(/\b([zu]\.[A-Za-z0-9_-]+)\b/);
    if (directMatch && directMatch[1]) {
      return directMatch[1];
    }

    return "";
  }

  // Baut einen teilbaren Einladungs-Link aus einem Offer-Code
  function buildInviteLink(offerCode, baseHref) {
    const href = (baseHref || window.location.href).split("#")[0].split("?")[0];
    return `${href}#invite=${offerCode}`;
  }

  // Wartet auf das Sammeln der ICE-Kandidaten (mit intelligentem Timeout, damit es nie hängt)
  function waitForIceGathering(pc, timeoutMs = 2400) {
    return new Promise((resolve) => {
      if (pc.iceGatheringState === "complete") {
        resolve();
        return;
      }

      let finished = false;
      let candidateCount = 0;
      let earlyTimer = null;

      const done = () => {
        if (finished) return;
        finished = true;
        clearTimeout(maxTimer);
        clearTimeout(earlyTimer);
        pc.removeEventListener("icegatheringstatechange", onStateChange);
        pc.removeEventListener("icecandidate", onCandidate);
        resolve();
      };

      const onStateChange = () => {
        if (pc.iceGatheringState === "complete") {
          done();
        }
      };

      const onCandidate = (ev) => {
        if (!ev.candidate) {
          done();
          return;
        }
        candidateCount++;
        // Sobald mindestens 1 Kandidat da ist, warten wir maximal noch 900ms auf weitere
        if (candidateCount === 1 && !earlyTimer) {
          earlyTimer = setTimeout(done, 900);
        }
      };

      pc.addEventListener("icegatheringstatechange", onStateChange);
      pc.addEventListener("icecandidate", onCandidate);

      const maxTimer = setTimeout(done, timeoutMs);
    });
  }

  /**
   * Verwaltet die WebRTC-Verbindungen für Spielleiter (Host) oder Mitspieler (Guest).
   */
  class KuhNetzwerkManager {
    constructor(callbacks = {}) {
      this.role = null; // "host" | "guest" | null
      this.callbacks = callbacks;
      // Für Host: Map von peerId -> { id, pc, dc, connected }
      this.peers = new Map();
      this.pendingHostInvite = null;
      this.nextPeerNum = 2; // Spieler 2, 3, 4

      // Für Guest: { pc, dc, connected }
      this.guestConn = null;
    }

    reset() {
      if (this.pendingHostInvite && this.pendingHostInvite.pc) {
        try {
          this.pendingHostInvite.pc.close();
        } catch (_e) {}
      }
      this.pendingHostInvite = null;

      this.peers.forEach((peer) => {
        try {
          if (peer.dc) peer.dc.close();
          if (peer.pc) peer.pc.close();
        } catch (_e) {}
      });
      this.peers.clear();

      if (this.guestConn) {
        try {
          if (this.guestConn.dc) this.guestConn.dc.close();
          if (this.guestConn.pc) this.guestConn.pc.close();
        } catch (_e) {}
        this.guestConn = null;
      }

      this.role = null;
      this.nextPeerNum = 2;
    }

    getConnectedPeerCount() {
      let count = 0;
      this.peers.forEach((p) => {
        if (p.connected) count++;
      });
      return count;
    }

    // =========================================================================
    // HOST-FUNKTIONEN (Spielleiter)
    // =========================================================================
    initHost() {
      this.reset();
      this.role = "host";
    }

    async createHostInvite() {
      if (this.role !== "host") {
        this.initHost();
      }
      if (this.getConnectedPeerCount() >= 3) {
        throw new Error("Es sind bereits maximal 3 Mitspieler (insgesamt 4 Spieler) verbunden.");
      }

      // Falls noch eine ungenutzte Einladung offen war, schließen
      if (this.pendingHostInvite && this.pendingHostInvite.pc) {
        try {
          this.pendingHostInvite.pc.close();
        } catch (_e) {}
      }

      const peerId = `p${this.nextPeerNum}`;
      const pc = new RTCPeerConnection({ iceServers: DEFAULT_ICE_SERVERS });
      const dc = pc.createDataChannel("kuhrennen", { ordered: true });

      const inviteObj = {
        id: peerId,
        pc,
        dc,
        connected: false
      };
      this.pendingHostInvite = inviteObj;
      this._setupHostDataChannel(inviteObj);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await waitForIceGathering(pc);

      const localDesc = pc.localDescription;
      const offerCode = await encodeSignalPayload({
        t: "o",
        sdp: localDesc.sdp
      });

      return {
        peerId,
        offerCode,
        inviteLink: buildInviteLink(offerCode)
      };
    }

    async acceptGuestAnswer(answerInput) {
      if (!this.pendingHostInvite) {
        throw new Error("Bitte erstelle zuerst eine Einladung.");
      }
      const payload = await decodeSignalPayload(answerInput);
      if (payload.t !== "a" || !payload.sdp) {
        throw new Error("Das ist kein Antwort-Code eines Mitspielers (vielleicht hast du aus Versehen den Einladungs-Code eingefügt?).");
      }

      const inviteObj = this.pendingHostInvite;
      await inviteObj.pc.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: payload.sdp })
      );

      // Jetzt warten wir kurz, bis der DataChannel wirklich aufgeht
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Zeitüberschreitung beim Verbinden. Bitte versuche es mit einer neuen Einladung."));
        }, 8000);

        if (inviteObj.connected) {
          clearTimeout(timeout);
          resolve(inviteObj.id);
          return;
        }

        inviteObj.onOpenOnce = () => {
          clearTimeout(timeout);
          resolve(inviteObj.id);
        };
      });
    }

    _setupHostDataChannel(peerObj) {
      const { dc, pc } = peerObj;

      dc.onopen = () => {
        peerObj.connected = true;
        this.peers.set(peerObj.id, peerObj);
        if (this.pendingHostInvite === peerObj) {
          this.pendingHostInvite = null;
          this.nextPeerNum++;
        }
        if (peerObj.onOpenOnce) {
          peerObj.onOpenOnce();
          peerObj.onOpenOnce = null;
        }
        if (this.callbacks.onPeerConnected) {
          this.callbacks.onPeerConnected(peerObj.id);
        }
      };

      dc.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (this.callbacks.onMessageFromPeer) {
            this.callbacks.onMessageFromPeer(peerObj.id, msg);
          }
        } catch (_e) {}
      };

      const handleDisconnect = () => {
        if (peerObj.connected) {
          peerObj.connected = false;
          this.peers.delete(peerObj.id);
          if (this.callbacks.onPeerDisconnected) {
            this.callbacks.onPeerDisconnected(peerObj.id);
          }
        }
      };

      dc.onclose = handleDisconnect;
      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed" ||
          pc.connectionState === "closed"
        ) {
          handleDisconnect();
        }
      };
    }

    broadcast(msgObj) {
      const raw = JSON.stringify(msgObj);
      this.peers.forEach((peer) => {
        if (peer.connected && peer.dc && peer.dc.readyState === "open") {
          try {
            peer.dc.send(raw);
          } catch (_e) {}
        }
      });
    }

    sendToPeer(peerId, msgObj) {
      const peer = this.peers.get(peerId);
      if (peer && peer.connected && peer.dc && peer.dc.readyState === "open") {
        try {
          peer.dc.send(JSON.stringify(msgObj));
        } catch (_e) {}
      }
    }

    // =========================================================================
    // GUEST-FUNKTIONEN (Mitspieler)
    // =========================================================================
    async joinWithOffer(offerInput) {
      this.reset();
      this.role = "guest";

      const payload = await decodeSignalPayload(offerInput);
      if (payload.t !== "o" || !payload.sdp) {
        throw new Error("Das ist kein gültiger Einladungs-Code vom Spielleiter.");
      }

      const pc = new RTCPeerConnection({ iceServers: DEFAULT_ICE_SERVERS });
      const guestConn = { pc, dc: null, connected: false };
      this.guestConn = guestConn;

      pc.ondatachannel = (event) => {
        const dc = event.channel;
        guestConn.dc = dc;

        dc.onopen = () => {
          guestConn.connected = true;
          if (this.callbacks.onConnectedToHost) {
            this.callbacks.onConnectedToHost();
          }
        };

        dc.onmessage = (ev) => {
          try {
            const msg = JSON.parse(ev.data);
            if (this.callbacks.onMessageFromHost) {
              this.callbacks.onMessageFromHost(msg);
            }
          } catch (_e) {}
        };

        const handleHostClose = () => {
          if (guestConn.connected) {
            guestConn.connected = false;
            if (this.callbacks.onDisconnectedFromHost) {
              this.callbacks.onDisconnectedFromHost();
            }
          }
        };

        dc.onclose = handleHostClose;
      };

      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed" ||
          pc.connectionState === "closed"
        ) {
          if (guestConn.connected) {
            guestConn.connected = false;
            if (this.callbacks.onDisconnectedFromHost) {
              this.callbacks.onDisconnectedFromHost();
            }
          }
        }
      };

      await pc.setRemoteDescription(
        new RTCSessionDescription({ type: "offer", sdp: payload.sdp })
      );
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await waitForIceGathering(pc);

      const answerCode = await encodeSignalPayload({
        t: "a",
        sdp: pc.localDescription.sdp
      });

      return { answerCode };
    }

    sendToHost(msgObj) {
      if (
        this.guestConn &&
        this.guestConn.connected &&
        this.guestConn.dc &&
        this.guestConn.dc.readyState === "open"
      ) {
        try {
          this.guestConn.dc.send(JSON.stringify(msgObj));
        } catch (_e) {}
      }
    }
  }

  const exportsObj = {
    KuhNetzwerkManager,
    encodeSignalPayload,
    decodeSignalPayload,
    extractCodeFromInput,
    buildInviteLink
  };

  root.KuhNetzwerk = exportsObj;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = exportsObj;
  }
})(typeof window !== "undefined" ? window : globalThis);
