# EventSure Server

EventSure 백엔드 서버 (Golang) - Episode 기반 블록체인 이벤트 관리 시스템

## 개요

EventSure Server는 블록체인 기반 Episode 컨트랙트와 사용자 간의 관계를 관리하는 REST API 서버입니다. Supabase를 데이터베이스로, Etherscan API를 통해 블록체인 데이터를 조회합니다.

## 주요 기능

- **Episode 관리**: Etherscan을 통한 Episode 컨트랙트 조회 및 이벤트 로그 분석
- **User-Episode 관계**: Supabase를 통한 사용자와 Episode 연결 관리
- **이벤트 식별**: 블록체인 이벤트 로그의 시그니처 해시를 통한 이벤트 이름 식별

## 요구사항

- Go 1.24.0 이상
- Supabase 프로젝트 (PostgreSQL 데이터베이스)
- Etherscan API Key

## 설치

```bash
# 의존성 다운로드
go mod download

# 또는
go mod tidy
```

## 환경 변수 설정

`server/.env` 파일을 생성하고 다음 환경 변수를 설정합니다:

```env
# Supabase 설정
SUPABASE_PROJECT_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your_supabase_api_key

# Etherscan 설정
ETHERSCAN_API_KEY=your_etherscan_api_key
ETHERSCAN_CHAIN_ID=1
EPISODE_CONTRACT_FACTORY=0xYourFactoryAddress

# 서버 설정
PORT=3000
```

## 실행

### 개발 모드

```bash
cd server
go run .
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

포트를 변경하려면:
```bash
PORT=8080 go run .
```

### 예제 실행

#### Etherscan 예제
```bash
go run cmd/example_etherscan/main.go
# 또는 특정 예제만 실행
go run cmd/example_etherscan/main.go internal
go run cmd/example_etherscan/main.go logs
```

#### Supabase 예제
```bash
go run cmd/example_user_episodes/main.go
```

## API 엔드포인트

자세한 API 명세는 [API_SPEC.md](./API_SPEC.md)를 참고하세요.

### Episode Endpoints
- `GET /api/episodes` - 모든 Episode 컨트랙트 주소 조회
- `GET /api/episodes/{episode}/events` - Episode 이벤트 조회

### User Episode Endpoints
- `POST /api/user-episodes` - User-Episode 관계 생성
- `GET /api/user-episodes?user={address}` - 사용자별 Episode 조회
- `GET /api/user-episodes?episode={address}` - Episode별 사용자 조회

### Health Check
- `GET /health` - 서버 상태 확인

## 프로젝트 구조

```
server/
├── domain/              # 도메인 레이어 (비즈니스 로직)
├── application/         # 애플리케이션 레이어 (유스케이스)
├── infrastructure/      # 인프라 레이어 (외부 서비스 연동)
│   ├── database/       # Supabase 클라이언트
│   ├── etherscan/      # Etherscan API 클라이언트
│   └── repository/     # 리포지토리 구현
├── interface/          # 인터페이스 레이어 (HTTP API)
├── cmd/                # 실행 가능한 예제 프로그램
└── main.go             # 서버 진입점
```

자세한 아키텍처는 [ARCHITECTURE.md](./ARCHITECTURE.md)를 참고하세요.

## 의존성

### 주요 라이브러리
- `github.com/gorilla/mux`: HTTP 라우터
- `github.com/rs/cors`: CORS 미들웨어
- `github.com/joho/godotenv`: 환경 변수 로드
- `github.com/supabase-community/supabase-go`: Supabase 클라이언트

## 예시 요청

### 모든 Episode 조회
```bash
curl http://localhost:3000/api/episodes
```

### Episode 이벤트 조회
```bash
curl http://localhost:3000/api/episodes/0xe1299CBD3A2C616C884C8cF5590B9c718AAE7D7d/events
```

### User Episode 생성
```bash
curl -X POST http://localhost:3000/api/user-episodes \
  -H "Content-Type: application/json" \
  -d '{
    "user": "0x72BaEc75536D8c93B80Cbf155CA945DbDc3C972f",
    "episode": "0xD3a43B1F7B41745AFf8ACf85Bb81855f2890617A"
  }'
```

### 사용자별 Episode 조회
```bash
curl "http://localhost:3000/api/user-episodes?user=0x72BaEc75536D8c93B80Cbf155CA945DbDc3C972f"
```

### Episode별 사용자 조회
```bash
curl "http://localhost:3000/api/user-episodes?episode=0xD3a43B1F7B41745AFf8ACf85Bb81855f2890617A"
```

## 배포

### Railway 배포

1. Railway에 프로젝트 연결
2. Root Directory: `server` 설정
3. 환경 변수 설정 (Railway Variables)
4. Build Command: `go build -o main .` (또는 자동 감지)
5. Start Command: `./main`

자세한 배포 설정은 Railway 문서를 참고하세요.

## CORS

모든 origin에서 접근 가능하도록 설정되어 있습니다. 프로덕션 환경에서는 특정 origin만 허용하도록 수정하는 것을 권장합니다.

## 로깅

모든 API 요청은 로깅 미들웨어를 통해 기록됩니다:
```
[GET] /api/episodes - 200 - 1.234ms
[POST] /api/user-episodes - 201 - 2.345ms
```

## 다음 단계

- [ ] Episode 상세 정보 조회 기능 추가
- [ ] 이벤트 필터링 및 페이지네이션
- [ ] 캐싱 구현 (Redis)
- [ ] 인증/인가 구현
- [ ] 테스트 코드 작성
- [ ] 로깅 및 모니터링 강화
- [ ] API 문서 자동 생성 (Swagger/OpenAPI)

## 라이선스

이 프로젝트의 라이선스 정보는 프로젝트 루트의 LICENSE 파일을 참고하세요.
