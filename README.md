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

<img src="https://github.com/user-attachments/assets/d7c5dfdb-dc37-4e51-9832-f66913bc9318" width="1500" alt="Redis+Kafka 도입 후 성능 결과" />

<br>

## 🏗 아키텍처

<img src="https://github.com/user-attachments/assets/0408257f-6bae-40ff-908e-125747b8e332" width="600" alt="아키텍처 구조" />

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

<br>

## 📊 성능 테스트 상세

### RDB 구조 — VU 10

| Grafana 모니터링 | k6 결과 |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/a7614cc2-052d-4300-be7b-5d3cc6501304" width="420" alt="VU10 Grafana" /> | <img src="https://github.com/user-attachments/assets/695a8762-329e-42f4-8f7c-f95e782747ab" width="420" alt="VU10 Result" /> |

- p95 **85.6ms**, 평균 52ms, 실패율 **0%** (120건 모두 성공)

---

### RDB 구조 — VU 100

| Grafana 모니터링 | k6 결과 |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/e49d0bd9-d4be-42f5-97d9-2f07712ac315" width="420" alt="VU100 Grafana" /> | <img src="https://github.com/user-attachments/assets/9019382f-04fc-4f8d-b900-f6632fd74f24" width="420" alt="VU100 Result" /> |

- p95 **30s**, 평균 26s, 실패율 **4.34%** (230건 중 10건 실패) → **성능 한계 도달**

---

### Redis + Kafka 도입 후 — VU 100

<img src="https://github.com/user-attachments/assets/d7c5dfdb-dc37-4e51-9832-f66913bc9318" width="1500" alt="Redis+Kafka 도입 후 성능 결과" />

- p95 **30.05s → 30.44ms** (약 1,000배 개선)
- 6,000건 요청 처리, 에러율 **0%**
- 초당 약 **20 QPS** 안정적 처리

<br>

## 📁 프로젝트 구조

```
RunningApp/
├── back/          # Spring Boot 백엔드
│   ├── src/
│   └── README.md  # 백엔드 상세 문서
├── front/         # React 프론트엔드
└── README.md      # 현재 파일
```

<br>

## 🔗 Links

- **GitHub** : [https://github.com/yunnnnn12/RunningApp](https://github.com/yunnnnn12/RunningApp)
