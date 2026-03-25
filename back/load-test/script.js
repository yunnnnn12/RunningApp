import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 50,          // 50명의 러너가 동시에 출발
  duration: '1m',   // 1분 동안 압축 테스트 (실제로는 더 길게 해도 됨)
};

// 각 유저별 상태 저장 (메모리상에 위치 저장)
const runnerStates = {};

export default function () {
  const vuId = __VU; // 가상 유저 번호 (1~50)

  // 1. 초기 위치 설정 (처음 한 번만 실행)
  if (!runnerStates[vuId]) {
    runnerStates[vuId] = {
      lat: 37.5665 + (vuId * 0.0001), // 유저별로 조금씩 다른 시작점
      lon: 126.9780 + (vuId * 0.0001),
      distance: 0,
    };
  }

  const state = runnerStates[vuId];

  // 2. 이동 로직 (매 요청마다 약 5~10m 이동 시뮬레이션)
  const moveLat = 0.00005; // 북쪽으로 이동
  const moveLon = 0.00005; // 동쪽으로 이동

  state.lat += moveLat;
  state.lon += moveLon;

  // 대략적인 이동 거리 누적 (테스트용 간이 계산)
  state.distance += 7; // 한 번 쏠 때마다 7미터 이동한다고 가정

  // 3. 서버로 전송
  const payload = JSON.stringify({
    sessionId: vuId, // 각자 자기 세션에 저장
    latitude: state.lat,
    longitude: state.lon,
    timestamp: new Date().getTime()
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post('http://localhost:8080/api/running/location', payload, params);

  // 4. 3km(3000m) 다 뛰었으면 종료 메시지 (선택 사항)
  if (state.distance >= 3000) {
    console.log(`Runner ${vuId} finished 3km!`);
    // 여기서 원래는 /api/running/end 호출하면 완벽!
  }

  sleep(0.1); // 0.5초마다 위치 전송 (초당 2번 업데이트)
}