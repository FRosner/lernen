// Eigenständiges QR-Code-Modul für Kuhrennen (Erzeugung + Kamera-Scanner)
// Nutzt für die Erzeugung reines JavaScript und für das Scannen BarcodeDetector (falls verfügbar)
// mit lokalem jsQR-Fallback (funktioniert auch unter iOS Safari / Firefox ohne Internet).

(function (root) {
  "use strict";

  // =========================================================================
  // 1. QR-CODE GENERATOR (ISO/IEC 18004, Byte-Modus, Fehlerkorrektur Level L)
  // =========================================================================

  // [totalCodewords, ecCodewordsPerBlock, g1Blocks, g1Data, g2Blocks, g2Data]
  const ECC_L_TABLE = [
    null,
    [26, 7, 1, 19, 0, 0],     // v1
    [44, 10, 1, 34, 0, 0],    // v2
    [70, 15, 1, 55, 0, 0],    // v3
    [100, 20, 1, 80, 0, 0],   // v4
    [134, 26, 1, 108, 0, 0],  // v5
    [172, 18, 2, 68, 0, 0],   // v6
    [196, 20, 2, 78, 0, 0],   // v7
    [242, 24, 2, 97, 0, 0],   // v8
    [292, 30, 2, 116, 0, 0],  // v9
    [346, 18, 2, 68, 2, 69],  // v10
    [404, 20, 4, 81, 0, 0],   // v11
    [466, 24, 2, 92, 2, 93],  // v12
    [532, 26, 4, 107, 0, 0],  // v13
    [581, 30, 3, 115, 1, 116],// v14
    [655, 22, 5, 87, 1, 88],  // v15
    [733, 24, 5, 98, 1, 99],  // v16
    [815, 28, 1, 107, 5, 108],// v17
    [901, 30, 5, 120, 1, 121],// v18
    [991, 28, 3, 113, 4, 114],// v19
    [1085, 28, 3, 107, 5, 108],// v20
    [1156, 28, 4, 116, 4, 117],// v21
    [1258, 28, 2, 111, 7, 112],// v22
    [1364, 30, 4, 121, 5, 122],// v23
    [1474, 30, 6, 117, 4, 118],// v24
    [1588, 26, 8, 106, 4, 107] // v25
  ];

  const ALIGNMENT_POS = [
    null,
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110]
  ];

  // GF(256) Tabellen für Reed-Solomon (Polynom 0x11d)
  const GF_EXP = new Uint8Array(512);
  const GF_LOG = new Uint8Array(256);
  (function initGF() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      GF_EXP[i] = x;
      GF_LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) {
      GF_EXP[i] = GF_EXP[i - 255];
    }
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return GF_EXP[GF_LOG[a] + GF_LOG[b]];
  }

  function rsGeneratorPoly(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      const next = new Array(poly.length + 1).fill(0);
      const factor = GF_EXP[i];
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gfMul(poly[j], factor);
      }
      poly = next;
    }
    return poly;
  }

  function rsComputeRemainder(data, ecLen) {
    const gen = rsGeneratorPoly(ecLen);
    const res = new Uint8Array(data.length + ecLen);
    res.set(data);
    for (let i = 0; i < data.length; i++) {
      const coef = res[i];
      if (coef !== 0) {
        for (let j = 0; j < gen.length; j++) {
          res[i + j] ^= gfMul(gen[j], coef);
        }
      }
    }
    return res.slice(data.length);
  }

  function pickVersionForByteLen(byteLen) {
    for (let v = 1; v < ECC_L_TABLE.length; v++) {
      const entry = ECC_L_TABLE[v];
      const totalDataBytes = entry[2] * entry[3] + entry[4] * entry[5];
      const headerBits = 4 + (v <= 9 ? 8 : 16);
      const availDataBits = totalDataBytes * 8;
      if (headerBits + byteLen * 8 <= availDataBits) {
        return v;
      }
    }
    throw new Error("Daten sind zu lang für einen QR-Code.");
  }

  function buildCodewords(bytes, version) {
    const [, ecPerBlock, g1Blocks, g1Data, g2Blocks, g2Data] = ECC_L_TABLE[version];
    const totalDataBytes = g1Blocks * g1Data + g2Blocks * g2Data;

    const bits = [];
    const pushBits = (val, len) => {
      for (let i = len - 1; i >= 0; i--) {
        bits.push((val >>> i) & 1);
      }
    };

    // Byte-Modus (0100)
    pushBits(0b0100, 4);
    pushBits(bytes.length, version <= 9 ? 8 : 16);
    for (let i = 0; i < bytes.length; i++) {
      pushBits(bytes[i], 8);
    }

    // Terminator (bis zu 4 Null-Bits)
    const maxBits = totalDataBytes * 8;
    const termLen = Math.min(4, maxBits - bits.length);
    pushBits(0, termLen);

    // Auf Byte-Grenze auffüllen
    while (bits.length % 8 !== 0) bits.push(0);

    // Bytes packen & mit Pad-Bytes (0xEC, 0x11) auffüllen
    const dataBytes = new Uint8Array(totalDataBytes);
    let idx = 0;
    for (let i = 0; i < bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
      dataBytes[idx++] = b;
    }
    const padBytes = [0xec, 0x11];
    let padIdx = 0;
    while (idx < totalDataBytes) {
      dataBytes[idx++] = padBytes[padIdx % 2];
      padIdx++;
    }

    // Blöcke aufteilen & ECC berechnen
    const dataBlocks = [];
    const ecBlocks = [];
    let offset = 0;
    for (let b = 0; b < g1Blocks; b++) {
      const slice = dataBytes.slice(offset, offset + g1Data);
      offset += g1Data;
      dataBlocks.push(slice);
      ecBlocks.push(rsComputeRemainder(slice, ecPerBlock));
    }
    for (let b = 0; b < g2Blocks; b++) {
      const slice = dataBytes.slice(offset, offset + g2Data);
      offset += g2Data;
      dataBlocks.push(slice);
      ecBlocks.push(rsComputeRemainder(slice, ecPerBlock));
    }

    // Blöcke verschachteln (Interleaving)
    const result = [];
    const maxDataLen = Math.max(g1Data, g2Data);
    for (let i = 0; i < maxDataLen; i++) {
      for (let b = 0; b < dataBlocks.length; b++) {
        if (i < dataBlocks[b].length) result.push(dataBlocks[b][i]);
      }
    }
    for (let i = 0; i < ecPerBlock; i++) {
      for (let b = 0; b < ecBlocks.length; b++) {
        result.push(ecBlocks[b][i]);
      }
    }
    return new Uint8Array(result);
  }

  function createMatrix(version) {
    const size = version * 4 + 17;
    const modules = Array.from({ length: size }, () => new Uint8Array(size));
    const isFunc = Array.from({ length: size }, () => new Uint8Array(size));

    const setFunc = (r, c, dark) => {
      if (r >= 0 && r < size && c >= 0 && c < size) {
        modules[r][c] = dark ? 1 : 0;
        isFunc[r][c] = 1;
      }
    };

    // Finder-Muster + Separatoren
    const drawFinder = (top, left) => {
      for (let dr = -1; dr <= 7; dr++) {
        for (let dc = -1; dc <= 7; dc++) {
          const r = top + dr;
          const c = left + dc;
          if (r < 0 || r >= size || c < 0 || c >= size) continue;
          const inBox = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
          const dark =
            inBox &&
            (dr === 0 || dr === 6 || dc === 0 || dc === 6 ||
              (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
          setFunc(r, c, dark);
        }
      }
    };
    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    // Alignment-Muster
    const align = ALIGNMENT_POS[version];
    for (let i = 0; i < align.length; i++) {
      for (let j = 0; j < align.length; j++) {
        const cr = align[i];
        const cc = align[j];
        if (isFunc[cr][cc]) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const dark = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
            setFunc(cr + dr, cc + dc, dark);
          }
        }
      }
    }

    // Timing-Muster
    for (let i = 8; i < size - 8; i++) {
      const dark = i % 2 === 0;
      if (!isFunc[6][i]) setFunc(6, i, dark);
      if (!isFunc[i][6]) setFunc(i, 6, dark);
    }

    // Dunkles Modul & reservierte Format-/Versions-Bereiche
    setFunc(size - 8, 8, true);
    for (let i = 0; i < 9; i++) {
      if (!isFunc[8][i]) setFunc(8, i, false);
      if (!isFunc[i][8]) setFunc(i, 8, false);
    }
    for (let i = 0; i < 8; i++) {
      if (!isFunc[8][size - 1 - i]) setFunc(8, size - 1 - i, false);
      if (!isFunc[size - 1 - i][8]) setFunc(size - 1 - i, 8, false);
    }
    if (version >= 7) {
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
          setFunc(i, size - 11 + j, false);
          setFunc(size - 11 + j, i, false);
        }
      }
    }

    return { size, modules, isFunc };
  }

  function placeDataBits(matrix, codewords) {
    const { size, modules, isFunc } = matrix;
    let bitIdx = 0;
    const totalBits = codewords.length * 8;
    let up = true;

    for (let col = size - 1; col >= 1; col -= 2) {
      if (col === 6) col = 5; // Timing-Spalte überspringen
      for (let step = 0; step < size; step++) {
        const r = up ? size - 1 - step : step;
        for (let dc = 0; dc < 2; dc++) {
          const c = col - dc;
          if (!isFunc[r][c]) {
            let bit = 0;
            if (bitIdx < totalBits) {
              bit = (codewords[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1;
              bitIdx++;
            }
            modules[r][c] = bit;
          }
        }
      }
      up = !up;
    }
  }

  function getMaskBit(mask, r, c) {
    switch (mask) {
      case 0: return (r + c) % 2 === 0;
      case 1: return r % 2 === 0;
      case 2: return c % 3 === 0;
      case 3: return (r + c) % 3 === 0;
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
      case 5: return ((r * c) % 2) + ((r * c) % 3) === 0;
      case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
      case 7: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
      default: return false;
    }
  }

  function computeFormatBits(mask) {
    // ECC Level L = 01
    const data = (0b01 << 3) | mask;
    let rem = data << 10;
    for (let i = 4; i >= 0; i--) {
      if ((rem >>> (i + 10)) & 1) rem ^= 0x537 << i;
    }
    return ((data << 10) | rem) ^ 0x5412;
  }

  function computeVersionBits(version) {
    let rem = version << 12;
    for (let i = 5; i >= 0; i--) {
      if ((rem >>> (i + 12)) & 1) rem ^= 0x1f25 << i;
    }
    return (version << 12) | rem;
  }

  function applyFormatAndVersion(modules, size, version, mask) {
    const fmt = computeFormatBits(mask);
    // Top-left (bits 14..0) & bottom-left / top-right (bits 0..14)
    for (let i = 0; i < 6; i++) {
      modules[8][i] = (fmt >>> (14 - i)) & 1;
      modules[size - 1 - i][8] = (fmt >>> i) & 1;
    }
    modules[8][7] = (fmt >>> 8) & 1;
    modules[8][8] = (fmt >>> 7) & 1;
    modules[7][8] = (fmt >>> 6) & 1;
    for (let i = 0; i < 6; i++) {
      modules[5 - i][8] = (fmt >>> (5 - i)) & 1;
    }

    modules[size - 7][8] = (fmt >>> 6) & 1;
    for (let i = 0; i < 8; i++) {
      modules[8][size - 8 + i] = (fmt >>> (7 + i)) & 1;
    }

    if (version >= 7) {
      const vBits = computeVersionBits(version);
      for (let i = 0; i < 18; i++) {
        const bit = (vBits >>> i) & 1;
        const r = Math.floor(i / 3);
        const c = size - 11 + (i % 3);
        modules[r][c] = bit;
        modules[c][r] = bit;
      }
    }
  }

  function evaluatePenalty(modules, size) {
    let penalty = 0;

    // Regel 1: 5+ gleiche Module in Reihe/Spalte
    for (let r = 0; r < size; r++) {
      let runLen = 1;
      for (let c = 1; c < size; c++) {
        if (modules[r][c] === modules[r][c - 1]) {
          runLen++;
          if (runLen === 5) penalty += 3;
          else if (runLen > 5) penalty += 1;
        } else {
          runLen = 1;
        }
      }
    }
    for (let c = 0; c < size; c++) {
      let runLen = 1;
      for (let r = 1; r < size; r++) {
        if (modules[r][c] === modules[r - 1][c]) {
          runLen++;
          if (runLen === 5) penalty += 3;
          else if (runLen > 5) penalty += 1;
        } else {
          runLen = 1;
        }
      }
    }

    // Regel 2: 2x2 Blöcke gleicher Farbe
    for (let r = 0; r < size - 1; r++) {
      for (let c = 0; c < size - 1; c++) {
        const v = modules[r][c];
        if (v === modules[r][c + 1] && v === modules[r + 1][c] && v === modules[r + 1][c + 1]) {
          penalty += 3;
        }
      }
    }

    // Regel 3: Finder-ähnliche Muster (1:1:3:1:1 mit 4 hellen Modulen davor oder danach)
    const checkPattern = (getVal) => {
      for (let i = 0; i < size; i++) {
        for (let j = 0; j <= size - 11; j++) {
          // 10111010000 oder 00001011101
          const p1 =
            getVal(i, j) === 1 && getVal(i, j + 1) === 0 && getVal(i, j + 2) === 1 &&
            getVal(i, j + 3) === 1 && getVal(i, j + 4) === 1 && getVal(i, j + 5) === 0 &&
            getVal(i, j + 6) === 1 && getVal(i, j + 7) === 0 && getVal(i, j + 8) === 0 &&
            getVal(i, j + 9) === 0 && getVal(i, j + 10) === 0;
          const p2 =
            getVal(i, j) === 0 && getVal(i, j + 1) === 0 && getVal(i, j + 2) === 0 &&
            getVal(i, j + 3) === 0 && getVal(i, j + 4) === 1 && getVal(i, j + 5) === 0 &&
            getVal(i, j + 6) === 1 && getVal(i, j + 7) === 1 && getVal(i, j + 8) === 1 &&
            getVal(i, j + 9) === 0 && getVal(i, j + 10) === 1;
          if (p1 || p2) penalty += 40;
        }
      }
    };
    checkPattern((r, c) => modules[r][c]);
    checkPattern((c, r) => modules[r][c]);

    // Regel 4: Verhältnis dunkler Module
    let dark = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (modules[r][c]) dark++;
      }
    }
    const percent = (dark * 100) / (size * size);
    const k = Math.floor(Math.abs(percent - 50) / 5);
    penalty += k * 10;

    return penalty;
  }

  function encodeQRMatrix(text) {
    const bytes = new TextEncoder().encode(text);
    const version = pickVersionForByteLen(bytes.length);
    const codewords = buildCodewords(bytes, version);
    const base = createMatrix(version);
    placeDataBits(base, codewords);

    let bestMask = 0;
    let bestScore = Infinity;
    let bestModules = null;

    for (let mask = 0; mask < 8; mask++) {
      const candidate = base.modules.map((row) => new Uint8Array(row));
      for (let r = 0; r < base.size; r++) {
        for (let c = 0; c < base.size; c++) {
          if (!base.isFunc[r][c] && getMaskBit(mask, r, c)) {
            candidate[r][c] ^= 1;
          }
        }
      }
      applyFormatAndVersion(candidate, base.size, version, mask);
      const score = evaluatePenalty(candidate, base.size);
      if (score < bestScore) {
        bestScore = score;
        bestMask = mask;
        bestModules = candidate;
      }
    }

    return { size: base.size, modules: bestModules, version };
  }

  function renderToCanvas(canvas, text, options = {}) {
    const { size, modules } = encodeQRMatrix(text);
    const quietZone = options.quietZone !== undefined ? options.quietZone : 4;
    const targetPx = options.sizePx || 240;
    const totalModules = size + quietZone * 2;
    const scale = Math.max(2, Math.floor(targetPx / totalModules));
    const canvasPx = totalModules * scale;

    canvas.width = canvasPx;
    canvas.height = canvasPx;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasPx, canvasPx);

    ctx.fillStyle = "#0f172a";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (modules[r][c]) {
          ctx.fillRect((c + quietZone) * scale, (r + quietZone) * scale, scale, scale);
        }
      }
    }
    return { canvasPx, moduleCount: size };
  }

  // =========================================================================
  // 2. KAMERA QR-SCANNER (BarcodeDetector + jsQR Fallback)
  // =========================================================================
  class QRScanner {
    constructor() {
      this.stream = null;
      this.rafId = null;
      this.running = false;
      this.videoEl = null;
      this.workCanvas = document.createElement("canvas");
      this.workCtx = this.workCanvas.getContext("2d", { willReadFrequently: true });
      this.detector = null;
      if (typeof root.BarcodeDetector === "function") {
        try {
          this.detector = new root.BarcodeDetector({ formats: ["qr_code"] });
        } catch (_e) {
          this.detector = null;
        }
      }
    }

    async start(videoEl, { onDetect, onError, validate }) {
      this.stop();
      this.videoEl = videoEl;

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const err = new Error("Dein Browser unterstützt leider keinen Kamera-Zugriff (oder die Seite läuft nicht über HTTPS).");
        if (onError) onError(err);
        return;
      }

      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (err) {
        const msg =
          err && err.name === "NotAllowedError"
            ? "Kamera-Zugriff wurde abgelehnt. Bitte erlaube die Kamera oder füge den Code unten manuell ein."
            : "Keine Kamera gefunden oder Kamera wird gerade anderweitig verwendet.";
        if (onError) onError(new Error(msg));
        return;
      }

      videoEl.srcObject = this.stream;
      videoEl.setAttribute("playsinline", "true");
      videoEl.muted = true;
      await videoEl.play();

      this.running = true;
      let lastScanTime = 0;
      let busy = false;

      const loop = async (now) => {
        if (!this.running) return;
        this.rafId = requestAnimationFrame(loop);

        if (busy || now - lastScanTime < 130) return;
        if (videoEl.readyState < 2 || videoEl.videoWidth === 0) return;

        lastScanTime = now;
        busy = true;
        try {
          const decoded = await this._decodeFrame(videoEl);
          if (decoded && this.running) {
            if (!validate || validate(decoded)) {
              this.stop();
              if (onDetect) onDetect(decoded);
              return;
            }
          }
        } catch (_e) {
          // Einzelner Frame fehlgeschlagen – einfach weiter scannen
        } finally {
          busy = false;
        }
      };

      this.rafId = requestAnimationFrame(loop);
    }

    async _decodeFrame(videoEl) {
      // 1. Schneller nativer BarcodeDetector (Chrome/Android/Edge)
      if (this.detector) {
        try {
          const codes = await this.detector.detect(videoEl);
          if (codes && codes.length > 0 && codes[0].rawValue) {
            return codes[0].rawValue;
          }
        } catch (_e) {
          // Falls nativer Detector fehlschlägt, auf jsQR zurückfallen
        }
      }

      // 2. Universeller jsQR-Fallback (iOS Safari, Firefox, etc.)
      if (typeof root.jsQR === "function") {
        const vw = videoEl.videoWidth;
        const vh = videoEl.videoHeight;
        const maxDim = 720;
        const scale = Math.min(1, maxDim / Math.max(vw, vh));
        const w = Math.max(1, Math.round(vw * scale));
        const h = Math.max(1, Math.round(vh * scale));

        if (this.workCanvas.width !== w || this.workCanvas.height !== h) {
          this.workCanvas.width = w;
          this.workCanvas.height = h;
        }
        this.workCtx.drawImage(videoEl, 0, 0, w, h);
        const imgData = this.workCtx.getImageData(0, 0, w, h);
        const result = root.jsQR(imgData.data, w, h, {
          inversionAttempts: "dontInvert"
        });
        if (result && result.data) {
          return result.data;
        }
      }
      return null;
    }

    stop() {
      this.running = false;
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.stream) {
        this.stream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (_e) {}
        });
        this.stream = null;
      }
      if (this.videoEl) {
        try {
          this.videoEl.srcObject = null;
        } catch (_e) {}
        this.videoEl = null;
      }
    }
  }

  root.KuhQR = {
    encodeQRMatrix,
    renderToCanvas,
    QRScanner
  };
})(typeof window !== "undefined" ? window : globalThis);
