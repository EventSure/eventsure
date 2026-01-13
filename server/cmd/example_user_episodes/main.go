package main

import (
	"eventsure-server/infrastructure/database"
)

// 이 파일은 ExampleUserEpisodesSelectAll 함수를 실행하는 예제입니다.
//
// 실행 방법:
//  1. 환경 변수를 설정합니다 (infrastructure/database/ENV_SETUP.md 참조)
//  2. go run cmd/example_user_episodes/main.go
//
// 환경 변수 설정 예시 (REST API 방식 - 권장):
//
//	export SUPABASE_PROJECT_URL=https://vnxebakrejhkakhhxajq.supabase.co
//	export SUPABASE_API_KEY=sb_publishable_fOo9N-ENOftprDamZtRRfg_BaH9Ctu1
//
// 환경 변수 설정 예시 (PostgreSQL 직접 연결):
//
//	export SUPABASE_DB_HOST=db.vnxebakrejhkakhhxajq.supabase.co
//	export SUPABASE_DB_PORT=5432
//	export SUPABASE_DB_NAME=postgres
//	export SUPABASE_DB_USER=postgres
//	export SUPABASE_DB_PASSWORD=your-database-password
func main() {
	// user_episodes 테이블에서 모든 데이터를 조회하는 예제 실행
	database.ExampleUserEpisodesSelectAll()
}
