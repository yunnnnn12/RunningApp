# 📦 Back-end — 실시간 러닝 데이터 처리 시스템

> Spring Boot 기반 백엔드 상세 문서입니다.  
> 프로젝트 전체 소개 및 성능 개선 내용은 [루트 README](../README.md)를 참고해주세요.
<br>

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
<br>



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
<br>

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
    Long sessionId;
    Double latitude;
    Double longitude;
    LocalDateTime timeStamp;
}
 
// 러닝 종료 요청
EndSessionRequestDto {
    Long sessionId;
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

<br>


## 🔧 문제 해결 — RDB → Redis + Kafka

### 문제 (RDB 구조)

5초 주기 위치 데이터 처리 시 세 가지 병목 발생

| 문제 | 원인 |
|------|------|
| Disk I/O 병목 | 위치 데이터 유입마다 DB 접근 → 지연 누적 |
| 데이터 순서 역전 | 네트워크 지연으로 좌표 순서 꼬임 → 페이스 계산 오류 |
| DB 자원 고갈 | Write 부하 집중으로 Connection Pool 고갈 시 서비스 장애 위험 |

### 해결 (Redis + Kafka 도입)

| 문제 | 해결 방법 |
|------|-----------|
| Disk I/O 병목 | Redis에 직전 좌표 캐싱 → DB 접근 제거 |
| 데이터 순서 역전 | Kafka sessionId 기반 파티셔닝 → 동일 유저 데이터 순차 처리 |
| DB 자원 고갈 | Kafka Back-pressure 구조 → DB 처리량에 맞춰 소비 |
<br>

## 🐛 트러블슈팅

### 모니터링 데이터 불일치 문제

**문제** : k6 테스트 평균 응답 시간과 Grafana 대시보드 수치 불일치  
**원인** : Sum과 Count 지표 의미를 이해하지 못해 평균 계산 신뢰 확보 어려움

**해결**
- 쿼리 평균 계산 범위를 `[5m] → [1m]`으로 단축해 과거 데이터 영향 차단
- Sum / Count 수식 기반으로 평균 Latency 재계산
  **결과** : 대시보드 수치와 k6 실측치 일치 → 모니터링 신뢰도 확보

**학습** : 누적 지표(Cumulative)의 특성과 시간 범위 설정이 데이터 정확도에 영향 — 원리를 이해하고 구성 요소부터 분석하는 엔지니어링 사고의 중요성 체감

<br>

## 🔮 추후 성능 확장 계획

### 1. Kafka 파티셔닝 & 순서 보장 확장
- **현재 문제** : 단일 파티션 → 트래픽 증가 시 단일 컨슈머 병목, 지연 누적
- **확장 설계** : sessionId 기반 파티셔닝 → 동일 유저 순서 보장 + 병렬 처리 가능
- **기대 효과** : 파티션 확장 시 Throughput 증가 → 고용량 스트림 데이터 실시간 서빙
### 2. 데이터 검증 (Validator)
- **현재 문제** : Kafka로 유입되는 비정상/Null 좌표 데이터 → 통계 모델 정확도 저하
- **확장 설계** : API에서 Validator 적용 → 필수 파라미터, 타입, 허용 범위 체크 → 정제된 데이터만 유입
- **기대 효과** : Garbage In, Garbage Out 방지 → 안정적 데이터 흐름 확보
 
