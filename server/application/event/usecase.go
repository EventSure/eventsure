package event

import (
	"errors"
	eventsureevent "eventsure-server/domain/event"
)

// UseCase handles event use cases
type UseCase struct {
	eventRepo eventsureevent.Repository
}

// NewUseCase creates a new EventUseCase
func NewUseCase(eventRepo eventsureevent.Repository) *UseCase {
	return &UseCase{
		eventRepo: eventRepo,
	}
}

// GetEventsQuery represents query for getting events
type GetEventsQuery struct {
	Status   *string
	Category *string
}

// GetEvents handles getting events list
func (uc *UseCase) GetEvents(query GetEventsQuery) (*EventsResponseDTO, error) {
	var events []*eventsureevent.Event
	var err error

	if query.Status != nil && query.Category != nil {
		status := eventsureevent.Status(*query.Status)
		category := eventsureevent.Category(*query.Category)
		events, err = uc.eventRepo.FindByStatusAndCategory(status, category)
	} else if query.Status != nil {
		status := eventsureevent.Status(*query.Status)
		events, err = uc.eventRepo.FindByStatus(status)
	} else if query.Category != nil {
		category := eventsureevent.Category(*query.Category)
		events, err = uc.eventRepo.FindByCategory(category)
	} else {
		events, err = uc.eventRepo.FindAll()
	}

	if err != nil {
		return nil, err
	}

	eventDTOs := make([]EventDTO, len(events))
	for i, event := range events {
		eventDTOs[i] = ToDTO(event)
	}

	return &EventsResponseDTO{
		Events: eventDTOs,
		Total:  len(eventDTOs),
		Page:   1,
		Limit:  20,
	}, nil
}

// GetEventDetail handles getting event detail by ID
func (uc *UseCase) GetEventDetail(eventID string) (*EventDetailDTO, error) {
	event, err := uc.eventRepo.FindByID(eventID)
	if err != nil {
		return nil, err
	}

	if event == nil {
		return nil, errors.New("event not found")
	}

	detailDTO := ToDetailDTO(event)
	return &detailDTO, nil
}
