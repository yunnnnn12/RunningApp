# 🏃 실시간 러닝 데이터 처리 및 성능 개선 시스템
 
> 사용자의 GPS 위치 데이터를 5초 단위로 수집하여 실시간 거리·페이스를 계산하고,  
> 타이머와 함께 러닝 경험을 제공하는 백엔드 시스템
 
<br>

## ⚡ 성능 개선 결과
 
> RDB 단일 구조 → Redis + Kafka 도입으로 **p95 Latency 약 1,000배 단축**
 
| 항목 | RDB 구조 | Redis + Kafka 도입 후 |
|------|:--------:|:--------------------:|
| p95 Latency | 30.05s | **30.44ms** |
| 100 VU 요청 실패율 | 4.34% | **0%** |
| Throughput | 2.55 req/s | **약 20 QPS** |
| 데이터 유실 | - | **0건** |

![Redis+Kafka 도입 후 성능 결과](https://github.com/user-attachments/assets/d7c5dfdb-dc37-4e51-9832-f66913bc9318)


## 🏗 아키텍처
 
<img src="https://github.com/user-attachments/assets/0408257f-6bae-40ff-908e-125747b8e332" width="700" alt="아키텍처 구조">
```
Client (GPS + sessionId)
    │  POST /api/running/location
    ▼
API Server (Spring Boot)     Non-blocking │ Kafka Producer
    │  send(topic, key=sessionId)
    ▼
Kafka                        sessionId 기준 파티셔닝 → 순서 보장
    │
    ▼
Consumer                     Kafka에서 꺼내 거리·페이스 계산
    ├──▶ Redis               직전 좌표 캐싱 (Disk I/O 제거)
    └──▶ DB (MySQL)          최종 세션 상태 저장
```

<br>
## 🛠 Tech Stack
 
| 분류 | 기술 |
|------|------|
| Backend | Spring Boot 4.0.1, Java 21, JPA (Hibernate) |
| Message Broker | Apache Kafka |
| Cache / Storage | Redis, MySQL |
| Infra | Docker, AWS |
| Monitoring | Prometheus, Grafana |
| Load Test | k6 |
| Frontend | React |


<br>
## 🌿 Branch 구조
 
| 브랜치 | 설명 |
|--------|------|
| `main` | MVP + Prometheus & Grafana 모니터링 환경 |
| `feature/kafka-redis-integration` | RDB 구조 성능 개선 (Redis + Kafka) |
 
