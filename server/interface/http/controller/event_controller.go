package controller

import (
	"encoding/json"
	"net/http"

	eventusecase "eventsure-server/application/event"
	"github.com/gorilla/mux"
)

// EventController handles HTTP requests for events
type EventController struct {
	eventUseCase *eventusecase.UseCase
}

// NewEventController creates a new EventController
func NewEventController(eventUseCase *eventusecase.UseCase) *EventController {
	return &EventController{
		eventUseCase: eventUseCase,
	}
}

// GetEvents handles GET /api/events
func (c *EventController) GetEvents(w http.ResponseWriter, r *http.Request) {
	var status *string
	var category *string

	if s := r.URL.Query().Get("status"); s != "" {
		status = &s
	}
	if cat := r.URL.Query().Get("category"); cat != "" {
		category = &cat
	}

	query := eventusecase.GetEventsQuery{
		Status:   status,
		Category: category,
	}

	response, err := c.eventUseCase.GetEvents(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetEventDetail handles GET /api/events/{eventId}
func (c *EventController) GetEventDetail(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	eventID := vars["eventId"]

	response, err := c.eventUseCase.GetEventDetail(eventID)
	if err != nil {
		if err.Error() == "event not found" {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
