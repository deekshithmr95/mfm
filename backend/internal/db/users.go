package db

import (
	"context"
	"fmt"

	"github.com/deekshithmr95/mfm/backend/internal/models"

	"google.golang.org/api/iterator"
)

// PutUser stores a user in Firestore
func PutUser(ctx context.Context, user models.User) error {
	_, err := client.Collection(CollectionUsers).Doc(user.ID).Set(ctx, user)
	if err != nil {
		return fmt.Errorf("failed to put user: %w", err)
	}
	return nil
}

// GetUser retrieves a user by ID
func GetUser(ctx context.Context, userID string) (*models.User, error) {
	doc, err := client.Collection(CollectionUsers).Doc(userID).Get(ctx)
	if err != nil {
		if isNotFound(err) {
			return nil, nil
		}
		return nil, err
	}

	var user models.User
	if err := doc.DataTo(&user); err != nil {
		return nil, err
	}
	return &user, nil
}

// ListUsersByRole queries all users with a specific role
func ListUsersByRole(ctx context.Context, role string) ([]models.User, error) {
	iter := client.Collection(CollectionUsers).Where("role", "==", role).Documents(ctx)
	defer iter.Stop()

	var users []models.User
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var user models.User
		if err := doc.DataTo(&user); err != nil {
			continue
		}
		users = append(users, user)
	}

	return users, nil
}

// ListAllUsers retrieves all users (admin only)
func ListAllUsers(ctx context.Context) ([]models.User, error) {
	iter := client.Collection(CollectionUsers).Documents(ctx)
	defer iter.Stop()

	var users []models.User
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var user models.User
		if err := doc.DataTo(&user); err != nil {
			continue
		}
		users = append(users, user)
	}

	return users, nil
}

// UpdateUserStatus updates the status and optionally notes for a user
func UpdateUserStatus(ctx context.Context, userID, status, notes string) error {
	user, err := GetUser(ctx, userID)
	if err != nil || user == nil {
		return fmt.Errorf("user not found")
	}

	user.Status = status
	if notes != "" {
		user.Notes = notes
	}

	return PutUser(ctx, *user)
}

// UpdateUserNotes updates admin support notes for a user
func UpdateUserNotes(ctx context.Context, userID, notes string) error {
	user, err := GetUser(ctx, userID)
	if err != nil || user == nil {
		return fmt.Errorf("user not found")
	}

	user.Notes = notes
	return PutUser(ctx, *user)
}
