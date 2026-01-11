# EventSure 백엔드 API 스펙

## 개요
프론트엔드 코드 분석을 기반으로 필요한 백엔드 API 엔드포인트와 데이터 구조를 정리한 문서입니다.

**Base URL**: `http://localhost:3000/api` (또는 `VITE_API_BASE_URL` 환경변수)

**인증 방식**: Bearer Token (JWT)
- 요청 헤더: `Authorization: Bearer <token>`
- 토큰은 `localStorage.getItem('token')`에서 가져옴
- 401 에러 시 자동으로 로그아웃 처리

---

## 1. 이벤트 (Events) API

### 1.1 이벤트 목록 조회
**GET** `/events`

쿼리 파라미터:
- `status` (optional): `recruiting` | `active` | `settling`
- `category` (optional): `flightDelay` | `weather` | `tripCancel`

**응답**:
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
      "oracle": "FlightStats API",
      "resolutionTime": "이벤트 종료 후 24시간",
      "icon": "plane",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20
}
```

### 1.2 이벤트 상세 조회
**GET** `/events/:eventId`

**응답**:
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
  },
  "poolClosesAt": "2025-01-15T12:00:00Z",
  "eventEndsAt": "2025-01-15T18:00:00Z",
  "icon": "plane",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### 1.3 이벤트 참여 (Pool 가입)
**POST** `/events/:eventId/join`

**요청 본문**:
```json
{
  "walletAddress": "0x...",
  "signature": "...",  // 월렛 서명 (필요시)
  "agreedToTerms": true
}
```

**응답**:
```json
{
  "success": true,
  "transactionHash": "0x...",
  "eventId": "ke902",
  "walletAddress": "0x...",
  "premium": 25,
  "joinedAt": "2025-01-10T10:00:00Z"
}
```

---

## 2. 풀 (Pools) API

### 2.1 풀 목록 조회
**GET** `/pools`

쿼리 파라미터:
- `status` (optional): `recruiting` | `active` | `settling`
- `category` (optional): `flightDelay` | `weather` | `tripCancel`

**응답**:
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
      "updatedAt": "2025-01-10T00:00:00Z"
    }
  ],
  "total": 4,
  "page": 1,
  "limit": 20
}
```

### 2.2 풀 상세 조회
**GET** `/pools/:poolId`

**응답**: 풀 목록과 동일한 구조 (단일 객체)

---

## 3. 트랜잭션 (Transactions) API

### 3.1 실시간 트랜잭션 목록 조회
**GET** `/transactions`

쿼리 파라미터:
- `type` (optional): `purchase` | `claim` | `payout` | `stake`
- `limit` (optional): 기본값 20, 최대 100
- `offset` (optional): 기본값 0

**응답**:
```json
{
  "transactions": [
    {
      "id": "tx_123",
      "type": "purchase",
      "hash": "0x...",
      "address": "0x...",
      "amount": "0.0125",
      "currency": "MNT",
      "flight": "KE123",
      "eventId": "ke902",
      "poolId": "1",
      "timestamp": "2025-01-10T10:30:00Z",
      "blockNumber": 12345678,
      "status": "confirmed"
    }
  ],
  "total": 1000,
  "limit": 20,
  "offset": 0
}
```

### 3.2 트랜잭션 통계
**GET** `/transactions/stats`

**응답**:
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

## 4. 사용자 (User) API

### 4.1 내 이벤트 참여 정보 조회
**GET** `/users/me/events`

쿼리 파라미터:
- `eventId` (optional): 특정 이벤트 필터링

**응답**:
```json
{
  "participations": [
    {
      "eventId": "ke902",
      "poolId": "1",
      "status": "inForce",
      "premium": 25,
      "premiumCurrency": "USDC",
      "maxPayout": 300,
      "payoutCurrency": "USDC",
      "maxLoss": 25,
      "joinedAt": "2025-01-10T10:00:00Z",
      "poolClosesAt": "2025-01-15T12:00:00Z",
      "eventEndsAt": "2025-01-15T18:00:00Z",
      "event": {
        "id": "ke902",
        "title": "KE902 항공편 지연 보험",
        "subtitle": "인천-나리타 구간 출발편",
        "triggerCondition": "출발 지연 2시간 이상"
      },
      "currentData": {
        "flightStatus": "enRoute",
        "currentDelay": "1h 30m",
        "progressToTrigger": 50,
        "triggerThreshold": "2h",
        "isLive": true
      }
    }
  ]
}
```

### 4.2 이벤트 대시보드 데이터 조회
**GET** `/users/me/events/:eventId/dashboard`

**응답**:
```json
{
  "participation": {
    "eventId": "ke902",
    "poolId": "1",
    "status": "inForce",
    "premium": 25,
    "premiumCurrency": "USDC",
    "maxPayout": 300,
    "payoutCurrency": "USDC",
    "maxLoss": 25,
    "joinedAt": "2025-01-10T10:00:00Z",
    "poolClosesAt": "2025-01-15T12:00:00Z",
    "eventEndsAt": "2025-01-15T18:00:00Z"
  },
  "event": {
    "id": "ke902",
    "title": "KE902 항공편 지연 보험",
    "subtitle": "인천-나리타 구간 출발편",
    "triggerCondition": "출발 지연 2시간 이상",
    "rules": { ... }
  },
  "currentData": {
    "flightStatus": "enRoute",
    "currentDelay": "1h 30m",
    "progressToTrigger": 50,
    "triggerThreshold": "2h",
    "isLive": true,
    "lastUpdated": "2025-01-10T12:00:00Z"
  },
  "countdown": {
    "poolClosesIn": 432000,  // 초 단위
    "eventEndsIn": 604800    // 초 단위
  }
}
```

