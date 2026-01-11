package repository

import (
	"errors"
	"sync"
	eventsureevent "eventsure-server/domain/event"
)

// EventRepository is the in-memory implementation of Event repository
type EventRepository struct {
	events map[string]*eventsureevent.Event
	mu     sync.RWMutex
}

// NewEventRepository creates a new EventRepository
func NewEventRepository() *EventRepository {
	return &EventRepository{
		events: make(map[string]*eventsureevent.Event),
	}
}

// FindByID finds an event by ID
func (r *EventRepository) FindByID(id string) (*eventsureevent.Event, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	event, exists := r.events[id]
	if !exists {
		return nil, nil
	}
	return event, nil
}

// FindAll finds all events
func (r *EventRepository) FindAll() ([]*eventsureevent.Event, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	events := make([]*eventsureevent.Event, 0, len(r.events))
	for _, event := range r.events {
		events = append(events, event)
	}
	return events, nil
}

// FindByStatus finds events by status
func (r *EventRepository) FindByStatus(status eventsureevent.Status) ([]*eventsureevent.Event, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var events []*eventsureevent.Event
	for _, event := range r.events {
		if event.Status() == status {
			events = append(events, event)
		}
	}
	return events, nil
}

// FindByCategory finds events by category
func (r *EventRepository) FindByCategory(category eventsureevent.Category) ([]*eventsureevent.Event, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var events []*eventsureevent.Event
	for _, event := range r.events {
		if event.Category() == category {
			events = append(events, event)
		}
	}
	return events, nil
}

// FindByStatusAndCategory finds events by status and category
func (r *EventRepository) FindByStatusAndCategory(status eventsureevent.Status, category eventsureevent.Category) ([]*eventsureevent.Event, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var events []*eventsureevent.Event
	for _, event := range r.events {
		if event.Status() == status && event.Category() == category {
			events = append(events, event)
		}
	}
	return events, nil
}

// Save saves an event
func (r *EventRepository) Save(event *eventsureevent.Event) error {
	if event == nil {
		return errors.New("event cannot be nil")
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	r.events[event.ID()] = event
	return nil
}

// InitializeMockData initializes repository with mock data
func (r *EventRepository) InitializeMockData(events []*eventsureevent.Event) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for _, event := range events {
		r.events[event.ID()] = event
	}
}
