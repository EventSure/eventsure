package mock

import (
	"time"
	eventsureepisode "eventsure-server/domain/episode"
	eventsurepool "eventsure-server/domain/pool"
	eventsuretransaction "eventsure-server/domain/transaction"
)

// CreateMockEpisodes creates mock episodes
func CreateMockEpisodes() []*eventsureepisode.Episode {
	poolClosesAt1 := time.Date(2025, 1, 15, 12, 0, 0, 0, time.UTC)
	eventEndsAt1 := time.Date(2025, 1, 15, 18, 0, 0, 0, time.UTC)
	poolClosesAt2 := time.Date(2025, 8, 31, 12, 0, 0, 0, time.UTC)
	eventEndsAt2 := time.Date(2025, 9, 1, 0, 0, 0, 0, time.UTC)

	subtitle1 := "인천-나리타 구간 출발편"
	subtitle2 := "제주도 태풍 관련 항공편"
	additionalContributions := "none"
	poolLogic := "Homogeneous risk pool. Surplus returned pro-rata to members."

	episode1 := eventsureepisode.NewEpisode(
		"ke902",
		eventsureepisode.CategoryFlightDelay,
		eventsureepisode.StatusRecruiting,
		"KE902 항공편 지연 보험",
		"2025.01.15 14:00 - 2025.01.15 18:00",
		"출발 지연 2시간 이상",
		25,
		"USDC",
		300,
		"USDC",
		eventsureepisode.IconPlane,
	)
	episode1.SetSubtitle(subtitle1)
	episode1.SetAdditionalContributions(additionalContributions)
	episode1.SetPoolLogic(poolLogic)
	episode1.SetOracle(eventsureepisode.NewOracle("FlightStats API", "이벤트 종료 후 24시간"))
	episode1.SetPoolClosesAt(poolClosesAt1)
	episode1.SetEventEndsAt(eventEndsAt1)

	episode2 := eventsureepisode.NewEpisode(
		"jejuTyphoon",
		eventsureepisode.CategoryWeather,
		eventsureepisode.StatusRecruiting,
		"제주도 태풍 취소 보험",
		"2025.08.01 - 2025.08.31",
		"태풍 경보로 인한 결항 시 자동 지급",
		50,
		"USDC",
		500,
		"USDC",
		eventsureepisode.IconCloud,
	)
	episode2.SetSubtitle(subtitle2)
	episode2.SetAdditionalContributions(additionalContributions)
	episode2.SetPoolLogic(poolLogic)
	episode2.SetOracle(eventsureepisode.NewOracle("기상청 API", "이벤트 종료 후 48시간"))
	episode2.SetPoolClosesAt(poolClosesAt2)
	episode2.SetEventEndsAt(eventEndsAt2)

	return []*eventsureepisode.Episode{episode1, episode2}
}

