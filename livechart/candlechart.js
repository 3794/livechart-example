var m = Object.defineProperty;
var p = (v, t, s) => t in v ? m(v, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : v[t] = s;
var c = (v, t, s) => p(v, typeof t != "symbol" ? t + "" : t, s);
class b {
  constructor(t, s, i) {
    c(this, "canvas");
    c(this, "ctx");
    c(this, "overlayCanvas");
    c(this, "overlayCtx");
    c(this, "width");
    c(this, "height");
    c(this, "padding", { top: 40, right: 40, bottom: 40, left: 60 });
    c(this, "candles", []);
    c(this, "minPrice", 0);
    c(this, "maxPrice", 0);
    c(this, "isDragging", !1);
    c(this, "dragStartX", 0);
    c(this, "dragStartY", 0);
    c(this, "scrollOffset", 0);
    c(this, "MANHATTAN_THRESHOLD", 5);
    c(this, "isDragDetected", !1);
    c(this, "barSpacing", 6);
    c(this, "MIN_BAR_SPACING", 2);
    c(this, "MAX_BAR_SPACING", 200);
    c(this, "ZOOM_SPEED", 0.1);
    c(this, "initialPinchDistance", 0);
    c(this, "initialBarSpacing", 0);
    c(this, "initialScrollOffset", 0);
    c(this, "mouseState", {
      x: 0,
      y: 0,
      isInChart: !1
    });
    var o;
    this.width = s, this.height = i;
    const e = window.devicePixelRatio || 1;
    t.style.position = "relative", this.canvas = document.createElement("canvas"), this.canvas.width = s * e, this.canvas.height = i * e, this.canvas.style.width = s + "px", this.canvas.style.height = i + "px", this.canvas.style.border = "1px solid #ccc", this.canvas.style.cursor = "grab", this.canvas.style.display = "block", this.canvas.style.position = "relative", t.appendChild(this.canvas);
    const a = this.canvas.getContext("2d");
    if (!a) throw new Error("Failed to get 2D context");
    this.ctx = a, this.ctx.scale(e, e), this.overlayCanvas = document.createElement("canvas"), this.overlayCanvas.id = "overlay-canvas", this.overlayCanvas.width = s * e, this.overlayCanvas.height = i * e, this.overlayCanvas.style.width = s + "px", this.overlayCanvas.style.height = i + "px", this.overlayCanvas.style.position = "absolute", this.overlayCanvas.style.top = "0", this.overlayCanvas.style.left = "0", this.overlayCanvas.style.cursor = "crosshair", (o = this.canvas.parentElement) == null || o.appendChild(this.overlayCanvas);
    const h = this.overlayCanvas.getContext("2d");
    if (!h) throw new Error("Failed to get overlay 2D context");
    this.overlayCtx = h, this.overlayCtx.scale(e, e), this.attachEventListeners();
  }
  attachEventListeners() {
    this.canvas.addEventListener("mousedown", (t) => this.onMouseDown(t)), document.addEventListener("mousemove", (t) => this.onMouseMove(t)), document.addEventListener("mouseup", (t) => this.onMouseUp(t)), this.canvas.addEventListener("dblclick", (t) => this.onDoubleClick(t)), this.canvas.addEventListener("wheel", (t) => this.onWheel(t)), this.overlayCanvas.addEventListener("mousedown", (t) => this.onMouseDown(t)), this.overlayCanvas.addEventListener("dblclick", (t) => this.onDoubleClick(t)), this.overlayCanvas.addEventListener("wheel", (t) => this.onWheel(t)), this.overlayCanvas.addEventListener(
      "mouseenter",
      (t) => this.onMouseEnter(t)
    ), this.overlayCanvas.addEventListener(
      "mouseleave",
      (t) => this.onMouseLeave(t)
    ), this.canvas.addEventListener("touchstart", (t) => this.onTouchStart(t)), this.canvas.addEventListener("touchmove", (t) => this.onTouchMove(t)), this.canvas.addEventListener("touchend", (t) => this.onTouchEnd(t)), this.overlayCanvas.addEventListener("touchstart", (t) => this.onTouchStart(t)), this.overlayCanvas.addEventListener("touchmove", (t) => this.onTouchMove(t)), this.overlayCanvas.addEventListener("touchend", (t) => this.onTouchEnd(t));
  }
  onMouseDown(t) {
    this.isDragging = !0, this.dragStartX = t.clientX, this.dragStartY = t.clientY, this.isDragDetected = !1, this.canvas.style.cursor = "grabbing";
  }
  onMouseMove(t) {
    const s = this.canvas.getBoundingClientRect();
    if (this.mouseState.x = t.clientX - s.left, this.mouseState.y = t.clientY - s.top, this.mouseState.isInChart && this.draw(), !this.isDragging) return;
    const i = t.clientX - this.dragStartX, e = t.clientY - this.dragStartY, a = Math.abs(i) + Math.abs(e);
    if (!this.isDragDetected && a > this.MANHATTAN_THRESHOLD && (this.isDragDetected = !0), this.isDragDetected) {
      const h = this.getChartArea(), o = t.clientX > h.x + h.width, r = t.clientY > h.y + h.height;
      o && Math.abs(e) > Math.abs(i) ? (this.barSpacing *= 1 + e * 0.01, this.barSpacing = Math.max(
        this.MIN_BAR_SPACING,
        Math.min(this.MAX_BAR_SPACING, this.barSpacing)
      )) : r && Math.abs(i) > Math.abs(e) ? this.scrollOffset += i : Math.abs(i) > Math.abs(e) && !o && !r && (this.scrollOffset += i), this.dragStartX = t.clientX, this.dragStartY = t.clientY, this.draw();
    }
  }
  onMouseUp(t) {
    this.isDragging = !1, this.isDragDetected = !1, this.canvas.style.cursor = "grab";
  }
  onDoubleClick(t) {
    this.barSpacing = 6;
    const s = this.getChartArea(), i = this.candles.length - 1, e = 30;
    this.scrollOffset = s.width - e - i * this.barSpacing, this.draw();
  }
  onWheel(t) {
    const s = t.target;
    if (!(this.canvas.contains(s) || this.overlayCanvas.contains(s))) return;
    t.preventDefault();
    const e = this.getChartArea(), a = this.canvas.getBoundingClientRect(), h = t.clientX - a.left, o = (h - e.x - this.scrollOffset) / this.barSpacing, r = t.deltaY > 0 ? 1 + this.ZOOM_SPEED : 1 - this.ZOOM_SPEED;
    this.barSpacing *= r, this.barSpacing = Math.max(
      this.MIN_BAR_SPACING,
      Math.min(this.MAX_BAR_SPACING, this.barSpacing)
    ), this.scrollOffset = h - e.x - o * this.barSpacing, this.draw();
  }
  onTouchStart(t) {
    if (t.touches.length === 2) {
      const s = t.touches[0], i = t.touches[1];
      this.initialPinchDistance = Math.hypot(
        i.clientX - s.clientX,
        i.clientY - s.clientY
      ), this.initialBarSpacing = this.barSpacing, this.initialScrollOffset = this.scrollOffset;
    } else t.touches.length === 1 && (this.isDragging = !0, this.dragStartX = t.touches[0].clientX, this.dragStartY = t.touches[0].clientY, this.isDragDetected = !1);
  }
  onTouchMove(t) {
    if (t.touches.length === 2) {
      const s = t.touches[0], i = t.touches[1], e = Math.hypot(
        i.clientX - s.clientX,
        i.clientY - s.clientY
      ), a = (s.clientX + i.clientX) / 2, h = e / this.initialPinchDistance, o = this.initialBarSpacing * h;
      this.barSpacing = Math.max(
        this.MIN_BAR_SPACING,
        Math.min(this.MAX_BAR_SPACING, o)
      );
      const r = this.getChartArea(), g = this.canvas.getBoundingClientRect(), l = a - g.left, x = (l - r.x - this.initialScrollOffset) / this.initialBarSpacing;
      this.scrollOffset = l - r.x - x * this.barSpacing, this.draw();
    } else if (t.touches.length === 1 && this.isDragging) {
      const s = t.touches[0].clientX - this.dragStartX, i = t.touches[0].clientY - this.dragStartY, e = Math.abs(s) + Math.abs(i);
      !this.isDragDetected && e > this.MANHATTAN_THRESHOLD && (this.isDragDetected = !0), this.isDragDetected && Math.abs(s) > Math.abs(i) && (this.scrollOffset += s, this.dragStartX = t.touches[0].clientX, this.dragStartY = t.touches[0].clientY, this.draw());
    }
  }
  onTouchEnd(t) {
    t.touches.length < 2 && (this.initialPinchDistance = 0), t.touches.length === 0 && (this.isDragging = !1, this.isDragDetected = !1);
  }
  setData(t) {
    this.candles = t, this.calculateScales();
    const s = this.getChartArea(), i = this.candles.length - 1, e = 30;
    this.scrollOffset = s.width - e - i * this.barSpacing, this.draw();
  }
  isLastCandleVisible() {
    const t = this.getChartArea();
    if (this.candles.length === 0) return !1;
    const s = this.candles.length - 1, i = this.indexToX(s);
    return i >= t.x - this.barSpacing / 2 && i <= t.x + t.width;
  }
  updateCandle(t) {
    let s = !1;
    this.candles.length === 0 ? (this.candles.push(t), s = !0) : this.candles[this.candles.length - 1].time === t.time ? this.candles[this.candles.length - 1] = t : (this.candles.push(t), s = !0), this.calculateScales();
    const i = this.isLastCandleVisible();
    s && i && !this.isDragging && (this.scrollOffset -= this.barSpacing), this.draw();
  }
  getVisibleCandleRange() {
    const t = this.getChartArea(), s = Math.max(
      0,
      Math.ceil(-this.scrollOffset / this.barSpacing)
    ), i = Math.min(
      this.candles.length - 1,
      Math.floor((t.width - this.scrollOffset) / this.barSpacing)
    );
    return {
      start: Math.max(0, s),
      end: Math.max(0, i)
    };
  }
  calculateScales() {
    if (this.candles.length === 0) return;
    const t = this.getVisibleCandleRange();
    let s = this.candles[t.start].low, i = this.candles[t.start].high;
    for (let a = t.start; a <= t.end; a++) {
      const h = this.candles[a];
      s = Math.min(s, h.low), i = Math.max(i, h.high);
    }
    const e = (i - s) * 0.1;
    this.minPrice = s - e, this.maxPrice = i + e;
  }
  getChartArea() {
    return {
      x: this.padding.left,
      y: this.padding.top,
      width: this.width - this.padding.left - this.padding.right,
      height: this.height - this.padding.top - this.padding.bottom
    };
  }
  priceToY(t) {
    const s = this.getChartArea(), i = (t - this.minPrice) / (this.maxPrice - this.minPrice);
    return s.y + s.height - i * s.height;
  }
  indexToX(t) {
    return this.getChartArea().x + t * this.barSpacing + this.scrollOffset;
  }
  draw() {
    this.ctx.fillStyle = "#ffffff", this.ctx.fillRect(0, 0, this.width, this.height), this.drawGrid(), this.drawAxes(), this.drawCandles(), this.drawLabels(), this.drawZoomInfo(), this.drawOverlay();
  }
  drawOverlay() {
    this.overlayCtx.clearRect(0, 0, this.width, this.height), this.mouseState.isInChart && this.drawCrosshair();
  }
  drawGrid() {
    const t = this.getChartArea();
    this.ctx.strokeStyle = "#f0f0f0", this.ctx.lineWidth = 1;
    const s = 5;
    for (let a = 0; a <= s; a++) {
      const h = t.y + a / s * t.height;
      this.ctx.beginPath(), this.ctx.moveTo(t.x, h), this.ctx.lineTo(t.x + t.width, h), this.ctx.stroke();
    }
    const i = 60;
    let e = -1 / 0;
    for (let a = 0; a < this.candles.length; a++) {
      const h = this.indexToX(a);
      h >= t.x && h <= t.x + t.width && h - e >= i && (this.ctx.beginPath(), this.ctx.moveTo(h, t.y), this.ctx.lineTo(h, t.y + t.height), this.ctx.stroke(), e = h);
    }
  }
  drawAxes() {
    const t = this.getChartArea();
    this.ctx.strokeStyle = "#000000", this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.moveTo(t.x + t.width, t.y), this.ctx.lineTo(t.x + t.width, t.y + t.height), this.ctx.stroke(), this.ctx.beginPath(), this.ctx.moveTo(t.x, t.y + t.height), this.ctx.lineTo(t.x + t.width, t.y + t.height), this.ctx.stroke();
  }
  drawCandles() {
    if (this.candles.length === 0) return;
    const t = this.getChartArea();
    this.ctx.save(), this.ctx.beginPath(), this.ctx.rect(t.x, t.y, t.width, t.height), this.ctx.clip();
    const s = Math.max(this.barSpacing * 0.6, 2);
    for (let i = 0; i < this.candles.length; i++) {
      const e = this.candles[i], a = this.indexToX(i);
      if (a < t.x - s || a > t.x + t.width + s)
        continue;
      const h = this.priceToY(e.open), o = this.priceToY(e.close), r = this.priceToY(e.high), g = this.priceToY(e.low), l = e.close >= e.open, x = l ? "#26a69a" : "#ef5350", f = l ? o : h, n = Math.abs(o - h) || 1;
      this.ctx.strokeStyle = x, this.ctx.lineWidth = 1, this.ctx.beginPath(), this.ctx.moveTo(a, r), this.ctx.lineTo(a, g), this.ctx.stroke(), this.ctx.fillStyle = x, this.ctx.fillRect(a - s / 2, f, s, n);
    }
    this.ctx.restore();
  }
  drawLabels() {
    const t = this.getChartArea();
    this.ctx.fillStyle = "#000000", this.ctx.font = "12px Arial", this.ctx.textAlign = "left";
    for (let e = 0; e <= 5; e++) {
      const a = this.minPrice + e / 5 * (this.maxPrice - this.minPrice), h = this.priceToY(a);
      this.ctx.fillText(a.toFixed(0), t.x + t.width + 10, h + 4);
    }
    this.ctx.textAlign = "center", this.ctx.textBaseline = "top", this.ctx.save(), this.ctx.beginPath(), this.ctx.rect(
      t.x,
      t.y + t.height,
      t.width,
      this.padding.bottom
    ), this.ctx.clip();
    const s = 60;
    let i = -1 / 0;
    for (let e = 0; e < this.candles.length; e++) {
      const a = this.candles[e], h = this.indexToX(e);
      if (h >= t.x && h <= t.x + t.width) {
        const o = new Date(a.time * 1e3), r = `${o.getMonth() + 1}/${o.getDate()}`;
        h - i >= s && (this.ctx.fillText(r, h, t.y + t.height + 10), i = h);
      }
    }
    this.ctx.restore();
  }
  drawZoomInfo() {
    this.ctx.fillStyle = "#666", this.ctx.font = "11px Arial", this.ctx.textAlign = "left", this.ctx.fillText(`Zoom: ${this.barSpacing.toFixed(1)}px`, 10, 15), this.ctx.fillText("Scroll to zoom / Drag to pan", 10, 28);
  }
  onMouseEnter(t) {
    this.mouseState.isInChart = !0;
  }
  onMouseLeave(t) {
    this.mouseState.isInChart = !1, this.draw();
  }
  drawCrosshair() {
    const t = this.getChartArea(), s = this.mouseState.x, i = this.mouseState.y;
    this.overlayCtx.strokeStyle = "rgba(100, 100, 100, 0.5)", this.overlayCtx.lineWidth = 1, this.overlayCtx.setLineDash([2, 2]), this.overlayCtx.beginPath(), this.overlayCtx.moveTo(s, t.y), this.overlayCtx.lineTo(s, t.y + t.height), this.overlayCtx.stroke(), this.overlayCtx.setLineDash([]), this.overlayCtx.beginPath(), this.overlayCtx.moveTo(t.x, i), this.overlayCtx.lineTo(t.x + t.width, i), this.overlayCtx.stroke();
    const e = this.yToPrice(i), a = (s - t.x - this.scrollOffset) / this.barSpacing;
    if (this.drawCrosshairLabel("price", e.toFixed(2), s, i), a >= 0 && a < this.candles.length && Math.round(a) >= 0 && Math.round(a) < this.candles.length) {
      const h = Math.round(a), o = this.candles[h], r = new Date(o.time * 1e3), g = `${r.getMonth() + 1}/${r.getDate()} ${r.getHours()}:${String(r.getMinutes()).padStart(2, "0")}`;
      this.drawCrosshairLabel("time", g, s, t.y + t.height);
    }
  }
  drawCrosshairLabel(t, s, i, e) {
    const a = this.getChartArea(), h = 8, o = "12px Arial";
    this.overlayCtx.font = o;
    const g = this.overlayCtx.measureText(s).width, l = 16;
    let x = i, f = e, n = "center";
    t === "price" ? (x = a.x + a.width + h, n = "left", f = e - l / 2 + 4) : (f = a.y + a.height + h + l, n = "center"), this.overlayCtx.fillStyle = "rgba(40, 40, 40, 0.9)";
    const d = 4;
    t === "price" ? this.overlayCtx.fillRect(
      x - d,
      f - l / 2 - d,
      g + d * 2,
      l + d * 2
    ) : this.overlayCtx.fillRect(
      x - g / 2 - d,
      f - l - d,
      g + d * 2,
      l + d * 2
    ), this.overlayCtx.fillStyle = "#ffffff", this.overlayCtx.font = o, this.overlayCtx.textAlign = n, this.overlayCtx.textBaseline = "middle", this.overlayCtx.fillText(s, x, f);
  }
  yToPrice(t) {
    const s = this.getChartArea(), i = (s.y + s.height - t) / s.height;
    return this.minPrice + i * (this.maxPrice - this.minPrice);
  }
}
function M(v = 500, t = 20, s = 1e3) {
  let i = 25 + Math.random() * 25;
  const e = (n) => n * (0.5 + Math.sin(n / 1) * 0.2 + Math.sin(n / 2) * 0.4 + Math.sin(n / i) * 0.8 + Math.sin(n / 50) * 0.5) + 200 + n * 2, a = (n, d) => ({
    time: d,
    open: n,
    high: n,
    low: n,
    close: n
  }), h = (n, d) => ({
    time: n.time,
    close: d,
    open: n.open,
    low: Math.min(n.low, d),
    high: Math.max(n.high, d)
  });
  i = 25 + Math.random() * 25;
  const o = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0)), r = v * t, g = [], l = [];
  let x, f = e(-1);
  for (let n = 0; n < r; ++n) {
    n % t === 0 && o.setUTCDate(o.getUTCDate() + 1);
    const d = Math.floor(o.getTime() / 1e3);
    let C = e(n);
    const y = (C - f) * Math.random();
    if (C = f + y, f = C, n % t === 0) {
      const u = a(C, d);
      x = u, n >= s && l.push(u);
    } else {
      const u = h(x, C);
      x = u, n >= s ? l.push(u) : (n + 1) % t === 0 && g.push(u);
    }
  }
  return {
    initialData: g,
    realtimeUpdates: l
  };
}
export {
  b as CandleChart,
  M as generateCandleData
};
