package models

import "time"

type User struct {
	ID        string `json:"id" firestore:"id"`
	Name      string `json:"name" firestore:"name"`
	Email     string `json:"email" firestore:"email"`
	Phone     string `json:"phone" firestore:"phone"`
	Role      string `json:"role" firestore:"role"` // farmer | consumer | admin
	Farm      string `json:"farm,omitempty" firestore:"farm,omitempty"`
	Location  string `json:"location,omitempty" firestore:"location,omitempty"`
	Status    string `json:"status" firestore:"status"` // active | suspended | pending_onboard
	CreatedAt string `json:"createdAt" firestore:"createdAt"`
	Notes     string `json:"notes,omitempty" firestore:"notes,omitempty"` // Admin support notes
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
