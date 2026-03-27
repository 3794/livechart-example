/**
 * Pure Canvas Candlestick Chart Library
 * TradingView-like implementation without external dependencies
 */
export interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}
export declare class CandleChart {
    private canvas;
    private ctx;
    private overlayCanvas;
    private overlayCtx;
    private width;
    private height;
    private padding;
    private candles;
    private minPrice;
    private maxPrice;
    private isDragging;
    private dragStartX;
    private dragStartY;
    private scrollOffset;
    private MANHATTAN_THRESHOLD;
    private isDragDetected;
    private barSpacing;
    private MIN_BAR_SPACING;
    private MAX_BAR_SPACING;
    private ZOOM_SPEED;
    private initialPinchDistance;
    private initialBarSpacing;
    private initialScrollOffset;
    private mouseState;
    constructor(container: HTMLElement, width: number, height: number);
    private attachEventListeners;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
    private onDoubleClick;
    private onWheel;
    private onTouchStart;
    private onTouchMove;
    private onTouchEnd;
    setData(candles: Candle[]): void;
    private isLastCandleVisible;
    updateCandle(candle: Candle): void;
    private getVisibleCandleRange;
    private calculateScales;
    private getChartArea;
    private priceToY;
    private indexToX;
    private draw;
    private drawOverlay;
    private drawGrid;
    private drawAxes;
    private drawCandles;
    private drawLabels;
    private drawZoomInfo;
    private onMouseEnter;
    private onMouseLeave;
    private drawCrosshair;
    private drawCrosshairLabel;
    private yToPrice;
}
export declare function generateCandleData(numberOfCandles?: number, updatesPerCandle?: number, startAt?: number): {
    initialData: {
        time: number;
        close: number;
        open: number;
        low: number;
        high: number;
    }[];
    realtimeUpdates: Candle[];
};
//# sourceMappingURL=CandleChart.d.ts.map