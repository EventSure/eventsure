# EventSure API Postman 테스트 가이드

## 기본 설정

**Base URL**: `http://localhost:3000`

**Content-Type**: `application/json`

---

## 1. 이벤트 (Events) API

### 1.1 이벤트 목록 조회
**GET** `http://localhost:3000/api/events`

**설명**: 모든 이벤트 목록을 조회합니다.

**쿼리 파라미터** (선택사항):
- `status`: `recruiting` | `active` | `settling` | `completed`
- `category`: `flightDelay` | `weather` | `tripCancel`

**예시 요청**:
```
GET http://localhost:3000/api/events
```

**예시 요청 (필터링)**:
```
GET http://localhost:3000/api/events?status=recruiting
GET http://localhost:3000/api/events?category=flightDelay
GET http://localhost:3000/api/events?status=recruiting&category=flightDelay
```

**예상 응답**:
```json
{
  "events": [
    {
      "id": "ke902",
      "category": "flightDelay",
      "status": "recruiting",
      "title": "KE902 항공편 지연 보험",
      "subtitle": "인천-나리타 구간 출발편",
      "eventWindow": "2025.01.15 14:00 - 2025.01.15 18:00",
      "triggerCondition": "출발 지연 2시간 이상",
      "premium": 25,
      "premiumCurrency": "USDC",
      "maxPayout": 300,
      "payoutCurrency": "USDC",
      "icon": "plane",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    },
    {
      "id": "jejuTyphoon",
      "category": "weather",
      "status": "recruiting",
      "title": "제주도 태풍 취소 보험",
      "subtitle": "제주도 태풍 관련 항공편",
      "eventWindow": "2025.08.01 - 2025.08.31",
      "triggerCondition": "태풍 경보로 인한 결항 시 자동 지급",
      "premium": 50,
      "premiumCurrency": "USDC",
      "maxPayout": 500,
      "payoutCurrency": "USDC",
      "icon": "cloud",
      "createdAt": "2025-07-01T00:00:00Z",
      "updatedAt": "2025-07-01T00:00:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20
}
```

---

### 1.2 이벤트 상세 조회
**GET** `http://localhost:3000/api/events/{eventId}`

**설명**: 특정 이벤트의 상세 정보를 조회합니다.

**경로 파라미터**:
- `eventId`: 이벤트 ID (예: `ke902`, `jejuTyphoon`)

**예시 요청**:
```
GET http://localhost:3000/api/events/ke902
GET http://localhost:3000/api/events/jejuTyphoon
```

**예상 응답**:
```json
{
  "id": "ke902",
  "category": "flightDelay",
  "status": "recruiting",
  "title": "KE902 항공편 지연 보험",
  "subtitle": "인천-나리타 구간 출발편",
  "eventWindow": "2025.01.15 14:00 - 2025.01.15 18:00",
  "triggerCondition": "출발 지연 2시간 이상",
  "premium": 25,
  "premiumCurrency": "USDC",
  "maxPayout": 300,
  "payoutCurrency": "USDC",
  "additionalContributions": "none",
  "poolLogic": "Homogeneous risk pool. Surplus returned pro-rata to members.",
  "oracle": {
    "dataSource": "FlightStats API",
    "resolutionTime": "이벤트 종료 후 24시간"
  },
  "poolClosesAt": "2025-01-15T12:00:00Z",
  "eventEndsAt": "2025-01-15T18:00:00Z",
  "icon": "plane",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z",
  "rules": {
    "coveredEvent": {
      "event": "KE902 항공편 지연 보험",
      "eventWindow": "2025.01.15 14:00 - 2025.01.15 18:00",
      "triggerCondition": "출발 지연 2시간 이상"
    },
    "oracle": {
      "dataSource": "FlightStats API",
      "resolutionTime": "이벤트 종료 후 24시간"
    },
    "financialTerms": {
      "premium": 25,
      "maxPayout": 300,
      "additionalContributions": "none"
    },
    "poolLogic": "Homogeneous risk pool. Surplus returned pro-rata to members."
  }
}
```

---

## 2. 풀 (Pools) API

### 2.1 풀 목록 조회
**GET** `http://localhost:3000/api/pools`

**설명**: 모든 풀 목록을 조회합니다.

**쿼리 파라미터** (선택사항):
- `status`: `recruiting` | `active` | `settling`
- `category`: `flightDelay` | `weather` | `tripCancel`

**예시 요청**:
```
GET http://localhost:3000/api/pools
GET http://localhost:3000/api/pools?status=recruiting
GET http://localhost:3000/api/pools?category=flightDelay
GET http://localhost:3000/api/pools?status=active&category=flightDelay
```

