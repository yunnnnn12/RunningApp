import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,          // 가상 유저 100명 (부하를 팍 줘야 차이가 보여요)
  duration: '1m',    // 1분 동안 지속
};

export default function () {
  const url = 'http://localhost:8080/api/running/location'; // 본인 서버 주소 확인!
  const payload = JSON.stringify({
    latitude: 37.5665,
    longitude: 126.9780,
    sessionId: 1
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
  sleep(5); // 5초마다 요청
}