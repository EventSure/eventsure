package main

import (
	"time"
)

func getMockEvents() []Event {
	now := time.Now()
	
	poolClosesAt1 := time.Date(2025, 1, 15, 12, 0, 0, 0, time.UTC)
	eventEndsAt1 := time.Date(2025, 1, 15, 18, 0, 0, 0, time.UTC)
	
	poolClosesAt2 := time.Date(2025, 8, 31, 12, 0, 0, 0, time.UTC)
	eventEndsAt2 := time.Date(2025, 9, 1, 0, 0, 0, 0, time.UTC)

	oracle1 := Oracle{
		DataSource:    "FlightStats API",
		ResolutionTime: "이벤트 종료 후 24시간",
	}

	poolLogic := "Homogeneous risk pool. Surplus returned pro-rata to members."
	additionalContributions := "none"
	subtitle1 := "인천-나리타 구간 출발편"
	subtitle2 := "제주도 태풍 관련 항공편"

	return []Event{
		{
			ID:                      "ke902",
			Category:                "flightDelay",
			Status:                  "recruiting",
			Title:                   "KE902 항공편 지연 보험",
			Subtitle:                &subtitle1,
			EventWindow:             "2025.01.15 14:00 - 2025.01.15 18:00",
			TriggerCondition:        "출발 지연 2시간 이상",
			Premium:                 25,
			PremiumCurrency:         "USDC",
			MaxPayout:               300,
			PayoutCurrency:          "USDC",
			AdditionalContributions: &additionalContributions,
			PoolLogic:               &poolLogic,
			Oracle:                  &oracle1,
			PoolClosesAt:            &poolClosesAt1,
			EventEndsAt:             &eventEndsAt1,
			Icon:                    "plane",
			CreatedAt:               time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC),
			UpdatedAt:               now,
		},
		{
			ID:                      "jejuTyphoon",
			Category:                "weather",
			Status:                  "recruiting",
			Title:                   "제주도 태풍 취소 보험",
			Subtitle:                &subtitle2,
			EventWindow:             "2025.08.01 - 2025.08.31",
			TriggerCondition:        "태풍 경보로 인한 결항 시 자동 지급",
			Premium:                 50,
			PremiumCurrency:         "USDC",
			MaxPayout:               500,
			PayoutCurrency:          "USDC",
			AdditionalContributions: &additionalContributions,
			PoolLogic:               &poolLogic,
			Oracle: &Oracle{
				DataSource:    "기상청 API",
				ResolutionTime: "이벤트 종료 후 48시간",
			},
			PoolClosesAt: &poolClosesAt2,
			EventEndsAt:  &eventEndsAt2,
			Icon:         "cloud",
			CreatedAt:    time.Date(2025, 7, 1, 0, 0, 0, 0, time.UTC),
			UpdatedAt:    now,
		},
	}
}

func getMockPools() []Pool {
	now := time.Now()

	return []Pool{
		{
			ID:                "1",
			EventID:           "ke902",
			Category:          "flightDelay",
			Status:            "recruiting",
			Title:             "인천-도쿄 항공편 지연 보험",
			Description:       "2025년 1월 15일 인천-나리타 구간 출발편 2시간 이상 지연 시 보상",
			CoverageCondition: "출발 지연 2시간 이상 시 자동 지급",
			Premium:           15000,
			PremiumCurrency:   "KRW",
			MaxPayout:         300000,
			PayoutCurrency:    "KRW",
			Members:           127,
			PoolSize:          1905000,
			PoolTarget:        3000000,
			EndDate:           time.Date(2025, 1, 15, 0, 0, 0, 0, time.UTC),
			Icon:              "plane",
			CreatedAt:         time.Date(2024, 12, 1, 0, 0, 0, 0, time.UTC),
			UpdatedAt:         now,
		},
		{
			ID:                "2",
			EventID:           "jejuTyphoon",
			Category:          "weather",
			Status:            "recruiting",
			Title:             "제주도 태풍 취소 보험",
			Description:       "2025년 8월 여름 시즌 제주 여행 태풍으로 인한 항공편 결항 보상",
			CoverageCondition: "태풍 경보로 인한 결항 시 자동 지급",
			Premium:           25000,
			PremiumCurrency:   "KRW",
			MaxPayout:         500000,
			PayoutCurrency:    "KRW",
			Members:           89,
			PoolSize:          2225000,
			PoolTarget:        5000000,
			EndDate:           time.Date(2025, 8, 31, 0, 0, 0, 0, time.UTC),
			Icon:              "cloud",
			CreatedAt:         time.Date(2025, 7, 1, 0, 0, 0, 0, time.UTC),
			UpdatedAt:         now,
		},
		{
			ID:                "3",
			EventID:           "gimpoJeju",
			Category:          "flightDelay",
			Status:            "active",
			Title:             "김포-제주 항공편 지연 보험",
			Description:       "2025년 1월 국내선 김포-제주 구간 2시간 이상 지연 시 보상",
			CoverageCondition: "출발 지연 2시간 이상 시 자동 지급",
			Premium:           10000,
			PremiumCurrency:   "KRW",
			MaxPayout:         200000,
			PayoutCurrency:    "KRW",
			Members:           256,
			PoolSize:          2560000,
			PoolTarget:        3000000,
			EndDate:           time.Date(2025, 1, 31, 0, 0, 0, 0, time.UTC),
			Icon:              "plane",
			CreatedAt:         time.Date(2024, 12, 15, 0, 0, 0, 0, time.UTC),
			UpdatedAt:         now,
		},
		{
			ID:                "4",
			EventID:           "tokyoCherry",
			Category:          "tripCancel",
			Status:            "settling",
			Title:             "도쿄 벚꽃 시즌 여행 보험",
			Description:       "2024년 4월 도쿄 벚꽃 시즌 여행 취소 보상 정산 진행중",
			CoverageCondition: "항공편 결항 또는 숙소 취소 시 자동 지급",
			Premium:           20000,
			PremiumCurrency:   "KRW",
			MaxPayout:         400000,
			PayoutCurrency:    "KRW",
			Members:           312,
			PoolSize:          6240000,
			PoolTarget:        6240000,
			EndDate:           time.Date(2024, 4, 15, 0, 0, 0, 0, time.UTC),
			Icon:              "suitcase",
			CreatedAt:         time.Date(2024, 3, 1, 0, 0, 0, 0, time.UTC),
			UpdatedAt:         now,
		},
	}
}