**예상 응답**:
```json
{
  "pools": [
    {
      "id": "1",
      "eventId": "ke902",
      "category": "flightDelay",
      "status": "recruiting",
      "title": "인천-도쿄 항공편 지연 보험",
      "description": "2025년 1월 15일 인천-나리타 구간 출발편 2시간 이상 지연 시 보상",
      "coverageCondition": "출발 지연 2시간 이상 시 자동 지급",
      "premium": 15000,
      "premiumCurrency": "KRW",
      "maxPayout": 300000,
      "payoutCurrency": "KRW",
      "members": 127,
      "poolSize": 1905000,
      "poolTarget": 3000000,
      "endDate": "2025-01-15T00:00:00Z",
      "icon": "plane",
      "createdAt": "2024-12-01T00:00:00Z",
      "updatedAt": "2024-12-01T00:00:00Z"
    },
    {
      "id": "2",
      "eventId": "jejuTyphoon",
      "category": "weather",
      "status": "recruiting",
      "title": "제주도 태풍 취소 보험",
      "description": "2025년 8월 여름 시즌 제주 여행 태풍으로 인한 항공편 결항 보상",
      "coverageCondition": "태풍 경보로 인한 결항 시 자동 지급",
      "premium": 25000,
      "premiumCurrency": "KRW",
      "maxPayout": 500000,
      "payoutCurrency": "KRW",
      "members": 89,
      "poolSize": 2225000,
      "poolTarget": 5000000,
      "endDate": "2025-08-31T00:00:00Z",
      "icon": "cloud",
      "createdAt": "2025-07-01T00:00:00Z",
      "updatedAt": "2025-07-01T00:00:00Z"
    },
    {
      "id": "3",
      "eventId": "gimpoJeju",
      "category": "flightDelay",
      "status": "active",
      "title": "김포-제주 항공편 지연 보험",
      "description": "2025년 1월 국내선 김포-제주 구간 2시간 이상 지연 시 보상",
      "coverageCondition": "출발 지연 2시간 이상 시 자동 지급",
      "premium": 10000,
      "premiumCurrency": "KRW",
      "maxPayout": 200000,
      "payoutCurrency": "KRW",
      "members": 256,
      "poolSize": 2560000,
      "poolTarget": 3000000,
      "endDate": "2025-01-31T00:00:00Z",
      "icon": "plane",
      "createdAt": "2024-12-15T00:00:00Z",
      "updatedAt": "2024-12-15T00:00:00Z"
    },
    {
      "id": "4",
      "eventId": "tokyoCherry",
      "category": "tripCancel",
      "status": "settling",
      "title": "도쿄 벚꽃 시즌 여행 보험",
      "description": "2024년 4월 도쿄 벚꽃 시즌 여행 취소 보상 정산 진행중",
      "coverageCondition": "항공편 결항 또는 숙소 취소 시 자동 지급",
      "premium": 20000,
      "premiumCurrency": "KRW",
      "maxPayout": 400000,
      "payoutCurrency": "KRW",
      "members": 312,
      "poolSize": 6240000,
      "poolTarget": 6240000,
      "endDate": "2024-04-15T00:00:00Z",
      "icon": "suitcase",
      "createdAt": "2024-03-01T00:00:00Z",
      "updatedAt": "2024-03-01T00:00:00Z"
    }
  ],
  "total": 4,
  "page": 1,
  "limit": 20
}
```

---

## 3. 통계 (Statistics) API

### 3.1 홈 페이지 통계
**GET** `http://localhost:3000/api/stats/home`

**설명**: 홈 페이지에 표시할 통계 정보를 조회합니다.

**예시 요청**:
```
GET http://localhost:3000/api/stats/home
```

**예상 응답**:
```json
{
  "tvl": 2500000,
  "tvlCurrency": "USD",
  "totalPolicies": 15000,
  "claimRate": 98,
  "claimRateUnit": "percent",
  "averagePayoutTime": 300,
  "payoutTimeUnit": "seconds"
}
```

---

## 4. 트랜잭션 (Transactions) API

### 4.1 트랜잭션 목록 조회
**GET** `http://localhost:3000/api/transactions`

**설명**: 트랜잭션 목록을 조회합니다.

**쿼리 파라미터** (선택사항):
- `type`: `purchase` | `claim` | `payout` | `stake`
- `limit`: 기본값 20, 최대 100
- `offset`: 기본값 0

**예시 요청**:
```
GET http://localhost:3000/api/transactions
GET http://localhost:3000/api/transactions?type=purchase
GET http://localhost:3000/api/transactions?limit=10&offset=0
GET http://localhost:3000/api/transactions?type=claim&limit=5
```

