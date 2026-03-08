# mvp 구조
- service
- repository
- db
- data(model, dto)
- controller

# mvp 동작 설명
- 사용자가 'start'버튼을 누르고 달리면 타이머가 작동하면서, 실시간으로 페이스가 기록되는 서비스이다.
  'stop'버튼으로 멈춤을 할 수 있으며, 완주후에 최종 페이스가 화면에 나타남

# 주요 기능
- 페이스 계산.
- 5초마다 위치를 클라이언트로 부터 받아옴. 이때 세션 id도 같이 오고 감.
- 클라이언트로 부터 받아온 위치 서버에 저장.
- 페이스를 화면에 띄워지게 함.
- 사용자가 start 버튼을 눌렀을때 클라이언트에서 현재위치를 서버로 보냄.
- 사용자가 stop 버튼을 눌렀을때 최종 페이스를 클라이언트로 보냄.

# 위치 관리(⭐️중요 기능)
- ⭐️세션아이디로 단일 Location 저장해서 세션아이디별로 위치를 관리.
1. 클라이언트에서 start버튼 누르면 서버에서 새 runsession 생성됨. (POST) "/api/running/start"
2. 서버 runsession에서 sessionid생성하고 시작위치 저장하고 sessionid반환.
3. 클라이언트는 5초마다 위치를 보낼 때마다 sessionid 붙여서 위치 전송. (POST) "/api/running/location"

# MVC Architecture
# 1. Model
- RunLocation
    - 위도
    - 경도
    - 시간
    - 세션
- RunSession : 세션별로 위치 관리
    - 시작시간
    - 종료시간
    - 세션 id


# 2. DTO
- LocationRequestDto
- PaceDto

# 3. Service
- start 눌렀을 시, 새 세션 생성과 시작 위치 저장
- 페이스 계산


# 4. Repository
- ## LocationRepository
    - 위치 저장 레포지토리
- ## SessionRepository
    - 세션 저장 레포지토리


# 5. Controller
- 사용자가 start 버튼을 눌렀을때 클라이언트에서 현재위치를 서버로 보낸다.
- 페이스를 프론트로 보낸다. 