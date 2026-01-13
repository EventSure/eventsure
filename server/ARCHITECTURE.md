# EventSure Server 아키텍처

## 개요

이 프로젝트는 Domain-Driven Design (DDD) 아키텍처 패턴을 따르며, Episode 기반의 블록체인 이벤트 관리 시스템입니다.

## 디렉토리 구조

```
server/
├── domain/                    # Domain Layer
│   └── episode/
│       ├── episode.go         # Episode Entity
│       └── repository.go      # Episode Repository Interface
│
├── application/               # Application Layer
│   └── episode/
│       ├── usecase.go         # Episode Use Cases
│       └── dto.go             # Episode DTOs
│
├── infrastructure/            # Infrastructure Layer
│   ├── database/
│   │   ├── supabase_rest.go   # Supabase REST API Client
│   │   └── example.go         # Supabase 사용 예제
│   ├── etherscan/
│   │   ├── client.go          # Etherscan API Client
│   │   └── example.go         # Etherscan 사용 예제
│   ├── repository/
│   │   ├── episode_repository.go      # Episode Repository Implementation
│   │   └── user_episode_repository.go # User Episode Repository Implementation
│   └── mock/
│       └── mock_data.go       # Mock Data Factory
│
├── interface/                 # Interface Layer
│   └── http/
│       ├── controller/
│       │   └── episode_controller.go # HTTP Controllers
│       ├── middleware/
│       │   └── logging.go     # Logging Middleware
│       └── router.go          # HTTP Router Setup
│
├── cmd/                       # Command Line Tools
│   ├── example_etherscan/
│   │   └── main.go            # Etherscan 예제 실행
│   └── example_user_episodes/
│       └── main.go            # Supabase 예제 실행
│
├── main.go                    # Application Entry Point
├── go.mod                     # Go Module Definition
└── go.sum                     # Go Module Checksums
```

## 레이어 설명

### 1. Domain Layer

**책임**: 비즈니스 로직과 도메인 규칙

- **Entity**: Episode
- **Repository Interface**: Domain에 정의, 구현은 Infrastructure에

**특징**:
- 외부 의존성 없음 (순수 Go 코드)
- 비즈니스 로직 포함
- 캡슐화된 도메인 모델 (private fields, public methods)

### 2. Application Layer

**책임**: 유스케이스 구현 및 DTO 변환

- **UseCase**: Episode 관련 비즈니스 유스케이스 구현
  - `GetAllEpisodes()`: Etherscan에서 모든 Episode 컨트랙트 주소 조회
  - `GetEpisodeEvents()`: 특정 Episode의 이벤트 로그 조회
  - `CreateUserEpisode()`: 사용자-Episode 연결 생성
  - `GetUserEpisodes()`: 사용자별 Episode 조회
  - `GetEpisodeUsers()`: Episode별 사용자 조회
- **DTO**: 데이터 전송 객체 (Domain Entity와 분리)

**특징**:
- Domain Repository 인터페이스에 의존
- Domain Entity를 DTO로 변환
- 외부 서비스 (Etherscan, Supabase) 연동

### 3. Infrastructure Layer

**책임**: 기술적 구현 세부사항

#### 3.1 Database (Supabase)
- **SupabaseRESTClient**: Supabase REST API 클라이언트
- **UserEpisodeRepository**: `user_episodes` 테이블 CRUD 작업

#### 3.2 Etherscan
- **EtherscanClient**: Etherscan API 클라이언트
  - `GetInternalTransactions()`: 내부 트랜잭션 조회
  - `GetEventLogs()`: 이벤트 로그 조회
  - `IdentifyEpisodeEvent()`: 이벤트 시그니처 해시로 이벤트 이름 식별

#### 3.3 Repository Implementation
- **EpisodeRepository**: Episode 도메인 리포지토리 구현
- **UserEpisodeRepository**: User Episode 리포지토리 구현

**특징**:
- Domain 인터페이스를 구현
- 외부 서비스 (Supabase, Etherscan) 연동
- 환경 변수를 통한 설정 관리

### 4. Interface Layer

**책임**: 외부 인터페이스 (HTTP API)

