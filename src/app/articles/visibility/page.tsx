"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import styles from "./visibility.module.css";

const C_LIGHT = 3e8;
const BASELINE = 55;
const COLORS = ["#378ADD", "#1D9E75", "#D85A30"];

const UV_CSS_SIZE = 200;
const UV_RANGE = 9;

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return dark;
}

type CanvasSetup = { ctx: CanvasRenderingContext2D; W: number; H: number };

/** DPR対応でcanvasをセットアップ。描画はCSS座標(W×H)で行う */
function setupCanvas(
  canvas: HTMLCanvasElement,
  cssW: number,
  cssH: number
): CanvasSetup | null {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.scale(dpr, dpr);
  return { ctx, W: cssW, H: cssH };
}

/** 親要素幅に合わせてリサイズ */
function resizeCanvas(canvas: HTMLCanvasElement, cssH: number): CanvasSetup | null {
  const cssW = (canvas.parentElement?.clientWidth ?? 740) - 40;
  return setupCanvas(canvas, cssW, cssH);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default function Page() {
  const dark = useDarkMode();

  const fg = dark ? "#e0ded6" : "#1a1a1a";
  const muted = dark ? "#9c9a92" : "#73726c";

  // Section 1 state
  const [a1, setA1] = useState(60);
  const [a2, setA2] = useState(40);
  const [a3, setA3] = useState(30);
  const sigRef = useRef<HTMLCanvasElement>(null);
  const specRef = useRef<HTMLCanvasElement>(null);

  // Section 4 state
  const [freq, setFreq] = useState(150);
  const uvplotRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<{ f: number; u: number }[]>([]);

  // Section 2 refs
  const c1Ref = useRef<HTMLCanvasElement>(null);
  const c2Ref = useRef<HTMLCanvasElement>(null);
  const c3Ref = useRef<HTMLCanvasElement>(null);
  const c4Ref = useRef<HTMLCanvasElement>(null);
  const uvRef = useRef<HTMLCanvasElement>(null);

  // Section 2 interactive u-v explorer
  const [uvIx, setUvIx] = useState(3);
  const [uvIy, setUvIy] = useState(2);
  const uvInteractRef = useRef<HTMLCanvasElement>(null);
  const stripeInteractRef = useRef<HTMLCanvasElement>(null);
  const isDraggingUV = useRef(false);

  // Section 5 ref
  const cnnplotRef = useRef<HTMLCanvasElement>(null);
  const cnnAnimRef = useRef<number | null>(null);
  const kernelPosRef = useRef(0);
  const animDirRef = useRef(1);

  // Section 1: draw signal and spectrum
  const drawSection1 = useCallback(() => {
    const sigC = sigRef.current;
    const specC = specRef.current;
    if (!sigC || !specC) return;
    const sig = resizeCanvas(sigC, 130);
    const spec = resizeCanvas(specC, 150);
    if (!sig || !spec) return;
    const { ctx: sCtx, W, H } = sig;
    const { ctx: spCtx, W: SW, H: SH } = spec;

    const amp1 = a1 / 100, amp2 = a2 / 100, amp3 = a3 / 100;
    const freqs = [2, 5, 11];
    const amps = [amp1, amp2, amp3];

    sCtx.clearRect(0, 0, W, H);
    sCtx.strokeStyle = muted;
    sCtx.lineWidth = 0.5;
    sCtx.beginPath();
    sCtx.moveTo(30, H / 2);
    sCtx.lineTo(W - 10, H / 2);
    sCtx.stroke();

    for (let k = 0; k < 3; k++) {
      sCtx.strokeStyle = COLORS[k];
      sCtx.globalAlpha = 0.25;
      sCtx.lineWidth = 1;
      sCtx.beginPath();
      for (let x = 0; x < W - 40; x++) {
        const t = x / (W - 40);
        const y = H / 2 - amps[k] * 45 * Math.sin(2 * Math.PI * freqs[k] * t);
        x === 0 ? sCtx.moveTo(x + 30, y) : sCtx.lineTo(x + 30, y);
      }
      sCtx.stroke();
    }
    sCtx.globalAlpha = 1;
    sCtx.strokeStyle = fg;
    sCtx.lineWidth = 2;
    sCtx.beginPath();
    for (let x = 0; x < W - 40; x++) {
      const t = x / (W - 40);
      let y = 0;
      for (let k = 0; k < 3; k++) y += amps[k] * 45 * Math.sin(2 * Math.PI * freqs[k] * t);
      x === 0 ? sCtx.moveTo(x + 30, H / 2 - y) : sCtx.lineTo(x + 30, H / 2 - y);
    }
    sCtx.stroke();

    spCtx.clearRect(0, 0, SW, SH);
    spCtx.strokeStyle = muted;
    spCtx.lineWidth = 0.5;
    spCtx.beginPath();
    spCtx.moveTo(30, SH - 30);
    spCtx.lineTo(SW - 10, SH - 30);
    spCtx.stroke();
    const barW = 40;
    const labels = ["低 (f=2)", "中 (f=5)", "高 (f=11)"];
    const spacing = (SW - 80) / (3 + 1);
    for (let k = 0; k < 3; k++) {
      const cx = 60 + spacing * (k + 1);
      const bh = amps[k] * (SH - 55);
      spCtx.fillStyle = COLORS[k];
      spCtx.fillRect(cx - barW / 2, SH - 30 - bh, barW, bh);
      spCtx.fillStyle = fg;
      spCtx.font = "12px sans-serif";
      spCtx.textAlign = "center";
      spCtx.fillText(labels[k], cx, SH - 12);
      spCtx.fillText(amps[k].toFixed(1), cx, SH - 36 - bh);
    }
    spCtx.fillStyle = muted;
    spCtx.font = "12px sans-serif";
    spCtx.textAlign = "center";
    spCtx.fillText("周波数 →", SW / 2, SH);
  }, [a1, a2, a3, fg, muted]);

  useEffect(() => {
    drawSection1();
  }, [drawSection1]);

  // Section 2: 2D stripes
  const drawSection2 = useCallback(() => {
    // stripe canvases: pixel-level imageData → use raw pixel dimensions
    function drawStripe(
      canvas: HTMLCanvasElement | null,
      kx: number,
      ky: number,
      amp: number
    ) {
      if (!canvas) return;
      const s = setupCanvas(canvas, 110, 110);
      if (!s) return;
      // imageData operates in physical pixels, so use canvas.width/height
      const PW = canvas.width, PH = canvas.height;
      const img = s.ctx.createImageData(PW, PH);
      for (let y = 0; y < PH; y++) {
        for (let x = 0; x < PW; x++) {
          const val = 128 + amp * 127 * Math.sin(2 * Math.PI * (kx * x / PW + ky * y / PH));
          const i = (y * PW + x) * 4;
          img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.round(val);
          img.data[i + 3] = 255;
        }
      }
      // putImageData bypasses transform, so reset scale first
      s.ctx.setTransform(1, 0, 0, 1, 0, 0);
      s.ctx.putImageData(img, 0, 0);
    }

    function drawCombined() {
      const canvas = c4Ref.current;
      if (!canvas) return;
      const s = setupCanvas(canvas, 110, 110);
      if (!s) return;
      const PW = canvas.width, PH = canvas.height;
      const img = s.ctx.createImageData(PW, PH);
      const waves: [number, number, number][] = [[0, 2, 0.4], [0, 7, 0.3], [3, 3, 0.3]];
      for (let y = 0; y < PH; y++) {
        for (let x = 0; x < PW; x++) {
          let val = 0;
          for (const [kx, ky, a] of waves) val += a * Math.sin(2 * Math.PI * (kx * x / PW + ky * y / PH));
          val = Math.max(0, Math.min(255, Math.round(128 + val * 127)));
          const i = (y * PW + x) * 4;
          img.data[i] = img.data[i + 1] = img.data[i + 2] = val;
          img.data[i + 3] = 255;
        }
      }
      s.ctx.setTransform(1, 0, 0, 1, 0, 0);
      s.ctx.putImageData(img, 0, 0);
    }

    function drawUV() {
      const canvas = uvRef.current;
      if (!canvas) return;
      const s = setupCanvas(canvas, 220, 220);
      if (!s) return;
      const { ctx, W, H } = s;
      ctx.fillStyle = dark ? "#2C2C2A" : "#F1EFE8";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = muted;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = muted;
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("u (横方向)", W / 2, H - 4);
      ctx.save();
      ctx.translate(12, H / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("v (縦方向)", 0, 0);
      ctx.restore();
      const pts = [
        { u: 0, v: 2, color: "#378ADD", label: "低周波・横" },
        { u: 0, v: 7, color: "#1D9E75", label: "高周波・横" },
        { u: 3, v: 3, color: "#D85A30", label: "中周波・斜め" },
      ];
      const scale = 10;
      for (const p of pts) {
        const px = W / 2 + p.u * scale;
        const py = H / 2 + p.v * scale;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = muted;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(p.label, px + 9, py + 4);
      }
      ctx.strokeStyle = muted;
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = 0.5;
      for (const r of [30, 60, 90]) {
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    drawStripe(c1Ref.current, 0, 2, 0.4);
    drawStripe(c2Ref.current, 0, 7, 0.3);
    drawStripe(c3Ref.current, 3, 3, 0.3);
    drawCombined();
    drawUV();
  }, [dark, muted]);

  useEffect(() => {
    drawSection2();
  }, [drawSection2]);

  // Section 2 interactive: u-v explorer
  const drawUVInteract = useCallback(() => {
    const canvas = uvInteractRef.current;
    if (!canvas) return;
    const s = setupCanvas(canvas, UV_CSS_SIZE, UV_CSS_SIZE);
    if (!s) return;
    const { ctx, W, H } = s;
    const sc = (W / 2) / UV_RANGE;

    ctx.fillStyle = dark ? "#2C2C2A" : "#F1EFE8";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = muted;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.15;
    for (let i = -8; i <= 8; i += 2) {
      const gx = W / 2 + i * sc;
      const gy = H / 2 + i * sc;
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Concentric circles
    ctx.strokeStyle = muted;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.2;
    for (const r of [2, 4, 6, 8]) {
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, r * sc, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Axes
    ctx.strokeStyle = muted;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.45;
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
    ctx.globalAlpha = 1;

    // Axis labels
    ctx.fillStyle = muted;
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("u →", W - 4, H / 2 - 5);
    ctx.textAlign = "left";
    ctx.fillText("v ↓", W / 2 + 5, 14);

    // Radius tick labels
    ctx.font = "10px sans-serif";
    ctx.globalAlpha = 0.5;
    for (const r of [2, 4, 6]) {
      ctx.fillText(String(r), W / 2 + r * sc + 2, H / 2 - 3);
    }
    ctx.globalAlpha = 1;

    const px = W / 2 + uvIx * sc;
    const py = H / 2 + uvIy * sc;

    // Line from origin to dot
    ctx.strokeStyle = "#378ADD";
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.moveTo(W / 2, H / 2); ctx.lineTo(px, py); ctx.stroke();
    ctx.globalAlpha = 1;

    // Dot
    ctx.fillStyle = "#378ADD";
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = dark ? "#1a1a18" : "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [uvIx, uvIy, dark, muted]);

  const drawStripeInteract = useCallback(() => {
    const canvas = stripeInteractRef.current;
    if (!canvas) return;
    const s = setupCanvas(canvas, 180, 180);
    if (!s) return;
    const { ctx } = s;
    const PW = canvas.width;
    const PH = canvas.height;
    const kx = uvIx;
    const ky = uvIy;

    const img = ctx.createImageData(PW, PH);
    for (let y = 0; y < PH; y++) {
      for (let x = 0; x < PW; x++) {
        const v = 128 + 127 * Math.sin(2 * Math.PI * (kx * x / PW + ky * y / PH));
        const i = (y * PW + x) * 4;
        const c = Math.round(Math.max(0, Math.min(255, v)));
        img.data[i] = img.data[i + 1] = img.data[i + 2] = c;
        img.data[i + 3] = 255;
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.putImageData(img, 0, 0);

    // Re-apply DPR for overlay annotations
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = 180, H = 180;
    const cx = W / 2, cy = H / 2;
    const mag = Math.sqrt(kx * kx + ky * ky);

    if (mag > 0.1) {
      // Stripe direction: perpendicular to k-vector
      const sx = -ky / mag, sy = kx / mag;
      const len = 62;
      ctx.strokeStyle = "#FF6B6B";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(cx - sx * len, cy - sy * len);
      ctx.lineTo(cx + sx * len, cy + sy * len);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // k-vector arrow (propagation direction)
      const kwx = kx / mag, kwy = ky / mag;
      const klen = 36;
      ctx.strokeStyle = "#4DD4A3";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + kwx * klen, cy + kwy * klen);
      ctx.stroke();
      const ax = cx + kwx * klen, ay = cy + kwy * klen;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - kwx * 8 + kwy * 5, ay - kwy * 8 - kwx * 5);
      ctx.lineTo(ax - kwx * 8 - kwy * 5, ay - kwy * 8 + kwx * 5);
      ctx.closePath();
      ctx.fillStyle = "#4DD4A3";
      ctx.fill();
      ctx.globalAlpha = 1;

      // Labels with dark backdrop
      ctx.font = "bold 10px sans-serif";
      const drawLabel = (text: string, lx: number, ly: number, color: string) => {
        ctx.textAlign = "center";
        const m = ctx.measureText(text);
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(lx - m.width / 2 - 3, ly - 11, m.width + 6, 15);
        ctx.fillStyle = color;
        ctx.fillText(text, lx, ly);
      };
      const lx = cx + sx * (len + 16), ly = cy + sy * (len + 16);
      drawLabel("縞の方向", Math.max(36, Math.min(W - 36, lx)), Math.max(12, Math.min(H - 4, ly)), "#FF9999");
      const kx2 = cx + kwx * (klen + 18), ky2 = cy + kwy * (klen + 18);
      drawLabel("k方向", Math.max(24, Math.min(W - 24, kx2)), Math.max(12, Math.min(H - 4, ky2)), "#80E8C8");
    }
  }, [uvIx, uvIy]);

  useEffect(() => { drawUVInteract(); }, [drawUVInteract]);
  useEffect(() => { drawStripeInteract(); }, [drawStripeInteract]);

  // Section 4: frequency-scale mapping
  const drawSection4 = useCallback(() => {
    const canvas = uvplotRef.current;
    if (!canvas) return;
    const setup = resizeCanvas(canvas, 320);
    if (!setup) return;
    const { ctx, W, H } = setup;

    const f = freq;
    const lam = C_LIGHT / (f * 1e6);
    const u = BASELINE / lam;

    trailRef.current.push({ f, u });
    if (trailRef.current.length > 100) trailRef.current.shift();

    ctx.clearRect(0, 0, W, H);
    const margin = 60, plotW = W - 2 * margin, uMin = 12, uMax = 115;

    ctx.strokeStyle = muted;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.15;
    for (let ug = 20; ug <= 100; ug += 10) {
      const px = margin + (ug - uMin) / (uMax - uMin) * plotW;
      ctx.beginPath(); ctx.moveTo(px, 45); ctx.lineTo(px, H - 60); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = muted;
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(margin, H - 60); ctx.lineTo(W - margin, H - 60); ctx.stroke();
    ctx.fillStyle = muted;
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    for (let ug = 20; ug <= 100; ug += 20) {
      const px = margin + (ug - uMin) / (uMax - uMin) * plotW;
      ctx.fillText(ug + "λ", px, H - 44);
    }
    ctx.fillText("u = b/λ →", W / 2, H - 28);
    ctx.fillText("← 大スケール", margin + 70, 32);
    ctx.fillText("小スケール →", W - margin - 70, 32);
    for (let ug = 20; ug <= 100; ug += 20) {
      const px = margin + (ug - uMin) / (uMax - uMin) * plotW;
      ctx.fillText((1 / ug * 180 / Math.PI).toFixed(1) + "°", px, 52);
    }

    // stripe previews
    const stripeY = 70, stripeH = 55, stripeW = 46;
    for (const ug of [20, 40, 60, 80, 100]) {
      const px = margin + (ug - uMin) / (uMax - uMin) * plotW;
      ctx.save();
      ctx.beginPath();
      ctx.rect(px - stripeW / 2, stripeY, stripeW, stripeH);
      ctx.clip();
      const n = Math.round(ug / 8);
      for (let i = 0; i < stripeW; i++) {
        const val = 0.5 + 0.4 * Math.sin(2 * Math.PI * n * i / stripeW);
        ctx.fillStyle = `rgb(${Math.round(val * 255)},${Math.round(val * 255)},${Math.round(val * 255)})`;
        ctx.fillRect(px - stripeW / 2 + i, stripeY, 1, stripeH);
      }
      ctx.restore();
      ctx.strokeStyle = muted;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(px - stripeW / 2, stripeY, stripeW, stripeH);
    }

    // MWA band
    const px80 = margin + (BASELINE / (C_LIGHT / 80e6) - uMin) / (uMax - uMin) * plotW;
    const px300 = margin + (BASELINE / (C_LIGHT / 300e6) - uMin) / (uMax - uMin) * plotW;
    ctx.fillStyle = dark ? "rgba(55,138,221,0.06)" : "rgba(55,138,221,0.07)";
    ctx.fillRect(px80, 58, px300 - px80, H - 118);
    ctx.fillStyle = muted;
    ctx.font = "10px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("MWA帯域", px80 + 4, H - 64);

    // trail
    for (let i = 0; i < trailRef.current.length; i++) {
      const px = margin + (trailRef.current[i].u - uMin) / (uMax - uMin) * plotW;
      ctx.fillStyle = `rgba(55,138,221,${(i / trailRef.current.length) * 0.3})`;
      ctx.beginPath();
      ctx.arc(px, H - 80, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    // current
    const cpx = margin + (u - uMin) / (uMax - uMin) * plotW;
    ctx.fillStyle = "#378ADD";
    ctx.beginPath();
    ctx.arc(cpx, H - 80, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#378ADD";
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.moveTo(cpx, 52);
    ctx.lineTo(cpx, H - 60);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#378ADD";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(f + " MHz", cpx, H - 8);
  }, [freq, dark, muted]);

  useEffect(() => {
    drawSection4();
  }, [drawSection4]);

  // Section 5: CNN animation
  const drawSection5 = useCallback((kernelPos: number) => {
    const canvas = cnnplotRef.current;
    if (!canvas) return;
    const setup = resizeCanvas(canvas, 280);
    if (!setup) return;
    const { ctx, W, H } = setup;
    ctx.clearRect(0, 0, W, H);

    const channels = [
      { f: 80, label: "80 MHz" },
      { f: 120, label: "120 MHz" },
      { f: 180, label: "180 MHz" },
      { f: 240, label: "240 MHz" },
      { f: 300, label: "300 MHz" },
    ];

    const rowH = 40, startY = 30, leftM = 100, rightM = 140;
    const barAreaW = W - leftM - rightM;

    ctx.fillStyle = fg;
    ctx.font = "11px sans-serif";
    const headerY = 18;
    ctx.textAlign = "left";
    ctx.fillText("チャンネル", 10, headerY);
    ctx.fillText("u = b/λ", leftM, headerY);
    ctx.textAlign = "right";
    ctx.fillText("角度スケール θ", W - 20, headerY);

    for (let i = 0; i < channels.length; i++) {
      const ch = channels[i];
      const lam = C_LIGHT / (ch.f * 1e6);
      const u = BASELINE / lam;
      const theta = (lam / BASELINE) * 180 / Math.PI;
      const y = startY + i * rowH;

      if (i % 2 === 0) {
        ctx.fillStyle = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)";
        ctx.fillRect(0, y, W, rowH);
      }

      ctx.fillStyle = fg;
      ctx.font = "12px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(ch.label, leftM - 16, y + rowH / 2 + 4);

      const maxU = BASELINE / (C_LIGHT / (300 * 1e6));
      const barW = (u / maxU) * barAreaW * 0.85;
      const gradient = ctx.createLinearGradient(leftM, 0, leftM + barW, 0);
      gradient.addColorStop(0, "#378ADD");
      gradient.addColorStop(1, dark ? "#185FA5" : "#85B7EB");
      ctx.fillStyle = gradient;
      roundRect(ctx, leftM, y + 8, barW, rowH - 16, 4);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "left";
      if (barW > 60) ctx.fillText(u.toFixed(1) + "λ", leftM + 8, y + rowH / 2 + 4);

      ctx.fillStyle = fg;
      ctx.textAlign = "right";
      ctx.fillText(theta.toFixed(1) + "°", W - 20, y + rowH / 2 + 4);
    }

    // CNN kernel overlay
    const kernelH = rowH * 2.2;
    const ky = startY + kernelPos * rowH - 4;
    ctx.strokeStyle = "#E24B4A";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(leftM - 4, ky, barAreaW + 8, kernelH);
    ctx.setLineDash([]);
    ctx.fillStyle = "#E24B4A";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("← CNNカーネル", leftM + barAreaW + 14, ky + kernelH / 2 + 4);

    ctx.fillStyle = muted;
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "カーネルがスライドするたびに対応する角度スケールが変わる → 並進不変性が破れる",
      W / 2,
      H - 8
    );
  }, [dark, fg, muted]);

  useEffect(() => {
    const canvas = cnnplotRef.current;
    if (!canvas) return;

    function animate() {
      kernelPosRef.current += animDirRef.current * 0.02;
      if (kernelPosRef.current > 5 - 2.2) animDirRef.current = -1;
      if (kernelPosRef.current < 0) animDirRef.current = 1;
      drawSection5(kernelPosRef.current);
      cnnAnimRef.current = requestAnimationFrame(animate);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!cnnAnimRef.current) animate();
        } else {
          if (cnnAnimRef.current) {
            cancelAnimationFrame(cnnAnimRef.current);
            cnnAnimRef.current = null;
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(canvas);
    drawSection5(kernelPosRef.current);
    return () => {
      observer.disconnect();
      if (cnnAnimRef.current) cancelAnimationFrame(cnnAnimRef.current);
    };
  }, [drawSection5]);

  // Resize handler
  useEffect(() => {
    function handleResize() {
      drawSection1();
      drawSection2();
      drawSection4();
      drawSection5(kernelPosRef.current);
      drawUVInteract();
      drawStripeInteract();
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawSection1, drawSection2, drawSection4, drawSection5, drawUVInteract, drawStripeInteract]);

  // Derived values for Section 4 display
  const lam = C_LIGHT / (freq * 1e6);
  const uval = BASELINE / lam;
  const theta_deg = (lam / BASELINE) * 180 / Math.PI;

  // Interactive u-v event handlers
  const sc = (UV_CSS_SIZE / 2) / UV_RANGE;
  const getKCoords = (clientX: number, clientY: number, rect: DOMRect) => {
    const kx = Math.round(((clientX - rect.left) / rect.width * UV_CSS_SIZE - UV_CSS_SIZE / 2) / sc * 10) / 10;
    const ky = Math.round(((clientY - rect.top) / rect.height * UV_CSS_SIZE - UV_CSS_SIZE / 2) / sc * 10) / 10;
    return { kx: Math.max(-8, Math.min(8, kx)), ky: Math.max(-8, Math.min(8, ky)) };
  };
  const handleUVMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingUV.current = true;
    const { kx, ky } = getKCoords(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
    setUvIx(kx); setUvIy(ky);
  };
  const handleUVMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingUV.current) return;
    const { kx, ky } = getKCoords(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
    setUvIx(kx); setUvIy(ky);
  };
  const handleUVMouseUp = () => { isDraggingUV.current = false; };
  const handleUVTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDraggingUV.current = true;
    const t = e.touches[0];
    const { kx, ky } = getKCoords(t.clientX, t.clientY, e.currentTarget.getBoundingClientRect());
    setUvIx(kx); setUvIy(ky);
  };
  const handleUVTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDraggingUV.current) return;
    const t = e.touches[0];
    const { kx, ky } = getKCoords(t.clientX, t.clientY, e.currentTarget.getBoundingClientRect());
    setUvIx(kx); setUvIy(ky);
  };

  return (
    <>
      <Navbar />
      <div className={styles.page}>
      <div className={styles.inner}>
        <h1>電波干渉計 Visibility とフーリエ変換の直感的理解</h1>
        <p className={styles.mutedText} style={{ marginBottom: 32 }}>
          MWA（基線長 55m）のデータを例に、visibilityの物理的意味とCNNの周波数方向への畳み込みがなぜ不適切かを視覚的に解説します。
        </p>

        {/* ===== Section 1 ===== */}
        <div className={styles.section}>
          <h2>1. フーリエ変換とは何か</h2>
          <p>
            フーリエ変換の本質は<strong>「ある信号を、さまざまな周期（スケール）の波の重ね合わせとして分解する」</strong>操作です。下のスライダーで各波の振幅を変えてみてください。
          </p>
          <div className={styles.widgetBox}>
            <div className={styles.labelSm}>元の信号（3つの波の重ね合わせ）</div>
            <canvas ref={sigRef} height={130} />
            <div className={styles.ctrl}>
              <span>低周波 (f=2)</span>
              <input type="range" min={0} max={100} value={a1} onChange={(e) => setA1(Number(e.target.value))} />
              <span>{(a1 / 100).toFixed(1)}</span>
            </div>
            <div className={styles.ctrl}>
              <span>中周波 (f=5)</span>
              <input type="range" min={0} max={100} value={a2} onChange={(e) => setA2(Number(e.target.value))} />
              <span>{(a2 / 100).toFixed(1)}</span>
            </div>
            <div className={styles.ctrl}>
              <span>高周波 (f=11)</span>
              <input type="range" min={0} max={100} value={a3} onChange={(e) => setA3(Number(e.target.value))} />
              <span>{(a3 / 100).toFixed(1)}</span>
            </div>
            <div className={styles.labelSm} style={{ marginTop: 18 }}>フーリエ変換の結果</div>
            <canvas ref={specRef} height={150} />
            <p className={styles.caption}>棒の高さ＝その周波数成分の振幅。スライダーと連動します。</p>
          </div>
        </div>

        {/* ===== Section 2 ===== */}
        <div className={styles.section}>
          <h2>2. 1次元 → 2次元フーリエ変換</h2>
          <p>
            1次元では「時間 → 周波数」でしたが、2次元では<strong>「空間の画像 → 空間周波数」</strong>になります。2次元の「波」とは空間的な縞模様であり、任意の画像はさまざまな方向・細かさの縞模様の重ね合わせとして分解できます。
          </p>
          <div className={styles.widgetBox}>
            <div className={styles.labelSm} style={{ textAlign: "center" }}>2次元の「波」＝空間の縞模様</div>
            <div className={styles.row}>
              <div className={styles.item}>
                <canvas ref={c1Ref} width={110} height={110} />
                <p>低周波・横縞<br />(大スケール)</p>
              </div>
              <div className={styles.op}>+</div>
              <div className={styles.item}>
                <canvas ref={c2Ref} width={110} height={110} />
                <p>高周波・横縞<br />(小スケール)</p>
              </div>
              <div className={styles.op}>+</div>
              <div className={styles.item}>
                <canvas ref={c3Ref} width={110} height={110} />
                <p>中周波・斜め縞<br />(中スケール)</p>
              </div>
              <div className={styles.op}>=</div>
              <div className={styles.item}>
                <canvas ref={c4Ref} width={110} height={110} />
                <p>重ね合わせ<br />(これが「画像」)</p>
              </div>
            </div>
            <div className={styles.labelSm} style={{ textAlign: "center", marginTop: 20 }}>フーリエ空間 (u-v平面)</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <canvas ref={uvRef} width={220} height={220} />
            </div>
            <p className={styles.caption}>各点が一つの縞模様に対応。中心からの距離 ＝ 空間周波数（縞の細かさ）</p>
          </div>

          {/* Interactive u-v explorer */}
          <div className={styles.widgetBox} style={{ marginTop: 16 }}>
            <div className={styles.labelSm} style={{ textAlign: "center" }}>
              u-v空間の点をドラッグして縞模様を確認
            </div>
            <p style={{ fontSize: 13, color: muted, margin: "6px 0 12px", textAlign: "center" }}>
              点を動かすと右の縞模様がリアルタイムに変わります。赤線＝縞の方向、緑矢印＝k-ベクトル（波の伝播方向）
            </p>
            <div style={{ display: "flex", gap: 20, justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 12, color: muted, textAlign: "center", marginBottom: 4 }}>u-v 空間（点をドラッグ）</div>
                <canvas
                  ref={uvInteractRef}
                  width={UV_CSS_SIZE}
                  height={UV_CSS_SIZE}
                  style={{ cursor: "crosshair", border: "1px solid var(--border)", borderRadius: 6, display: "block", touchAction: "none" }}
                  onMouseDown={handleUVMouseDown}
                  onMouseMove={handleUVMouseMove}
                  onMouseUp={handleUVMouseUp}
                  onMouseLeave={handleUVMouseUp}
                  onTouchStart={handleUVTouchStart}
                  onTouchMove={handleUVTouchMove}
                  onTouchEnd={handleUVMouseUp}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: muted, textAlign: "center", marginBottom: 4 }}>対応する縞模様</div>
                <canvas
                  ref={stripeInteractRef}
                  width={180}
                  height={180}
                  style={{ border: "1px solid var(--border)", borderRadius: 6, display: "block" }}
                />
              </div>
            </div>

            {/* Info cards */}
            <div className={styles.infoRow} style={{ marginTop: 14 }}>
              <div className={styles.infoCard}>
                <div className="lbl">kx（横方向）</div>
                <div className="val">{uvIx.toFixed(1)}</div>
              </div>
              <div className={styles.infoCard}>
                <div className="lbl">ky（縦方向）</div>
                <div className="val">{uvIy.toFixed(1)}</div>
              </div>
              <div className={styles.infoCard}>
                <div className="lbl">空間周波数 |k|</div>
                <div className="val">{Math.sqrt(uvIx * uvIx + uvIy * uvIy).toFixed(1)}</div>
              </div>
              <div className={styles.infoCard}>
                <div className="lbl">縞の傾き（水平から）</div>
                <div className="val">{(Math.atan2(uvIx, uvIy) * 180 / Math.PI).toFixed(0)}°</div>
              </div>
            </div>

            {/* Preset buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {([
                { label: "横縞・大スケール", kx: 0, ky: 2 },
                { label: "縦縞", kx: 3, ky: 0 },
                { label: "斜め縞45°", kx: 3, ky: 3 },
                { label: "横縞・細かい", kx: 0, ky: 7 },
                { label: "斜め細かい", kx: 5, ky: 4 },
              ] as { label: string; kx: number; ky: number }[]).map((p) => {
                const active = Math.abs(uvIx - p.kx) < 0.05 && Math.abs(uvIy - p.ky) < 0.05;
                return (
                  <button
                    key={p.label}
                    onClick={() => { setUvIx(p.kx); setUvIy(p.ky); }}
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: active ? "var(--blue)" : "var(--bg)",
                      color: active ? "#fff" : "var(--fg)",
                      cursor: "pointer",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            <p className={styles.caption} style={{ marginTop: 10 }}>
              中心に近いほど太い縞（大スケール）・遠いほど細かい縞（小スケール）。点の位置の角度が縞の法線方向を決める。kx=0なら横縞、ky=0なら縦縞。
            </p>
          </div>
        </div>

        {/* ===== Section 3 ===== */}
        <div className={styles.section}>
          <h2>3. 干渉計と Visibility の関係</h2>
          <p>
            干渉計の2本のアンテナの相関出力（visibility）は、天球上の輝度分布の2次元フーリエ成分をサンプリングしたものです（van Cittert-Zernike定理）。
          </p>
          <p>
            基線ベクトル <strong>b</strong> を持つアンテナ対が測定するu-v座標は：
          </p>
          <div className={styles.eq}>u = b / λ &emsp;（基線長 ÷ 観測波長）</div>
          <div className={styles.widgetBox}>
            <svg viewBox="0 0 680 420" style={{ width: "100%", height: "auto" }}>
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#378ADD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>
              <text fill="var(--fg)" fontSize="14" fontWeight="500" x="170" y="24" textAnchor="middle">実空間（アンテナ配置）</text>
              <line x1="40" y1="280" x2="300" y2="280" stroke="var(--muted)" strokeWidth="0.5" opacity="0.3" />
              <rect x="75" y="245" width="14" height="35" rx="2" fill="var(--bg2)" stroke="var(--muted)" strokeWidth="0.5" />
              <line x1="82" y1="228" x2="82" y2="245" stroke="var(--fg)" strokeWidth="1.5" />
              <path d="M69 228 L82 210 L95 228" fill="none" stroke="var(--fg)" strokeWidth="1.5" />
              <rect x="231" y="245" width="14" height="35" rx="2" fill="var(--bg2)" stroke="var(--muted)" strokeWidth="0.5" />
              <line x1="238" y1="228" x2="238" y2="245" stroke="var(--fg)" strokeWidth="1.5" />
              <path d="M225 228 L238 210 L251 228" fill="none" stroke="var(--fg)" strokeWidth="1.5" />
              <line x1="82" y1="300" x2="238" y2="300" stroke="var(--blue,#378ADD)" strokeWidth="2" markerEnd="url(#arr)" />
              <text fill="var(--blue,#378ADD)" fontSize="12" x="160" y="318" textAnchor="middle">基線 b = 55m</text>
              <g opacity="0.15">
                <line x1="60" y1="120" x2="260" y2="120" stroke="var(--fg)" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="60" y1="140" x2="260" y2="140" stroke="var(--fg)" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="60" y1="160" x2="260" y2="160" stroke="var(--fg)" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="60" y1="180" x2="260" y2="180" stroke="var(--fg)" strokeWidth="0.5" strokeDasharray="4 4" />
              </g>
              <text fill="var(--muted)" fontSize="12" x="160" y="110" textAnchor="middle">入射電波（平面波）</text>
              <text fill="var(--fg)" fontSize="14" fontWeight="500" x="510" y="24" textAnchor="middle">フーリエ空間 (u-v平面)</text>
              <line x1="510" y1="60" x2="510" y2="340" stroke="var(--muted)" strokeWidth="0.5" opacity="0.3" />
              <line x1="380" y1="200" x2="640" y2="200" stroke="var(--muted)" strokeWidth="0.5" opacity="0.3" />
              <text fill="var(--muted)" fontSize="12" x="644" y="204">u</text>
              <text fill="var(--muted)" fontSize="12" x="514" y="62">v</text>
              <circle cx="510" cy="200" r="40" fill="none" stroke="var(--muted)" strokeWidth="0.5" opacity="0.12" />
              <circle cx="510" cy="200" r="80" fill="none" stroke="var(--muted)" strokeWidth="0.5" opacity="0.12" />
              <circle cx="510" cy="200" r="120" fill="none" stroke="var(--muted)" strokeWidth="0.5" opacity="0.12" />
              <circle cx="572" cy="200" r="7" fill="#378ADD" />
              <text fill="#378ADD" fontSize="12" x="586" y="196">b/λ</text>
              <path d="M270 260 C320 260, 350 220, 390 205" fill="none" stroke="var(--coral,#D85A30)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr)" />
              <text fill="var(--coral,#D85A30)" fontSize="12" x="332" y="248" textAnchor="middle">u = b/λ</text>
              <rect x="40" y="355" width="600" height="50" rx="10" fill="var(--teal-bg,#E1F5EE)" />
              <text fill="var(--teal-dark,#0F6E56)" fontSize="13" fontWeight="500" x="340" y="378" textAnchor="middle">同じ基線(55m)でも観測周波数が変わると λ が変わり、u-v上の位置が変わる</text>
            </svg>
          </div>
        </div>

        {/* ===== Section 4 ===== */}
        <div className={styles.section}>
          <h2>4. 周波数チャンネルとスケールの対応</h2>
          <p>
            「スケール」とは<strong>天球上の角度的な大きさ</strong>のことです。角度スケール θ ≈ λ/b であり、u-v平面の中心から遠いほど小さな（細かい）角度スケールに対応します。
          </p>
          <div className={styles.widgetBox}>
            <div className={styles.ctrl}>
              <span>観測周波数</span>
              <input type="range" id="freq" min={80} max={300} value={freq} step={1} onChange={(e) => setFreq(Number(e.target.value))} />
              <span>{freq} MHz</span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoCard}>
                <div className="lbl">波長 λ</div>
                <div className="val">{lam.toFixed(2)} m</div>
              </div>
              <div className={styles.infoCard}>
                <div className="lbl">u = b/λ</div>
                <div className="val">{uval.toFixed(1)} λ</div>
              </div>
              <div className={styles.infoCard}>
                <div className="lbl">角度スケール θ ≈ λ/b</div>
                <div className="val">{theta_deg.toFixed(1)}°</div>
              </div>
            </div>
            <canvas ref={uvplotRef} height={320} />
            <p className={styles.caption}>スライダーを動かすと、同じ55m基線でも周波数によって感度を持つスケールが変わることがわかります</p>
          </div>
        </div>

        {/* ===== Section 5 ===== */}
        <div className={styles.section}>
          <h2>5. なぜCNNの畳み込みは周波数方向に不適切か</h2>
          <p>
            CNNの畳み込み層は<strong>並進不変性</strong>を仮定しています：同じカーネルをデータ上でスライドさせても同じパターンが同じ意味を持つ、という前提です。
          </p>
          <div className={`${styles.noteBox} ${styles.noteCoral}`}>
            <strong>問題：</strong>Visibilityデータの周波数軸上では、チャンネルごとに対応するu値（＝角度スケール）が異なります。80MHzでは u≈14.7λ（θ≈3.9°）、300MHzでは u≈55.0λ（θ≈1.0°）。周波数方向にカーネルをスライドさせると、カーネルが「見ている」物理スケールが連続的に変わり、並進不変性が成り立ちません。
          </div>
          <div className={styles.widgetBox}>
            <canvas ref={cnnplotRef} height={280} />
            <p className={styles.caption}>赤い枠がCNNカーネル。周波数方向にスライドすると対応する角度スケールが変わってしまう</p>
          </div>
          <div className={`${styles.noteBox} ${styles.noteTeal}`}>
            <strong>解決の方向性：</strong>各チャンネルのu値に応じてカーネルを適応的に変化させるか、あらかじめu-v空間（物理的に等しいスケール空間）にグリッディングしてから処理する、などのアプローチが考えられます。
          </div>
        </div>

        {/* ===== Summary ===== */}
        <div className={styles.section}>
          <h2>まとめ</h2>
          <div className={styles.summaryBox}>
            <p><strong>フーリエ変換</strong>＝信号を波の重ね合わせに分解する操作</p>
            <p><strong>Visibility</strong>＝天球輝度分布の2次元フーリエ成分のサンプル</p>
            <p><strong>u-v座標 = b/λ</strong> → 同じ基線でも周波数が変わればu-v上の位置が変わる</p>
            <p><strong>スケール（θ ≈ λ/b）</strong>＝その基線・波長で感度を持つ天球上の角度サイズ</p>
            <p><strong>CNNが不適切な理由</strong>＝周波数方向の並進不変性が物理的に成立しない</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
