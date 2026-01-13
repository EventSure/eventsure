# 환경 변수 설정 가이드

`ExampleUserEpisodesSelectAll()` 함수를 실행하기 위한 환경 변수 설정 방법입니다.

## 방법 1: REST API 방식 (권장)

가장 간단한 방법입니다. Project URL과 API Key만 필요합니다.

### 환경 변수 설정

```bash
# Supabase Project URL
export SUPABASE_PROJECT_URL=https://vnxebakrejhkakhhxajq.supabase.co

# API Key (Publishable Key 또는 Anon Key)
export SUPABASE_API_KEY=sb_publishable_fOo9N-ENOftprDamZtRRfg_BaH9Ctu1
```

또는 `.env` 파일 사용:

```bash
# .env 파일 생성
cat > .env << EOF
SUPABASE_PROJECT_URL=https://vnxebakrejhkakhhxajq.supabase.co
SUPABASE_API_KEY=sb_publishable_fOo9N-ENOftprDamZtRRfg_BaH9Ctu1
EOF

# 환경 변수 로드 (필요한 경우)
export $(cat .env | xargs)
```

### 실행

```bash
# 프로젝트 루트에서 실행
cd server
go run cmd/example_user_episodes/main.go
```

## 방법 2: PostgreSQL 직접 연결 방식

더 복잡한 SQL 쿼리나 트랜잭션이 필요한 경우 사용합니다.

### 환경 변수 설정

```bash
# 개별 환경 변수 설정
export SUPABASE_DB_HOST=db.vnxebakrejhkakhhxajq.supabase.co
export SUPABASE_DB_PORT=5432
export SUPABASE_DB_NAME=postgres
export SUPABASE_DB_USER=postgres
export SUPABASE_DB_PASSWORD=your-database-password
```

또는 연결 문자열 사용:

```bash
# 연결 문자열 사용 (비밀번호를 실제 비밀번호로 교체)
export SUPABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.vnxebakrejhkakhhxajq.supabase.co:5432/postgres
```

### 실행

```bash
# 프로젝트 루트에서 실행
cd server
go run cmd/example_user_episodes/main.go
```

## Supabase 대시보드에서 정보 확인 방법

### REST API 정보 (Project URL, API Key)
1. Supabase 대시보드 로그인
2. 프로젝트 선택
3. **Settings** > **API** 메뉴로 이동
4. **Project URL**과 **anon/public key** 확인

### PostgreSQL 연결 정보
1. Supabase 대시보드 로그인
2. 프로젝트 선택
3. **Settings** > **Database** 메뉴로 이동
4. **Connection string** 섹션에서 연결 정보 확인
5. 또는 **Settings** > **Database** > **Connection string** 탭에서 확인

## 전체 예제 실행 스크립트

```bash
#!/bin/bash
# run_example.sh

# 환경 변수 설정 (REST API 방식)
export SUPABASE_PROJECT_URL=https://vnxebakrejhkakhhxajq.supabase.co
export SUPABASE_API_KEY=sb_publishable_fOo9N-ENOftprDamZtRRfg_BaH9Ctu1

# 또는 PostgreSQL 직접 연결 방식
# export SUPABASE_DB_HOST=db.vnxebakrejhkakhhxajq.supabase.co
# export SUPABASE_DB_PORT=5432
# export SUPABASE_DB_NAME=postgres
# export SUPABASE_DB_USER=postgres
# export SUPABASE_DB_PASSWORD=your-password

# 실행
cd server
go run cmd/example_user_episodes/main.go
```

## Windows에서 환경 변수 설정

### PowerShell
```powershell
$env:SUPABASE_PROJECT_URL="https://vnxebakrejhkakhhxajq.supabase.co"
$env:SUPABASE_API_KEY="sb_publishable_fOo9N-ENOftprDamZtRRfg_BaH9Ctu1"
cd server
go run cmd/example_user_episodes/main.go
```

### CMD
```cmd
set SUPABASE_PROJECT_URL=https://vnxebakrejhkakhhxajq.supabase.co
set SUPABASE_API_KEY=sb_publishable_fOo9N-ENOftprDamZtRRfg_BaH9Ctu1
cd server
go run cmd/example_user_episodes/main.go
```

## 문제 해결

### "SUPABASE_PROJECT_URL or SUPABASE_URL must be set" 오류
- 환경 변수가 제대로 설정되었는지 확인: `echo $SUPABASE_PROJECT_URL`
- `.env` 파일을 사용하는 경우, 환경 변수를 명시적으로 export 해야 할 수 있습니다.

### "failed to create Supabase client" 오류
- Project URL과 API Key가 올바른지 확인
- Supabase 대시보드에서 API 키가 활성화되어 있는지 확인

### "failed to connect to Supabase" 오류 (PostgreSQL 직접 연결)
- 데이터베이스 비밀번호가 올바른지 확인
- 방화벽 설정 확인 (IPv4/IPv6 호환성)
- 연결 문자열 형식이 올바른지 확인
