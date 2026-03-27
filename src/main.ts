/**
 * LiveChart 라이브러리 사용 예제
 *
 * npm install에서 "live-chart" 패키지를 import하여 사용합니다.
 */

import { CandleChart, generateCandleData } from "live-chart";

// ============ 차트 초기화 ============

const chartContainer = document.getElementById("chart");
if (!chartContainer) {
  throw new Error("Chart container not found");
}

const width = chartContainer.offsetWidth;
const height = 300;

// candlechart 라이브러리에서 CandleChart 클래스와 generateCandleData 함수를 import
const chart = new CandleChart(chartContainer, width, height);

// 샘플 데이터 생성
const sampleData = generateCandleData(500, 20, 1000);

// 초기 데이터 로드
chart.setData(sampleData.initialData);

// ============ UI 제어 ============

let streamInterval: number | null = null;
let streamIndex = 0;

// 통계 정보 업데이트
function updateStats() {
  const candleCount = sampleData.initialData.length + streamIndex;
  const allCandles = [
    ...sampleData.initialData,
    ...sampleData.realtimeUpdates.slice(0, streamIndex),
  ];

  const prices = allCandles.map((c) => [c.high, c.low, c.close]).flat();
  const highest = Math.max(...prices);
  const lowest = Math.min(...prices);
  const current = allCandles[allCandles.length - 1]?.close || 0;

  document.getElementById("candle-count")!.textContent = candleCount.toString();
  document.getElementById("highest-price")!.textContent = highest.toFixed(2);
  document.getElementById("lowest-price")!.textContent = lowest.toFixed(2);
  document.getElementById("current-price")!.textContent = current.toFixed(2);
}
streamInterval = window.setInterval(() => {
  if (streamIndex < sampleData.realtimeUpdates.length) {
    const nextCandle = sampleData.realtimeUpdates[streamIndex];
    chart.updateCandle(nextCandle);
    streamIndex++;
    updateStats();
  } else {
    // 스트림 종료
    if (streamInterval) {
      clearInterval(streamInterval);
      streamInterval = null;
    }
  }
}, 100); // 100ms마다 새로운 캔들 추가

// 초기 통계 업데이트
updateStats();
