# LiveChart 라이브러리 사용 예제

> ⚠️ **아직 작업 중입니다.** 이 프로젝트는 개발 단계에 있으며, API 및 기능이 변경될 수 있습니다.

이 프로젝트는 `live-chart` 라이브러리를 import해서 사용하는 방법을 보여주는 예제입니다.

## 프로젝트 구조

```
examples/
├── src/
│   ├── main.ts              # 라이브러리 사용 예제 코드
│   └── vite-env.d.ts        # Vite 타입 정의
├── livechart/               # 빌드된 라이브러리
├── index.html               # HTML 진입점
├── package.json             # 의존성 설정 (라이브러리 로컬 설치)
├── tsconfig.json            # TypeScript 설정
├── vite.config.ts           # Vite 설정
└── README.md                # 이 파일
```

## 개발 서버 실행

```bash
npm install
npm run dev
```

예제를 확인할 수 있습니다.

## 라이브러리 사용 방법

### 1. 임포트

```typescript
import { CandleChart, generateCandleData, type Candle } from "live-chart";
```

### 2. 차트 생성

```typescript
const container = document.getElementById("chart");
const chart = new CandleChart(container, width, height);
```

### 3. 초기 데이터 로드

```typescript
const data = generateCandleData(500, 20, 1000);
chart.setData(data.initialData);
```

### 4. 실시간 캔들 업데이트

```typescript
const newCandle = {
  time: Math.floor(Date.now() / 1000),
  open: 100,
  high: 105,
  low: 98,
  close: 103,
};

chart.updateCandle(newCandle);
```

## CandleChart API

### Constructor

```typescript
new CandleChart(
  container: HTMLElement,
  width: number,
  height: number
)
```

### 공개 메서드

#### `setData(candles: Candle[]): void`

차트에 초기 데이터를 로드합니다.

```typescript
chart.setData([
  { time: 1000, open: 100, high: 105, low: 98, close: 103 },
  { time: 2000, open: 103, high: 107, low: 101, close: 104 },
  // ...
]);
```

#### `updateCandle(candle: Candle): void`

새로운 캔들을 추가하거나 마지막 캔들을 업데이트합니다.

```typescript
chart.updateCandle({
  time: Math.floor(Date.now() / 1000),
  open: 100,
  high: 105,
  low: 98,
  close: 103,
});
```

## Candle 데이터 구조

```typescript
interface Candle {
  time: number; // Unix timestamp (초 단위)
  open: number; // 시가
  high: number; // 고가
  low: number; // 저가
  close: number; // 종가
}
```

## 주요 기능

### 마우스 제어

- **줌**: Ctrl/Cmd + 마우스 휠로 확대/축소 (마우스 포인터 위치 기준)
- **팬**: 좌측 마우스 버튼 드래그로 좌우 이동
- **더블 클릭**: 원래 위치로 리셋

### 터치 제어

- **핀치 줌**: 두 손가락으로 핀치 동작으로 확대/축소
- **팬**: 한 손가락 드래그로 좌우 이동

### 자동 기능

- **자동 팬**: 새로운 캔들이 추가되고 마지막 캔들이 화면에 보이면 자동으로 우측으로 이동
- **동적 라벨**: X축 라벨이 겹치지 않도록 자동으로 간격 조정
- **크로스헤어**: 마우스 위치의 가격과 시간을 표시

## 예제 코드

`src/main.ts`에서 완전한 예제를 확인할 수 있습니다:

```typescript
import { CandleChart, generateCandleData } from "live-chart";

// 차트 생성
const chart = new CandleChart(container, width, height);

// 데이터 로드
const data = generateCandleData(500, 20, 1000);
chart.setData(data.initialData);

// 실시간 업데이트 (100ms 간격)
let index = 0;
setInterval(() => {
  if (index < data.realtimeUpdates.length) {
    chart.updateCandle(data.realtimeUpdates[index]);
    index++;
  }
}, 100);
```
