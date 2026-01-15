# API 명세서

## Episode Endpoints

### [GET] 모든 Episode 조회
```
http://localhost:3000/api/episodes
```

**Response:**
```json
{
    "episodes": [
        "0x605c39938bdec77f3ee744881753c3c458c69342",
        "0xf4a02c1fa48dffb2721f29722ccedbf50497f940",
        "0x9706f63f070787a0f91de69ba9399381bf1c2241",
        "0x8b064b4f2e8b78594cf2f0753672b4d98c46d987",
        "0xe1299cbd3a2c616c884c8cf5590b9c718aae7d7d",
        "0x0bffc806333722a5259ea39c8df1beb6e44d2bd1"
    ]
}
```

**설명:**
- EpisodeContractFactory의 내부 트랜잭션을 조회하여 생성된 모든 Episode 컨트랙트 주소 목록을 반환합니다.
- Etherscan API를 통해 조회합니다.

---

### [GET] Episode 이벤트 조회
```
http://localhost:3000/api/episodes/{episode}/events
```

**Path Parameters:**
- `episode` (string, required): Episode 컨트랙트 주소

**Example:**
```
http://localhost:3000/api/episodes/0xe1299CBD3A2C616C884C8cF5590B9c718AAE7D7d/events
```

**Response:**
```json
{
    "events": [
        {
            "transactionHash": "0x9f02dbe0c341b48e5a49034a4a9c983c38e85b584493a56872e6beecbb51bf3c",
            "event": "Created",
            "timeStamp": "2026-01-14 02:02:57"
        },
        {
            "transactionHash": "0xae907f385516403c48f77b5b5cd220a76ae9f953e2ea3388d05b881d991d5d8e",
            "event": "Open",
            "timeStamp": "2026-01-14 02:03:05"
        },
        {
            "transactionHash": "0x48c04fb602e903dc7aa4f63b55ec9fe8f9c6580d1f4fb78a61ac8b957846bf0e",
            "event": "Locked",
            "timeStamp": "2026-01-14 02:03:15"
        },
        {
            "transactionHash": "0x4bd6581c9f2d8a1e6b3a92178702a49241f9a401d2a4480a079225e8c116bda4",
            "event": "Resolved",
            "timeStamp": "2026-01-14 02:03:37"
        }
    ]
}
```

**설명:**
- 특정 Episode 컨트랙트 주소의 모든 이벤트 로그를 조회합니다.
- Etherscan API를 통해 EventLogs를 조회하고, Topics[0]을 통해 이벤트 이름을 식별합니다.
- 지원하는 이벤트: `Created`, `Open`, `Join`, `Locked`, `Resolved`
- 알 수 없는 이벤트는 `Unknown`으로 표시됩니다.
- TimeStamp는 "YYYY-MM-DD HH:MM:SS" 형식으로 변환됩니다.

---

## User Episode Endpoints

### [POST] User Episode 생성
```
http://localhost:3000/api/user-episodes
```

**Request Body:**
```json
{
    "user": "0x72BaEc75536D8c93B80Cbf155CA945DbDc3C972f",
    "episode": "0xD3a43B1F7B41745AFf8ACf85Bb81855f2890617A"
}
```

**Response:**
```json
{
    "id": 4,
    "user": "0x72BaEc75536D8c93B80Cbf155CA945DbDc3C972f",
    "episode": "0xD3a43B1F7B41745AFf8ACf85Bb81855f2890617A",
    "created_at": "2026-01-13T14:51:37.524433+00:00"
}
```

**설명:**
- 사용자와 Episode의 연결 관계를 생성합니다.
- Supabase의 `user_episodes` 테이블에 저장됩니다.

---

### [GET] User별 Episode 조회
```
http://localhost:3000/api/user-episodes?user={user_address}
```

**Query Parameters:**
- `user` (string, required): 사용자 주소

**Example:**
```
http://localhost:3000/api/user-episodes?user=0x72BaEc75536D8c93B80Cbf155CA945DbDc3C972f
```

**Response:**
```json
{
    "episodes": [
        {
            "id": 4,
            "user": "0x72BaEc75536D8c93B80Cbf155CA945DbDc3C972f",
            "episode": "0xD3a43B1F7B41745AFf8ACf85Bb81855f2890617A",
            "created_at": "2026-01-13T14:51:37.524433+00:00"
        }
    ]
}
```

**설명:**
- 특정 사용자가 참여한 모든 Episode 목록을 반환합니다.

---

### [GET] Episode별 User 조회
```
http://localhost:3000/api/user-episodes?episode={episode_address}
```

**Query Parameters:**
- `episode` (string, required): Episode 컨트랙트 주소

**Example:**
```
http://localhost:3000/api/user-episodes?episode=0xD3a43B1F7B41745AFf8ACf85Bb81855f2890617A
```

**Response:**
```json
{
    "users": [
        {
            "id": 4,
            "user": "0x72BaEc75536D8c93B80Cbf155CA945DbDc3C972f",
            "episode": "0xD3a43B1F7B41745AFf8ACf85Bb81855f2890617A",
            "created_at": "2026-01-13T14:51:37.524433+00:00"
        }
    ]
}
```

**설명:**
- 특정 Episode에 참여한 모든 사용자 목록을 반환합니다.

---

## Health Check

### [GET] Health Check
```
http://localhost:3000/health
```

**Response:**
```
OK
```

**설명:**
- 서버 상태 확인용 엔드포인트입니다.
- Railway 등 배포 플랫폼에서 헬스체크에 사용됩니다.

---

## 에러 응답

모든 엔드포인트는 다음과 같은 에러 응답을 반환할 수 있습니다:

**400 Bad Request:**
- 필수 파라미터가 누락된 경우
- 잘못된 요청 형식

**500 Internal Server Error:**
- 서버 내부 오류
- 외부 API (Etherscan, Supabase) 연결 실패
- 환경 변수 미설정

**에러 응답 예시:**
```json
{
    "error": "episode address is required"
}
```

---

## 환경 변수

다음 환경 변수가 필요합니다:

- `SUPABASE_PROJECT_URL`: Supabase 프로젝트 URL
- `SUPABASE_API_KEY`: Supabase API Key
- `ETHERSCAN_API_KEY`: Etherscan API Key
- `ETHERSCAN_CHAIN_ID`: 체인 ID (기본값: 1)
- `EPISODE_CONTRACT_FACTORY`: Episode Contract Factory 주소
