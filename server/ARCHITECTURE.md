# EventSure Server 아키텍처

## 개요

이 프로젝트는 Domain-Driven Design (DDD) 아키텍처 패턴을 따릅니다.

## 디렉토리 구조

```
server/
├── domain/                    # Domain Layer
│   ├── event/
│   │   ├── event.go          # Event Aggregate Root
│   │   └── repository.go     # Event Repository Interface
│   ├── pool/
│   │   ├── pool.go           # Pool Aggregate Root
│   │   └── repository.go     # Pool Repository Interface
│   ├── transaction/
│   │   ├── transaction.go    # Transaction Entity
│   │   └── repository.go     # Transaction Repository Interface
│   └── stats/
│       └── stats.go          # Stats Value Object
│
├── application/               # Application Layer
│   ├── event/
│   │   ├── usecase.go        # Event Use Cases
│   │   └── dto.go            # Event DTOs
│   ├── pool/
│   │   ├── usecase.go        # Pool Use Cases
│   │   └── dto.go            # Pool DTOs
│   ├── transaction/
│   │   ├── usecase.go        # Transaction Use Cases
│   │   └── dto.go            # Transaction DTOs
│   └── stats/
│       ├── usecase.go        # Stats Use Cases
│       └── dto.go            # Stats DTOs
│
├── infrastructure/            # Infrastructure Layer
│   ├── repository/
│   │   ├── event_repository.go      # Event Repository Implementation
│   │   ├── pool_repository.go       # Pool Repository Implementation
│   │   └── transaction_repository.go # Transaction Repository Implementation
│   └── mock/
│       └── mock_data.go      # Mock Data Factory
│
├── interface/                 # Interface Layer
│   └── http/
│       ├── controller/       # HTTP Controllers
│       │   ├── event_controller.go
│       │   ├── pool_controller.go
│       │   ├── transaction_controller.go
│       │   └── stats_controller.go
│       └── router.go         # HTTP Router Setup
│
└── main.go                    # Application Entry Point
```

## 레이어 설명

### 1. Domain Layer

**책임**: 비즈니스 로직과 도메인 규칙

- **Aggregate Root**: Event, Pool
- **Entity**: Transaction
- **Value Object**: Stats
- **Repository Interface**: Domain에 정의, 구현은 Infrastructure에

**특징**:
- 외부 의존성 없음 (순수 Go 코드)
- 비즈니스 로직 포함
- 캡슐화된 도메인 모델 (private fields, public methods)

### 2. Application Layer

**책임**: 유스케이스 구현 및 DTO 변환

- **UseCase**: 비즈니스 유스케이스 구현
- **DTO**: 데이터 전송 객체 (Domain Entity와 분리)

**특징**:
- Domain Repository 인터페이스에 의존
- Domain Entity를 DTO로 변환
- 트랜잭션 관리 (향후 추가)

### 3. Infrastructure Layer

**책임**: 기술적 구현 세부사항

- **Repository Implementation**: Domain Repository 인터페이스 구현
- **Mock Data**: 테스트용 데이터 생성

**특징**:
- Domain 인터페이스를 구현
- 현재는 In-Memory 구현, 향후 DB 연동 가능

### 4. Interface Layer

**책임**: 외부 인터페이스 (HTTP API)

- **Controller**: HTTP 요청/응답 처리
- **Router**: 라우팅 설정

**특징**:
- 입력/출력만 담당
- UseCase 호출
- HTTP 관련 로직만 포함

## 의존성 방향

```
Interface → Application → Domain
                ↓
          Infrastructure
```

- **Domain**: 의존성 없음
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

### 3. DTO Pattern

- Domain Entity와 DTO 분리
- 외부 노출 시 DTO 사용

### 4. Dependency Injection

- `main.go`에서 모든 의존성 주입
- 인터페이스를 통한 의존성

## Aggregate Root vs Entity

### Aggregate Root (Event, Pool)

- 식별자를 가진 루트 엔티티
- 전체 Aggregate의 일관성 보장
- Repository를 통해 접근
- 비즈니스 로직 포함

### Entity (Transaction)

- 식별자를 가진 엔티티
- Aggregate Root의 일부가 될 수 있음

### Value Object (Stats)

- 식별자 없음
- 값으로만 구분
- 불변성

## 실행 흐름

1. **HTTP Request** → Controller
2. **Controller** → UseCase 호출
3. **UseCase** → Repository 인터페이스 호출
4. **Repository Implementation** → 데이터 반환
5. **UseCase** → Domain Entity → DTO 변환
6. **Controller** → JSON 응답

## 향후 개선 사항

- [ ] User Domain 추가
- [ ] User 관련 UseCase 및 Controller 추가
- [ ] 데이터베이스 연동 (PostgreSQL/MongoDB)
- [ ] 실제 JWT 인증 구현
- [ ] 트랜잭션 관리 (UoW 패턴)
- [ ] 이벤트 소싱 (선택적)
- [ ] 도메인 이벤트 (선택적)
