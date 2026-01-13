# Supabase Database Connection

이 디렉토리는 Supabase 데이터베이스 연결을 관리합니다. 두 가지 연결 방식을 제공합니다:

1. **PostgreSQL 직접 연결** - pgx를 사용한 직접 데이터베이스 연결
2. **REST API 연결** - Supabase REST API를 사용한 연결 (권장)

## REST API 연결 (권장)

Supabase의 REST API를 사용하면 Project URL과 API Key만으로 연결할 수 있습니다.

### 환경 변수 설정

```bash
# Supabase Project URL
# Supabase 대시보드의 Project Settings > API에서 확인 가능
SUPABASE_PROJECT_URL=https://vnxebakrejhkakhhxajq.supabase.co

# API Key (Publishable 또는 Anon Key)
# Supabase 대시보드의 Project Settings > API에서 확인 가능
# Publishable Key는 브라우저에서도 안전하게 사용 가능 (RLS 활성화 시)
SUPABASE_API_KEY=sb_publishable_fOo9N-ENOftprDamZtRRfg_BaH9Ctu1
```

또는 다른 환경 변수 이름 사용 가능:
- `SUPABASE_URL` (Project URL 대신 사용 가능)
- `SUPABASE_ANON_KEY` 또는 `SUPABASE_PUBLISHABLE_KEY` (API Key 대신 사용 가능)

### REST API 사용 방법

```go
import "eventsure-server/infrastructure/database"

// Supabase REST API 클라이언트 생성
client, err := database.NewSupabaseRESTClient()
if err != nil {
    log.Fatal("Failed to create Supabase REST client:", err)
}

// 모든 행 조회
results, err := client.SelectAll("episodes")
if err != nil {
    log.Fatal("Failed to select:", err)
}

// ID로 조회
episode, err := client.SelectByID("episodes", "episode-1")

// 데이터 삽입
newData := map[string]interface{}{
    "id":     "episode-new",
    "title":  "New Episode",
    "status": "active",
}
inserted, err := client.Insert("episodes", newData)

// 데이터 업데이트
updateData := map[string]interface{}{
    "status": "completed",
}
filter := map[string]interface{}{
    "id": "episode-1",
}
updated, err := client.Update("episodes", updateData, filter)

// 데이터 삭제
deleted, err := client.Delete("episodes", filter)

// 고급 쿼리 빌더 사용
var results []map[string]interface{}
_, err = client.Client.From("episodes").
    Select("id,title,status", "exact", false).
    Eq("status", "active").
    Limit(10, "").
    ExecuteTo(&results)
```

## PostgreSQL 직접 연결

직접 데이터베이스 연결이 필요한 경우 사용합니다.

### 환경 변수 설정

```bash
SUPABASE_DB_HOST=db.xxxxx.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-database-password
```

또는:

```bash
SUPABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
```

### PostgreSQL 직접 연결 사용 방법

```go
import "eventsure-server/infrastructure/database"

// Supabase PostgreSQL 클라이언트 생성
client, err := database.NewSupabaseClient()
if err != nil {
    log.Fatal("Failed to connect to Supabase:", err)
}
defer client.Close()

// 데이터베이스 풀 사용
pool := client.Pool

// 쿼리 실행 예제
var result string
err = pool.QueryRow(context.Background(), "SELECT version()").Scan(&result)
if err != nil {
    log.Fatal("Query failed:", err)
}
fmt.Println("PostgreSQL version:", result)
```

## 연결 풀 설정 (PostgreSQL 직접 연결)

- 최대 연결 수: 25
- 최소 연결 수: 5
- 연결 최대 수명: 1시간
- 연결 유휴 시간: 30분
- 헬스 체크 주기: 1분

## 헬스 체크 (PostgreSQL 직접 연결)

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

if err := client.HealthCheck(ctx); err != nil {
    log.Println("Database health check failed:", err)
}
```

## 어떤 방식을 사용해야 하나요?

- **REST API 방식 (권장)**: 
  - Project URL과 API Key만 필요
  - Row Level Security (RLS) 정책 자동 적용
  - 더 간단한 설정
  - 브라우저에서도 안전하게 사용 가능 (Publishable Key 사용 시)
  
- **PostgreSQL 직접 연결**:
  - 더 복잡한 SQL 쿼리 필요 시
  - 트랜잭션 직접 제어 필요 시
  - 더 높은 성능이 필요한 경우
