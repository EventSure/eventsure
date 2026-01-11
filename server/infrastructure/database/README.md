# Supabase Database Connection

이 디렉토리는 Supabase 데이터베이스 연결을 관리합니다.

## 환경 변수 설정

Supabase 연결을 위해 다음 환경 변수들을 설정해야 합니다:

### 직접 데이터베이스 연결 (권장)
```bash
SUPABASE_DB_HOST=db.xxxxx.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-database-password
```

### 또는 Supabase URL 사용
```bash
SUPABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
```

## 사용 방법

```go
import "eventsure-server/infrastructure/database"

// Supabase 클라이언트 생성
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

## 연결 풀 설정

- 최대 연결 수: 25
- 최소 연결 수: 5
- 연결 최대 수명: 1시간
- 연결 유휴 시간: 30분
- 헬스 체크 주기: 1분

## 헬스 체크

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

if err := client.HealthCheck(ctx); err != nil {
    log.Println("Database health check failed:", err)
}
```
