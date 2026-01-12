# 빠른 시작 가이드

## 1. 배포 (5분)

### 환경 설정
```bash
# .env 파일 생성
cat > .env << EOF
PRIVATE_KEY=your_private_key_here
RPC_URL=https://rpc.sepolia.mantle.xyz
EOF
```

### 컨트랙트 배포
```bash
source .env
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

# 출력된 주소를 .env에 추가
# ORACLE_ADDRESS=0x...
# FACTORY_ADDRESS=0x...
```

## 2. Episode 생성

```bash
# script/CreateEpisode.s.sol에서 FACTORY_ADDRESS 수정 후
forge script script/CreateEpisode.s.sol:CreateEpisode \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

# EPISODE_ADDRESS를 .env에 추가
```

## 3. Episode 열기

```bash
cast send $FACTORY_ADDRESS \
  "openEpisode(address)" \
  $EPISODE_ADDRESS \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

## 4. 사용자 가입 (테스트)

```bash
# 0.01 ETH 프리미엄으로 가입
cast send $EPISODE_ADDRESS \
  "join()" \
  --value 0.01ether \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

## 5. Episode Lock (가입 종료)

```bash
cast send $FACTORY_ADDRESS \
  "lockEpisode(address)" \
  $EPISODE_ADDRESS \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

## 6. 항공 데이터 업데이트 & 해결

### 방법 A: 수동 (Cast)
```bash
# 현재 시간 가져오기
CURRENT_TIME=$(date +%s)
ACTUAL_ARRIVAL=$((CURRENT_TIME + 7200))  # 2시간 지연

# 오라클 업데이트
cast send $ORACLE_ADDRESS \
  "updateFlightStatus(string,uint64,uint64,bool)" \
  "KE123" \
  $DEPARTURE_TIME \
  $ACTUAL_ARRIVAL \
  true \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# Episode 해결
cast send $ORACLE_ADDRESS \
  "resolveEpisode(address)" \
  $EPISODE_ADDRESS \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

### 방법 B: 스크립트 (.env 설정 후)
```bash
# .env에 추가
FLIGHT_NUMBER=KE123
DEPARTURE_TIME=1737000000
ACTUAL_ARRIVAL=1737007200
IS_DELAYED=true

# 실행
forge script script/UpdateOracle.s.sol:UpdateOracleScript \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

forge script script/UpdateOracle.s.sol:ResolveEpisodeScript \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

## 7. 정산 & 클레임

```bash
# Episode 정산
cast send $EPISODE_ADDRESS \
  "settle()" \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# 사용자가 클레임 (지연 발생 시)
cast send $EPISODE_ADDRESS \
  "claim()" \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# 또는 잉여금 인출 (지연 미발생 시)
cast send $EPISODE_ADDRESS \
  "withdrawSurplus()" \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

## 8. Episode 종료

```bash
cast send $FACTORY_ADDRESS \
  "closeEpisode(address)" \
  $EPISODE_ADDRESS \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

---

## 유용한 조회 명령어

```bash
# Episode 상태 확인
cast call $EPISODE_ADDRESS "state()(uint8)" --rpc-url $RPC_URL
# 0=Created, 1=Open, 2=Locked, 3=Resolved, 4=Settled, 5=Closed

# 총 프리미엄 확인
cast call $EPISODE_ADDRESS "totalPremium()(uint256)" --rpc-url $RPC_URL

# 항공편 정보 확인
cast call $EPISODE_ADDRESS "flightName()(string)" --rpc-url $RPC_URL
cast call $EPISODE_ADDRESS "departureTime()(uint64)" --rpc-url $RPC_URL
cast call $EPISODE_ADDRESS "estimatedArrivalTime()(uint64)" --rpc-url $RPC_URL

# 이벤트 발생 여부 확인
cast call $EPISODE_ADDRESS "eventOccurred()(bool)" --rpc-url $RPC_URL

# 실제 도착 시간 확인
cast call $EPISODE_ADDRESS "finalArrivalTime()(uint64)" --rpc-url $RPC_URL

# 모든 Episode 목록
cast call $FACTORY_ADDRESS "allEpisodes()(address[])" --rpc-url $RPC_URL

# 항공 상태 조회 (Oracle)
cast call $ORACLE_ADDRESS \
  "getFlightStatus(string,uint64)((string,uint64,uint64,bool,bool,uint64))" \
  "KE123" \
  $DEPARTURE_TIME \
  --rpc-url $RPC_URL
```

## 테스트넷 Faucet

Mantle Testnet에서 테스트용 MNT 받기:
- https://faucet.testnet.mantle.xyz/

---

## 트러블슈팅

### "Unauthorized" 에러
→ 올바른 private key를 사용하고 있는지 확인 (owner/deployer)

### "InvalidState" 에러
→ Episode가 올바른 상태인지 확인 (`state()` 조회)

### "InvalidAmount" 에러
→ 정확한 프리미엄 금액(0.01 ether)으로 join 하는지 확인

### 타임스탬프 변환
```bash
# 현재 Unix 타임스탬프
date +%s

# 특정 날짜를 Unix 타임스탬프로
date -d "2024-01-15 14:30:00" +%s

# Unix 타임스탬프를 날짜로
date -d @1737000000
```
