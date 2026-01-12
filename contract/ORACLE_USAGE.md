# Flight Oracle 사용 가이드

## 개요

Mantle Network에서 Chainlink Functions가 지원되지 않기 때문에, 간단한 신뢰 기반 오라클 패턴을 사용합니다.

### 아키텍처

```
오프체인 서버/스크립트
    ↓ (항공 API 호출)
항공 데이터 API (AviationStack, FlightAware 등)
    ↓
FlightOracle 컨트랙트 (온체인)
    ↓
Episode 컨트랙트 해결 (resolve)
```

## 배포

### 1. 환경 변수 설정

`.env` 파일 생성:

```bash
PRIVATE_KEY=your_private_key
RPC_URL=https://rpc.mantle.xyz  # Mantle mainnet
# 또는 테스트넷: https://rpc.testnet.mantle.xyz
```

### 2. 컨트랙트 배포

```bash
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

배포 후 나오는 주소들을 기록해두세요:
- FlightOracle 주소
- EpisodeFactory 주소

## 사용 방법

### 1. Episode 생성

EpisodeFactory를 통해 Episode를 생성합니다:

```solidity
factory.createEpisode(
    productId,           // 상품 ID
    signupStart,         // 가입 시작 시간
    signupEnd,           // 가입 종료 시간
    0.01 ether,          // 프리미엄 금액
    0.05 ether,          // 지급 금액
    "KE123",             // 항공편명
    1705000000,          // 출발 시간
    1705010000           // 예상 도착 시간
);
```

### 2. 항공 데이터 업데이트

항공편이 도착한 후, 실제 데이터를 오라클에 업데이트합니다.

#### 방법 A: Foundry 스크립트 사용

```bash
# .env 파일에 추가
ORACLE_ADDRESS=0x...
FLIGHT_NUMBER=KE123
DEPARTURE_TIME=1705000000
ACTUAL_ARRIVAL=1705017200  # 실제 도착 시간
IS_DELAYED=true

# 스크립트 실행
forge script script/UpdateOracle.s.sol:UpdateOracleScript \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

#### 방법 B: Cast 직접 호출

```bash
cast send $ORACLE_ADDRESS \
  "updateFlightStatus(string,uint64,uint64,bool)" \
  "KE123" \
  1705000000 \
  1705017200 \
  true \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

### 3. Episode 해결 (Resolve)

데이터 업데이트 후 Episode를 해결합니다:

#### 방법 A: Foundry 스크립트

```bash
# .env 파일에 추가
EPISODE_ADDRESS=0x...

forge script script/UpdateOracle.s.sol:ResolveEpisodeScript \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

#### 방법 B: Cast 직접 호출

```bash
cast send $ORACLE_ADDRESS \
  "resolveEpisode(address)" \
  $EPISODE_ADDRESS \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

### 4. Episode 정산 (Settle)

```bash
cast send $EPISODE_ADDRESS \
  "settle()" \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

## 오프체인 자동화 (선택 사항)

실제 운영을 위해서는 오프체인 서버/스크립트가 필요합니다.

### Node.js 예제 (의사 코드)

```javascript
const { ethers } = require('ethers');
const axios = require('axios');

// 설정
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const oracle = new ethers.Contract(oracleAddress, oracleABI, wallet);

// 주기적으로 체크
setInterval(async () => {
  // 1. Episode 목록 가져오기
  const episodes = await getLockedEpisodes();
  
  for (const episode of episodes) {
    // 2. 항공 API에서 데이터 가져오기
    const flightData = await fetchFlightData(
      episode.flightName,
      episode.departureTime
    );
    
    if (flightData.landed) {
      // 3. 오라클 업데이트
      await oracle.updateFlightStatus(
        episode.flightName,
        episode.departureTime,
        flightData.actualArrival,
        flightData.isDelayed
      );
      
      // 4. Episode 해결
      await oracle.resolveEpisode(episode.address);
    }
  }
}, 60000); // 1분마다

// 항공 API 호출 (예: AviationStack)
async function fetchFlightData(flightNumber, departureTime) {
  const response = await axios.get(
    `http://api.aviationstack.com/v1/flights`,
    {
      params: {
        access_key: process.env.AVIATION_API_KEY,
        flight_iata: flightNumber
      }
    }
  );
  
  // 응답 파싱 및 반환
  const flight = response.data.data[0];
  return {
    landed: flight.flight_status === 'landed',
    actualArrival: new Date(flight.arrival.actual).getTime() / 1000,
    isDelayed: flight.arrival.delay > 0
  };
}
```

## 추천 항공 데이터 API

1. **AviationStack** (https://aviationstack.com/)
   - 무료 플랜 사용 가능
   - 실시간 및 과거 항공 데이터

2. **FlightAware** (https://www.flightaware.com/commercial/firehose/)
   - 신뢰성 높음
   - 유료 서비스

3. **Aviation Edge** (https://aviation-edge.com/)
   - 저렴한 가격
   - 글로벌 커버리지

## 보안 고려사항

1. **중앙화 리스크**: 현재 구현은 오라클 소유자를 신뢰해야 합니다.
2. **개선 방안**:
   - 멀티시그 지갑으로 오라클 소유권 관리
   - 여러 데이터 소스 사용 및 합의 메커니즘
   - API3 DAO 또는 유사한 탈중앙화 오라클 솔루션 고려

## 테스트

```bash
# 컴파일
forge build

# 테스트 (테스트 파일 작성 필요)
forge test

# 가스 리포트
forge test --gas-report
```

## 트러블슈팅

### 오라클 권한 오류
- FlightOracle의 owner가 올바른 주소인지 확인
- Episode 생성 시 oracle 주소가 올바르게 설정되었는지 확인

### Episode 상태 오류
- Episode가 Locked 상태인지 확인
- `cast call`로 상태 확인: `cast call $EPISODE_ADDRESS "state()(uint8)"`

### 타임스탬프 변환
- JavaScript: `Math.floor(Date.now() / 1000)`
- 온라인 도구: https://www.unixtimestamp.com/