func getMockTransactions() []Transaction {
	now := time.Now()
	flight1 := "KE123"
	flight2 := "BA321"
	flight3 := "EK111"
	eventID1 := "ke902"
	eventID2 := "jejuTyphoon"
	poolID1 := "1"
	poolID2 := "2"

	return []Transaction{
		{
			ID:          "tx_001",
			Type:        "purchase",
			Hash:        "0x1234567890abcdef1234567890abcdef12345678",
			Address:     "0xabcdef1234567890abcdef1234567890abcdef12",
			Amount:      "0.0125",
			Currency:    "MNT",
			Flight:      &flight1,
			EventID:     &eventID1,
			PoolID:      &poolID1,
			Timestamp:   now.Add(-5 * time.Minute),
			BlockNumber: 12345678,
			Status:      "confirmed",
		},
		{
			ID:          "tx_002",
			Type:        "claim",
			Hash:        "0x2345678901bcdef2345678901bcdef23456789",
			Address:     "0xbcdef12345678901bcdef12345678901bcdef23",
			Amount:      "0.0300",
			Currency:    "MNT",
			Flight:      &flight2,
			EventID:     &eventID2,
			PoolID:      &poolID2,
			Timestamp:   now.Add(-10 * time.Minute),
			BlockNumber: 12345677,
			Status:      "confirmed",
		},
		{
			ID:          "tx_003",
			Type:        "payout",
			Hash:        "0x3456789012cdef3456789012cdef34567890",
			Address:     "0xcdef123456789012cdef123456789012cdef34",
			Amount:      "0.0500",
			Currency:    "MNT",
			Flight:      &flight3,
			EventID:     &eventID1,
			PoolID:      &poolID1,
			Timestamp:   now.Add(-15 * time.Minute),
			BlockNumber: 12345676,
			Status:      "confirmed",
		},
		{
			ID:          "tx_004",
			Type:        "stake",
			Hash:        "0x4567890123def4567890123def45678901",
			Address:     "0xdef1234567890123def1234567890123def45",
			Amount:      "1.5000",
			Currency:    "MNT",
			EventID:     &eventID1,
			PoolID:      &poolID1,
			Timestamp:   now.Add(-20 * time.Minute),
			BlockNumber: 12345675,
			Status:      "confirmed",
		},
	}
}

func getMockUserParticipations() []UserParticipation {
	now := time.Now()
	
	poolClosesAt := time.Date(2025, 1, 15, 12, 0, 0, 0, time.UTC)
	eventEndsAt := time.Date(2025, 1, 15, 18, 0, 0, 0, time.UTC)
	joinedAt := time.Date(2025, 1, 10, 10, 0, 0, 0, time.UTC)

	flightStatus := "enRoute"
	currentDelay := "1h 30m"
	progressToTrigger := 50
	triggerThreshold := "2h"
	lastUpdated := now.Add(-5 * time.Minute)

	subtitle := "인천-나리타 구간 출발편"

	currentData := CurrentData{
		FlightStatus:      &flightStatus,
		CurrentDelay:      &currentDelay,
		ProgressToTrigger: &progressToTrigger,
		TriggerThreshold:  &triggerThreshold,
		IsLive:            true,
		LastUpdated:       &lastUpdated,
	}

	return []UserParticipation{
		{
			EventID:         "ke902",
			PoolID:          "1",
			Status:          "inForce",
			Premium:         25,
			PremiumCurrency: "USDC",
			MaxPayout:       300,
			PayoutCurrency:  "USDC",
			MaxLoss:         25,
			JoinedAt:        joinedAt,
			PoolClosesAt:    poolClosesAt,
			EventEndsAt:     eventEndsAt,
			Event: EventSummary{
				ID:               "ke902",
				Title:            "KE902 항공편 지연 보험",
				Subtitle:         &subtitle,
				TriggerCondition: "출발 지연 2시간 이상",
			},
			CurrentData: &currentData,
		},
	}
}
