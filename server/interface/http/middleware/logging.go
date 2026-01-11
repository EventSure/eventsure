package middleware

import (
	"log"
	"net/http"
	"time"
)

// responseWriter is a wrapper around http.ResponseWriter that captures the status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

// LoggingMiddleware logs HTTP requests with method, path, status code, and duration
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		wrapped := &responseWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

		next.ServeHTTP(wrapped, r)

		duration := time.Since(start)
		log.Printf(
			"[%s] %s [%d] (%v)",
			r.Method,
			r.RequestURI,
			wrapped.statusCode,
			duration,
		)
	})
}