**예상 응답**:
```json
{
  "transactions": [
    {
      "id": "tx_001",
      "type": "purchase",
      "hash": "0x1234567890abcdef1234567890abcdef12345678",
      "address": "0xabcdef1234567890abcdef1234567890abcdef12",
      "amount": "0.0125",
      "currency": "MNT",
      "flight": "KE123",
      "eventId": "ke902",
      "poolId": "1",
      "timestamp": "2025-01-10T10:30:00Z",
      "blockNumber": 12345678,
      "status": "confirmed"
    },
    {
      "id": "tx_002",
      "type": "claim",
      "hash": "0x2345678901bcdef2345678901bcdef23456789",
      "address": "0xbcdef12345678901bcdef12345678901bcdef23",
      "amount": "0.0300",
      "currency": "MNT",
      "flight": "BA321",
      "eventId": "jejuTyphoon",
      "poolId": "2",
      "timestamp": "2025-01-10T10:25:00Z",
      "blockNumber": 12345677,
      "status": "confirmed"
    },
    {
      "id": "tx_003",
      "type": "payout",
      "hash": "0x3456789012cdef3456789012cdef34567890",
      "address": "0xcdef123456789012cdef123456789012cdef34",
      "amount": "0.0500",
      "currency": "MNT",
      "flight": "EK111",
      "eventId": "ke902",
      "poolId": "1",
      "timestamp": "2025-01-10T10:20:00Z",
      "blockNumber": 12345676,
      "status": "confirmed"
    },
    {
      "id": "tx_004",
      "type": "stake",
      "hash": "0x4567890123def4567890123def45678901",
      "address": "0xdef1234567890123def1234567890123def45",
      "amount": "1.5000",
      "currency": "MNT",
      "eventId": "ke902",
      "poolId": "1",
      "timestamp": "2025-01-10T10:15:00Z",
      "blockNumber": 12345675,
      "status": "confirmed"
    }
  ],
  "total": 4,
  "limit": 20,
  "offset": 0
}
```

---

### 4.2 트랜잭션 통계
**GET** `http://localhost:3000/api/transactions/stats`

**설명**: 트랜잭션 통계 정보를 조회합니다.

**예시 요청**:
```
GET http://localhost:3000/api/transactions/stats
```

**예상 응답**:
```json
{
  "totalVolume24h": 1234567,
  "volumeCurrency": "USD",
  "activePolicies": 15234,
  "transactionsPerSecond": 12.5,
  "networkStats": {
    "network": "Mantle Network",
    "blockNumber": 12345678,
    "gasPrice": "0.02",
    "gasUnit": "gwei"
  }
}
```

---

## Postman 컬렉션 설정 가이드

### 환경 변수 설정
1. Postman에서 Environment 생성
2. 변수 추가:
   - `base_url`: `http://localhost:3000`
   - `api_base`: `{{base_url}}/api`

### 요청 URL 예시
- 전체 URL: `{{api_base}}/events`
- 또는 직접: `http://localhost:3000/api/events`

### 헤더 설정
일반적으로 헤더 설정이 필요 없습니다. (JSON 자동 인식)

---

## 테스트 시나리오

### 기본 테스트 플로우
1. ✅ **홈 통계 조회**: `GET /api/stats/home`
2. ✅ **이벤트 목록 조회**: `GET /api/events`
3. ✅ **이벤트 상세 조회**: `GET /api/events/ke902`
4. ✅ **풀 목록 조회**: `GET /api/pools`
5. ✅ **트랜잭션 목록 조회**: `GET /api/transactions`
6. ✅ **트랜잭션 통계 조회**: `GET /api/transactions/stats`

### 필터링 테스트
1. ✅ **상태별 이벤트**: `GET /api/events?status=recruiting`
2. ✅ **카테고리별 이벤트**: `GET /api/events?category=flightDelay`
3. ✅ **조합 필터**: `GET /api/events?status=recruiting&category=flightDelay`
4. ✅ **트랜잭션 타입 필터**: `GET /api/transactions?type=purchase`
5. ✅ **페이지네이션**: `GET /api/transactions?limit=2&offset=0`

### 에러 케이스 테스트
1. ❌ **존재하지 않는 이벤트**: `GET /api/events/notfound` → 404
2. ❌ **잘못된 쿼리 파라미터**: `GET /api/events?status=invalid` → 빈 결과

---

## 샘플 Event ID & Pool ID

**Event IDs**:
- `ke902` - KE902 항공편 지연 보험
- `jejuTyphoon` - 제주도 태풍 취소 보험

**Pool IDs**:
- `1` - 인천-도쿄 항공편 지연 보험 풀
- `2` - 제주도 태풍 취소 보험 풀
- `3` - 김포-제주 항공편 지연 보험 풀
- `4` - 도쿄 벚꽃 시즌 여행 보험 풀

**Transaction IDs**:
- `tx_001` - purchase
- `tx_002` - claim
- `tx_003` - payout
- `tx_004` - stake

---

## 서버 실행 방법

```bash
cd server
go run .
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

포트를 변경하려면:
```bash
PORT=8080 go run .
```
