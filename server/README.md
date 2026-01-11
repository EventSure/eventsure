# EventSure Server

EventSure 백엔드 서버 (Golang)

## 개요

프론트엔드에서 요구하는 API 엔드포인트를 제공하는 REST API 서버입니다.

## 구현된 엔드포인트

### Phase 1 (필수)
- ✅ `GET /api/events` - 이벤트 목록 조회
- ✅ `GET /api/events/{eventId}` - 이벤트 상세 조회
- ✅ `GET /api/pools` - 풀 목록 조회
- ✅ `GET /api/stats/home` - 홈 페이지 통계

### Phase 2 (중요)
- ✅ `GET /api/transactions` - 트랜잭션 목록 조회
- ✅ `GET /api/transactions/stats` - 트랜잭션 통계
- ✅ `GET /api/users/me/events` - 내 이벤트 참여 정보 (인증 필요)
- ✅ `GET /api/users/me/events/{eventId}/dashboard` - 이벤트 대시보드 (인증 필요)

## 요구사항

- Go 1.21 이상

## 의존성 설치

```bash
go mod download
```

## 실행

```bash
go run .
```

기본 포트는 3000입니다. 환경변수 `PORT`로 변경할 수 있습니다:

```bash
PORT=8080 go run .
```

## API 기본 URL

- 개발: `http://localhost:3000/api`
- 프론트엔드 환경변수: `VITE_API_BASE_URL`

## CORS

모든 origin에서 접근 가능하도록 설정되어 있습니다.

## 인증

`/api/users/me/*` 엔드포인트는 Bearer Token 인증이 필요합니다:

```
Authorization: Bearer <token>
```

현재는 간단한 토큰 확인만 수행하며, 실제 JWT 검증은 구현되어 있지 않습니다.

## 데이터

현재는 Mock 데이터를 사용합니다. 실제 데이터베이스 연동은 추후 구현 예정입니다.

## 프로젝트 구조

```
server/
├── main.go          # 서버 진입점 및 라우팅
├── models.go        # 데이터 모델 정의
├── handlers.go      # API 핸들러 함수들
├── mock_data.go     # Mock 데이터 생성 함수들
├── go.mod           # Go 모듈 정의
└── README.md        # 이 파일
```

## 예시 요청

### 이벤트 목록 조회
```bash
curl http://localhost:3000/api/events
```

### 이벤트 목록 조회 (필터링)
```bash
curl http://localhost:3000/api/events?status=recruiting&category=flightDelay
```

### 이벤트 상세 조회
```bash
curl http://localhost:3000/api/events/ke902
```

### 풀 목록 조회
```bash
curl http://localhost:3000/api/pools
```

### 트랜잭션 목록 조회
```bash
curl http://localhost:3000/api/transactions?limit=10&offset=0
```

### 내 이벤트 참여 정보 (인증 필요)
```bash
curl -H "Authorization: Bearer your_token_here" http://localhost:3000/api/users/me/events
```

## 다음 단계

- [ ] 데이터베이스 연동 (PostgreSQL 또는 MongoDB)
- [ ] JWT 인증 구현
- [ ] 실제 온체인 트랜잭션 모니터링
- [ ] 오라클 데이터 연동
- [ ] 캐싱 구현 (Redis)
- [ ] 로깅 및 모니터링
- [ ] 테스트 코드 작성
