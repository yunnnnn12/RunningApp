# 📦 Back-end — 실시간 러닝 데이터 처리 시스템

> Spring Boot 기반 백엔드 상세 문서입니다.  
> 프로젝트 전체 소개 및 성능 개선 내용은 [루트 README](../README.md)를 참고해주세요.


## 🛠 Tech Stack

| 분류 | 기술 |
|------|------|
| Language | Java 21 |
| Framework | Spring Boot 4.0.1, JPA (Hibernate) |
| Message Broker | Apache Kafka |
| Cache | Redis |
| Database | MySQL |
| Infra | Docker, AWS |
| Monitoring | Prometheus, Grafana |
| Load Test | k6 |



## ✅ 주요 기능

### 러닝 세션 관리

| 엔드포인트 | 메서드 | 설명 |
|------------|--------|------|
| `/api/running/startLocation` | POST | 세션 생성 + 시작 위치 저장, sessionId 반환 |
| `/api/running/location` | POST | 5초마다 GPS 위치 수신 + 페이스·거리 실시간 계산 |
| `/api/running/session/{id}` | GET | sessionId 기반 세션 조회 |
| `/api/running/end` | POST | 종료 시간 기록 + 최종 평균 페이스 계산 저장 |

### 실시간 계산
- **거리 계산** : 위도·경도 기반 Haversine 공식으로 실제 이동 거리 계산
- **페이스 계산** : 위치 저장마다 누적 거리 + 경과 시간으로 실시간 평균 페이스 산출
- **타이머** : 러닝 시간 실시간 제공

## 🗂 MVC 구조

### Model
```
RunSession
  ├── id
  ├── startTime / endTime
  ├── totalDistance
  └── averagePace
 
RunLocation
  ├── id
  ├── latitude / longitude
  ├── timestamp
  └── sessionId  →  N:1  RunSession
```

### DTO

```java
// 클라이언트 → 서버 위치 전송
LocationRequestDto {
    String sessionId;
    Double latitude;
    Double longitude;
    LocalDateTime timeStamp;
}
 
// 러닝 종료 요청
EndSessionRequestDto {
    String sessionId;
}
```

### Service

| 메서드 | 역할 |
|--------|------|
| `makeSession()` | 세션 생성 및 시작 위치 저장 |
| `saveLocation()` | 위치 저장 + 거리/페이스 실시간 계산 |
| `calculateDistance()` | 위도·경도 기반 실제 거리 계산 |
| `endSession()` | 종료 시간 기록 + 최종 페이스 계산 |
| `getSession()` | sessionId 기반 세션 조회 |

### Repository

```
LocationRepository  — 위치 저장
SessionRepository   — 세션 저장
```