// CreateMockPools creates mock pools
func CreateMockPools() []*eventsurepool.Pool {
	pool1 := eventsurepool.NewPool(
		"1",
		"ke902",
		eventsurepool.CategoryFlightDelay,
		eventsurepool.StatusRecruiting,
		"인천-도쿄 항공편 지연 보험",
		"2025년 1월 15일 인천-나리타 구간 출발편 2시간 이상 지연 시 보상",
		"출발 지연 2시간 이상 시 자동 지급",
		15000,
		"KRW",
		300000,
		"KRW",
		3000000,
		time.Date(2025, 1, 15, 0, 0, 0, 0, time.UTC),
		eventsurepool.IconPlane,
	)
	// Add members manually since we can't set it in constructor
	for i := 0; i < 127; i++ {
		pool1.AddMember(15000)
	}

	pool2 := eventsurepool.NewPool(
		"2",
		"jejuTyphoon",
		eventsurepool.CategoryWeather,
		eventsurepool.StatusRecruiting,
		"제주도 태풍 취소 보험",
		"2025년 8월 여름 시즌 제주 여행 태풍으로 인한 항공편 결항 보상",
		"태풍 경보로 인한 결항 시 자동 지급",
		25000,
		"KRW",
		500000,
		"KRW",
		5000000,
		time.Date(2025, 8, 31, 0, 0, 0, 0, time.UTC),
		eventsurepool.IconCloud,
	)
	for i := 0; i < 89; i++ {
		pool2.AddMember(25000)
	}

	pool3 := eventsurepool.NewPool(
		"3",
		"gimpoJeju",
		eventsurepool.CategoryFlightDelay,
		eventsurepool.StatusActive,
		"김포-제주 항공편 지연 보험",
		"2025년 1월 국내선 김포-제주 구간 2시간 이상 지연 시 보상",
		"출발 지연 2시간 이상 시 자동 지급",
		10000,
		"KRW",
		200000,
		"KRW",
		3000000,
		time.Date(2025, 1, 31, 0, 0, 0, 0, time.UTC),
		eventsurepool.IconPlane,
	)
	for i := 0; i < 256; i++ {
		pool3.AddMember(10000)
	}

	pool4 := eventsurepool.NewPool(
		"4",
		"tokyoCherry",
		eventsurepool.CategoryTripCancel,
		eventsurepool.StatusSettling,
		"도쿄 벚꽃 시즌 여행 보험",
		"2024년 4월 도쿄 벚꽃 시즌 여행 취소 보상 정산 진행중",
		"항공편 결항 또는 숙소 취소 시 자동 지급",
		20000,
		"KRW",
		400000,
		"KRW",
		6240000,
		time.Date(2024, 4, 15, 0, 0, 0, 0, time.UTC),
		eventsurepool.IconSuitcase,
	)
	for i := 0; i < 312; i++ {
		pool4.AddMember(20000)
	}

	return []*eventsurepool.Pool{pool1, pool2, pool3, pool4}
}

// CreateMockTransactions creates mock transactions
func CreateMockTransactions() []*eventsuretransaction.Transaction {
	now := time.Now()
	flight1 := "KE123"
	flight2 := "BA321"
	flight3 := "EK111"
	episodeID1 := "ke902"
	episodeID2 := "jejuTyphoon"
	poolID1 := "1"
	poolID2 := "2"

	tx1 := eventsuretransaction.NewTransaction(
		"tx_001",
		eventsuretransaction.TypePurchase,
		"0x1234567890abcdef1234567890abcdef12345678",
		"0xabcdef1234567890abcdef1234567890abcdef12",
		"0.0125",
		"MNT",
		now.Add(-5*time.Minute),
		12345678,
		eventsuretransaction.StatusConfirmed,
	)
	tx1.SetFlight(flight1)
	tx1.SetEventID(episodeID1)
	tx1.SetPoolID(poolID1)

	tx2 := eventsuretransaction.NewTransaction(
		"tx_002",
		eventsuretransaction.TypeClaim,
		"0x2345678901bcdef2345678901bcdef23456789",
		"0xbcdef12345678901bcdef12345678901bcdef23",
		"0.0300",
		"MNT",
		now.Add(-10*time.Minute),
		12345677,
		eventsuretransaction.StatusConfirmed,
	)
	tx2.SetFlight(flight2)
	tx2.SetEventID(episodeID2)
	tx2.SetPoolID(poolID2)

	tx3 := eventsuretransaction.NewTransaction(
		"tx_003",
		eventsuretransaction.TypePayout,
		"0x3456789012cdef3456789012cdef34567890",
		"0xcdef123456789012cdef123456789012cdef34",
		"0.0500",
		"MNT",
		now.Add(-15*time.Minute),
		12345676,
		eventsuretransaction.StatusConfirmed,
	)
	tx3.SetFlight(flight3)
	tx3.SetEventID(episodeID1)
	tx3.SetPoolID(poolID1)

	tx4 := eventsuretransaction.NewTransaction(
		"tx_004",
		eventsuretransaction.TypeStake,
		"0x4567890123def4567890123def45678901",
		"0xdef1234567890123def1234567890123def45",
		"1.5000",
		"MNT",
		now.Add(-20*time.Minute),
		12345675,
		eventsuretransaction.StatusConfirmed,
	)
	tx4.SetEventID(episodeID1)
	tx4.SetPoolID(poolID1)

	return []*eventsuretransaction.Transaction{tx1, tx2, tx3, tx4}
}