### 4.3 인증 (월렛 연동)
**POST** `/auth/wallet`

**요청 본문**:
```json
{
  "address": "0x...",
  "signature": "...",
  "message": "..."
}
```

**응답**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "address": "0x...",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

## 5. 통계 (Statistics) API

### 5.1 홈 페이지 통계
**GET** `/stats/home`

**응답**:
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

## 6. 데이터 모델

### Event (이벤트)
```typescript
interface Event {
  id: string                    // 고유 ID (예: "ke902")
  category: 'flightDelay' | 'weather' | 'tripCancel'
  status: 'recruiting' | 'active' | 'settling' | 'completed'
  title: string
  subtitle?: string
  eventWindow: string           // 이벤트 시간 범위
  triggerCondition: string      // 트리거 조건 설명
  premium: number
  premiumCurrency: string
  maxPayout: number
  payoutCurrency: string
  additionalContributions?: string
  poolLogic?: string
  oracle: {
    dataSource: string
    resolutionTime: string
  }
  poolClosesAt: string          // ISO 8601
  eventEndsAt: string           // ISO 8601
  icon: 'plane' | 'cloud' | 'suitcase'
  createdAt: string
  updatedAt: string
}
```

### Pool (풀)
```typescript
interface Pool {
  id: string
  eventId: string
  category: 'flightDelay' | 'weather' | 'tripCancel'
  status: 'recruiting' | 'active' | 'settling'
  title: string
  description: string
  coverageCondition: string
  premium: number
  premiumCurrency: string
  maxPayout: number
  payoutCurrency: string
  members: number
  poolSize: number               // 현재 모집된 금액
  poolTarget: number             // 목표 금액
  endDate: string                // ISO 8601
  icon: 'plane' | 'cloud' | 'suitcase'
  createdAt: string
  updatedAt: string
}
```

### Transaction (트랜잭션)
```typescript
interface Transaction {
  id: string
  type: 'purchase' | 'claim' | 'payout' | 'stake'
  hash: string                   // 온체인 트랜잭션 해시
  address: string                // 사용자 지갑 주소
  amount: string                 // 문자열로 저장 (정밀도)
  currency: string
  flight?: string
  eventId?: string
  poolId?: string
  timestamp: string              // ISO 8601
  blockNumber: number
  status: 'pending' | 'confirmed' | 'failed'
}
```

### User Participation (사용자 참여)
```typescript
interface UserParticipation {
  eventId: string
  poolId: string
  status: 'inForce' | 'completed' | 'cancelled'
  premium: number
  premiumCurrency: string
  maxPayout: number
  payoutCurrency: string
  maxLoss: number
  joinedAt: string
  poolClosesAt: string
  eventEndsAt: string
  event: Event
  currentData?: {
    flightStatus?: string
    currentDelay?: string
    progressToTrigger?: number
    triggerThreshold?: string
    isLive: boolean
    lastUpdated: string
  }
}
```

---

## 7. 에러 처리

### 에러 응답 형식
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": {}
  }
}
```

### 주요 HTTP 상태 코드
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 리소스 없음
- `500`: 서버 에러

### 에러 코드 예시
- `INVALID_REQUEST`: 잘못된 요청 파라미터
- `UNAUTHORIZED`: 인증 토큰이 없거나 유효하지 않음
- `EVENT_NOT_FOUND`: 이벤트를 찾을 수 없음
- `POOL_FULL`: 풀이 가득 참
- `ALREADY_JOINED`: 이미 참여함
- `INSUFFICIENT_FUNDS`: 자금 부족

---

## 8. 구현 우선순위

### Phase 1 (필수)
1. ✅ 이벤트 목록 조회 (`GET /events`)
2. ✅ 이벤트 상세 조회 (`GET /events/:eventId`)
3. ✅ 풀 목록 조회 (`GET /pools`)
4. ✅ 통계 조회 (`GET /stats/home`)

### Phase 2 (중요)
5. ✅ 트랜잭션 목록 조회 (`GET /transactions`)
6. ✅ 트랜잭션 통계 (`GET /transactions/stats`)
7. ✅ 사용자 참여 정보 (`GET /users/me/events`)
8. ✅ 이벤트 대시보드 (`GET /users/me/events/:eventId/dashboard`)

### Phase 3 (기능)
9. ✅ 이벤트 참여 (`POST /events/:eventId/join`)
10. ✅ 월렛 인증 (`POST /auth/wallet`)

---

## 9. 추가 고려사항

### 실시간 업데이트
- 트랜잭션 피드는 WebSocket 또는 Server-Sent Events (SSE)로 실시간 업데이트 가능
- 현재 데이터 (flight status, delay 등)는 주기적으로 폴링하거나 WebSocket으로 업데이트

### 캐싱
- 이벤트 목록, 풀 목록은 캐싱 권장
- 통계 데이터는 짧은 TTL (예: 1-5분)로 캐싱

### 페이지네이션
- 목록 API는 기본적으로 페이지네이션 구현 권장
- 쿼리 파라미터: `page`, `limit`, `offset`

### 정렬
- 트랜잭션: 최신순 (기본값)
- 이벤트/풀: 생성일시 또는 종료일시 기준
