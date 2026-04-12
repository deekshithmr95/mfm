package models

import "time"

type User struct {
	ID        string `json:"id" dynamodbav:"id"`
	Name      string `json:"name" dynamodbav:"name"`
	Email     string `json:"email" dynamodbav:"email"`
	Phone     string `json:"phone" dynamodbav:"phone"`
	Role      string `json:"role" dynamodbav:"role"` // farmer | consumer | admin
	Farm      string `json:"farm,omitempty" dynamodbav:"farm,omitempty"`
	Location  string `json:"location,omitempty" dynamodbav:"location,omitempty"`
	Status    string `json:"status" dynamodbav:"status"` // active | suspended | pending_onboard
	CreatedAt string `json:"createdAt" dynamodbav:"createdAt"`
	Notes     string `json:"notes,omitempty" dynamodbav:"notes,omitempty"` // Admin support notes
}

func NewUser(id, name, email, role string) User {
	return User{
		ID:        id,
		Name:      name,
		Email:     email,
		Role:      role,
		Status:    "active",
		CreatedAt: time.Now().UTC().Format(time.RFC3339),
	}
}
