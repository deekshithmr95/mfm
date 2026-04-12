package handlers

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestExtractPathParam(t *testing.T) {
	tests := []struct {
		name     string
		path     string
		prefix   string
		expected string
	}{
		{
			name:     "standard path",
			path:     "/api/products/123-abc",
			prefix:   "/api/products/",
			expected: "123-abc",
		},
		{
			name:     "path with trailing slash",
			path:     "/api/products/123/",
			prefix:   "/api/products/",
			expected: "123",
		},
		{
			name:     "path with sub routes",
			path:     "/api/products/123/reviews/456",
			prefix:   "/api/products/",
			expected: "123",
		},
		{
			name:     "no match",
			path:     "/api/other/123/",
			prefix:   "/api/products/",
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := extractPathParam(tt.path, tt.prefix)
			assert.Equal(t, tt.expected, result)
		})
	}
}