- **Controller**: HTTP 요청/응답 처리
  - `GetEpisodes()`: GET /api/episodes
  - `GetEpisodeEvents()`: GET /api/episodes/{episode}/events
  - `CreateUserEpisode()`: POST /api/user-episodes
  - `GetUserEpisodes()`: GET /api/user-episodes?user=xxx 또는 ?episode=xxx
- **Router**: 라우팅 설정 및 미들웨어 적용
- **Middleware**: 로깅 미들웨어

**특징**:
- 입력/출력만 담당
- UseCase 호출
- HTTP 관련 로직만 포함
- CORS 설정 포함

## 의존성 방향

```
Interface → Application → Domain
                ↓
          Infrastructure
```

- **Domain**: 의존성 없음 (순수 비즈니스 로직)
- **Application**: Domain에만 의존
- **Infrastructure**: Domain과 Application에 의존 (구현)
- **Interface**: Application에 의존

## 주요 패턴

### 1. Repository Pattern

- **인터페이스**: Domain Layer에 정의
- **구현**: Infrastructure Layer에 위치
- **의존성 역전**: Domain이 Infrastructure에 의존하지 않음

### 2. UseCase Pattern

- 각 유스케이스는 Application Layer의 UseCase로 구현
- 명확한 책임 분리
- 비즈니스 로직 캡슐화

### 3. DTO Pattern

- Domain Entity와 DTO 분리
- 외부 노출 시 DTO 사용
- API 응답 형식 표준화

### 4. Dependency Injection

- `main.go`에서 모든 의존성 주입
- 인터페이스를 통한 의존성
- 테스트 용이성 향상

## 외부 서비스 연동

### 1. Supabase

**용도**: 사용자-Episode 관계 데이터 저장

- **테이블**: `user_episodes`
- **연동 방식**: REST API
- **환경 변수**: `SUPABASE_PROJECT_URL`, `SUPABASE_API_KEY`

### 2. Etherscan

**용도**: 블록체인 데이터 조회

- **기능**:
  - Episode 컨트랙트 주소 조회 (Factory 내부 트랜잭션)
  - Episode 이벤트 로그 조회
  - 이벤트 시그니처 식별
- **환경 변수**: `ETHERSCAN_API_KEY`, `ETHERSCAN_CHAIN_ID`, `EPISODE_CONTRACT_FACTORY`

## 실행 흐름

### Episode 조회 흐름
1. **HTTP Request** → `GET /api/episodes`
2. **Controller** → `GetEpisodes()` 호출
3. **UseCase** → `GetAllEpisodes()` 실행
4. **EtherscanClient** → Factory 내부 트랜잭션 조회
5. **UseCase** → ContractAddress 추출 및 반환
6. **Controller** → JSON 응답

### Episode 이벤트 조회 흐름
1. **HTTP Request** → `GET /api/episodes/{episode}/events`
2. **Controller** → `GetEpisodeEvents()` 호출
3. **UseCase** → `GetEpisodeEvents()` 실행
4. **EtherscanClient** → EventLogs 조회
5. **UseCase** → 이벤트 식별 및 포맷팅
6. **Controller** → JSON 응답

### User Episode 생성 흐름
1. **HTTP Request** → `POST /api/user-episodes`
2. **Controller** → `CreateUserEpisode()` 호출
3. **UseCase** → `CreateUserEpisode()` 실행
4. **UserEpisodeRepository** → Supabase에 데이터 저장
5. **Controller** → JSON 응답

## 환경 변수

### 필수 환경 변수
- `SUPABASE_PROJECT_URL`: Supabase 프로젝트 URL
- `SUPABASE_API_KEY`: Supabase API Key
- `ETHERSCAN_API_KEY`: Etherscan API Key
- `EPISODE_CONTRACT_FACTORY`: Episode Contract Factory 주소

### 선택적 환경 변수
- `PORT`: 서버 포트 (기본값: 3000)
- `ETHERSCAN_CHAIN_ID`: 체인 ID (기본값: 1)

## 향후 개선 사항

- [ ] Episode 상세 정보 조회 (컨트랙트 상태 등)
- [ ] 이벤트 필터링 (이벤트 타입별)
- [ ] 페이지네이션 구현
- [ ] 캐싱 전략 (Redis)
- [ ] 트랜잭션 관리 (UoW 패턴)
- [ ] 도메인 이벤트 (선택적)
- [ ] 테스트 코드 작성
- [ ] 로깅 및 모니터링 강화
