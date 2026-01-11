package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

// Phase 1: 필수 엔드포인트

// getEvents returns list of events
func getEvents(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	category := r.URL.Query().Get("category")

	events := getMockEvents()

	// 필터링
	filtered := []Event{}
	for _, event := range events {
		if status != "" && event.Status != status {
			continue
		}
		if category != "" && event.Category != category {
			continue
		}
		filtered = append(filtered, event)
	}

	response := EventsResponse{
		Events: filtered,
		Total:  len(filtered),
		Page:   1,
		Limit:  20,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// getEventDetail returns event detail by ID
func getEventDetail(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	eventID := vars["eventId"]

	events := getMockEvents()
	var foundEvent *Event

	for i := range events {
		if events[i].ID == eventID {
			foundEvent = &events[i]
			break
		}
	}

	if foundEvent == nil {
		http.Error(w, "Event not found", http.StatusNotFound)
		return
	}

	// 상세 정보로 변환
	var oracle Oracle
	if foundEvent.Oracle != nil {
		oracle = *foundEvent.Oracle
	} else {
		oracle = Oracle{
			DataSource:    "N/A",
			ResolutionTime: "N/A",
		}
	}

	detail := EventDetail{
		Event: *foundEvent,
		Rules: &EventRules{
			CoveredEvent: CoveredEvent{
				Event:            foundEvent.Title,
				EventWindow:      foundEvent.EventWindow,
				TriggerCondition: foundEvent.TriggerCondition,
			},
			Oracle: oracle,
			FinancialTerms: FinancialTerms{
				Premium:                foundEvent.Premium,
				MaxPayout:              foundEvent.MaxPayout,
				AdditionalContributions: getStringValue(foundEvent.AdditionalContributions),
			},
			PoolLogic: getStringValue(foundEvent.PoolLogic),
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(detail)
}

// getPools returns list of pools
func getPools(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	category := r.URL.Query().Get("category")

	pools := getMockPools()

	// 필터링
	filtered := []Pool{}
	for _, pool := range pools {
		if status != "" && pool.Status != status {
			continue
		}
		if category != "" && pool.Category != category {
			continue
		}
		filtered = append(filtered, pool)
	}

	response := PoolsResponse{
		Pools: filtered,
		Total: len(filtered),
		Page:  1,
		Limit: 20,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// getHomeStats returns home page statistics
func getHomeStats(w http.ResponseWriter, r *http.Request) {
	stats := HomeStats{
		TVL:             2500000,
		TVLCurrency:     "USD",
		TotalPolicies:   15000,
		ClaimRate:       98,
		ClaimRateUnit:   "percent",
		AveragePayoutTime: 300,
		PayoutTimeUnit:  "seconds",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

// Phase 2: 중요 엔드포인트

// getTransactions returns list of transactions
func getTransactions(w http.ResponseWriter, r *http.Request) {
	txType := r.URL.Query().Get("type")
	
	limit := 20
	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 && parsed <= 100 {
			limit = parsed
		}
	}

	offset := 0
	if o := r.URL.Query().Get("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	transactions := getMockTransactions()

	// 타입 필터링
	filtered := []Transaction{}
	for _, tx := range transactions {
		if txType != "" && tx.Type != txType {
			continue
		}
		filtered = append(filtered, tx)
	}

	// 페이지네이션
	total := len(filtered)
	start := offset
	end := offset + limit
	if start > total {
		start = total
	}
	if end > total {
		end = total
	}

	var result []Transaction
	if start < end {
		result = filtered[start:end]
	} else {
		result = []Transaction{}
	}

	response := TransactionsResponse{
		Transactions: result,
		Total:        total,
		Limit:        limit,
		Offset:       offset,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// getTransactionStats returns transaction statistics
func getTransactionStats(w http.ResponseWriter, r *http.Request) {
	stats := TransactionStats{
		TotalVolume24h:       1234567,
		VolumeCurrency:       "USD",
		ActivePolicies:       15234,
		TransactionsPerSecond: 12.5,
		NetworkStats: NetworkStats{
			Network:    "Mantle Network",
			BlockNumber: 12345678,
			GasPrice:   "0.02",
			GasUnit:    "gwei",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

// getMyEvents returns user's event participations
func getMyEvents(w http.ResponseWriter, r *http.Request) {
	// 인증 확인 (간단한 구현)
	token := extractToken(r)
	if token == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	eventID := r.URL.Query().Get("eventId")

	participations := getMockUserParticipations()

	// 이벤트 ID 필터링
	filtered := []UserParticipation{}
	for _, part := range participations {
		if eventID != "" && part.EventID != eventID {
			continue
		}
		filtered = append(filtered, part)
	}

	response := UserEventsResponse{
		Participations: filtered,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// getEventDashboard returns dashboard data for a specific event
func getEventDashboard(w http.ResponseWriter, r *http.Request) {
	// 인증 확인
	token := extractToken(r)
	if token == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	eventID := vars["eventId"]

	participations := getMockUserParticipations()
	var participation *UserParticipation

	for i := range participations {
		if participations[i].EventID == eventID {
			participation = &participations[i]
			break
		}
	}

	if participation == nil {
		http.Error(w, "Participation not found", http.StatusNotFound)
		return
	}

	// 이벤트 상세 정보 가져오기
	events := getMockEvents()
	var event *Event
	for i := range events {
		if events[i].ID == eventID {
			event = &events[i]
			break
		}
	}

	if event == nil {
		http.Error(w, "Event not found", http.StatusNotFound)
		return
	}

	// EventDetail 생성
	var oracle Oracle
	if event.Oracle != nil {
		oracle = *event.Oracle
	} else {
		oracle = Oracle{
			DataSource:    "N/A",
			ResolutionTime: "N/A",
		}
	}

	detail := EventDetail{
		Event: *event,
		Rules: &EventRules{
			CoveredEvent: CoveredEvent{
				Event:            event.Title,
				EventWindow:      event.EventWindow,
				TriggerCondition: event.TriggerCondition,
			},
			Oracle: oracle,
			FinancialTerms: FinancialTerms{
				Premium:                event.Premium,
				MaxPayout:              event.MaxPayout,
				AdditionalContributions: getStringValue(event.AdditionalContributions),
			},
			PoolLogic: getStringValue(event.PoolLogic),
		},
	}

	// 카운트다운 계산
	now := time.Now()
	poolClosesIn := int64(0)
	eventEndsIn := int64(0)

	if participation.PoolClosesAt.After(now) {
		poolClosesIn = int64(participation.PoolClosesAt.Sub(now).Seconds())
	}
	if participation.EventEndsAt.After(now) {
		eventEndsIn = int64(participation.EventEndsAt.Sub(now).Seconds())
	}

	response := DashboardResponse{
		Participation: *participation,
		Event:         detail,
		CurrentData:   *participation.CurrentData,
		Countdown: Countdown{
			PoolClosesIn: poolClosesIn,
			EventEndsIn:  eventEndsIn,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Helper functions

func extractToken(r *http.Request) string {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return ""
	}
	
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return ""
	}
	
	return parts[1]
}

func getStringValue(s *string) string {
	if s == nil {
		return "none"
	}
	return *s
}
