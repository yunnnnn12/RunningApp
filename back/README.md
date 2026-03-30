# 실시간 러닝 데이터 처리 및 성능 개선 시스템

## Tech Stack
- Engine: Spring Boot 4.0.1, Java 21
- Message Broker: Apache Kafka
- Cache/Storage: Redis, MySQL
- Monitoring: Prometheus, Grafana
- Load Test: k6

## Branch 가이드
- [Main]
  - MVP(페이스, 계산 거리) + Prometheus & Grafana 기본 모니터링 환경 구축
- [feature/kafka-redis-integration]
  - 기존 RDB 구조 성능 개선
  - p95 Latency 1,000배 개선 (30s → 30ms)
  - Kafka + Redis 도입을 통한 쓰기 부하 분산 및 캐싱 레이어 구축


## 성능 개선 결과
- Latency: Kafka + Redis 도입 후 약 1,000배 개선
- Throughput : 100 VU 무장애 처리 (k6)

# mvp
## mvp 구조
- service
- repository
- db
- data(model, dto)
- controller

## mvp 동작 설명
- 사용자가 'start'버튼을 누르고 달리면 타이머가 작동하면서, 실시간으로 페이스가 기록되는 서비스이다.
  'stop'버튼으로 멈춤을 할 수 있으며, 러닝 도중에는 실시간 페이스가, 완주 후에는 최종 페이스가 화면에 나타난다.

## 주요 기능
- 페이스 계산.
- 5초마다 위치를 클라이언트로 부터 받아옴. 이때 세션 id도 같이 오고 감.
- 클라이언트로 부터 받아온 위치 서버에 저장.
- 페이스를 화면에 띄워지게 함.
- 사용자가 start 버튼을 눌렀을때 클라이언트에서 현재위치를 서버로 보냄.
- 사용자가 stop 버튼을 눌렀을때 최종 페이스를 클라이언트로 보냄.

## 위치 관리(⭐️중요 기능)
- ⭐️ 각 러닝 세션(RunSession)에 여러 위치 정보(RunLocation)를 연결하여 세션별로 위치를 관리 (RunLocation은 session_id를 통해 RunSession과 N:1 조인)
1. 클라이언트에서 start버튼 누르면 서버에서 새 runsession 생성됨. (POST) "/api/running/startLocation"
2. 서버 runsession에서 sessionid생성하고 시작위치 저장하고 sessionid반환.
3. 클라이언트는 5초마다 위치를 보낼 때마다 sessionid 포함해서 위치 전송. (POST) "/api/running/location"

## MVC Architecture
### 1. Model
- RunLocation
  - 식별 id
  - 위도
  - 경도
  - 시간
  - 세션
- RunSession : 세션별로 위치 관리
  - 시작시간
  - 종료시간
  - 세션 id
  - 총 거리
  - 평균 페이스
  - N:1 → RunSession


### 2. DTO
- LocationRequestDto : 클라이언트에서 보내는 위치 데이터를 서버로 전달하기 위한 DTO
  - sessionId
  - latitude
  - longitude
  - timeStamp

- EndSessionRequestDto : 러닝 종료 요청 시 sessionId를 전달하기 위한 DTO
  - sessionId

### 3. Service
#### 1. 세션 저장(makeSession)
- 세션 생성 후 시작 위치 저장
#### 2. 위치 저장(saveLocation)
- 현재 위치를 저장하고, 러닝 거리와 평균 페이스를 실시간으로 계산 후, 세션에 저장
#### 3. 거리 계산(calculateDistance)
- 위도와 경도를 바탕으로 실제 거리 계산
#### 4. 세션 종료(endSession)
- 러닝 종료 시간을 기록하고 총 거리와 시간을 바탕으로 최종 평균 페이스 계산하여 저장
#### 5. 세션 가져오기(getSession)
- sessionId기반으로 세션 가져오기



### 4. Repository
#### 1. LocationRepository
    - 위치 저장 레포지토리
#### 2. SessionRepository
    - 세션 저장 레포지토리


### 5. Controller (/api/running)
#### 1. getStartLocation (/startLocation)
- 시작 위치 저장
#### 2. getSession (/session/{id})
- sessionId기반으로 세션 가져오기
#### 3. saveLocation (/location)
- 위치 저장
#### 4. endSession (/end)
- 세션 종료하기