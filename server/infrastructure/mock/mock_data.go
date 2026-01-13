package mock

import (
	"time"
	eventsureepisode "eventsure-server/domain/episode"
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
