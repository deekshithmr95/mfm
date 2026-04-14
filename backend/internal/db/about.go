package db

import (
	"context"
	"fmt"

	"farmers-marketplace-backend/internal/models"
)

const aboutDocID = "about"

// GetAboutUs retrieves the About Us content from Firestore.
// Returns the default content if none has been saved yet.
func GetAboutUs(ctx context.Context) (models.AboutUsContent, error) {
	doc, err := client.Collection(CollectionConfig).Doc(aboutDocID).Get(ctx)
	if err != nil {
		if isNotFound(err) {
			return models.DefaultAboutUsContent(), nil
		}
		return models.DefaultAboutUsContent(), fmt.Errorf("failed to get about us: %w", err)
	}

	var content models.AboutUsContent
	if err := doc.DataTo(&content); err != nil {
		return models.DefaultAboutUsContent(), fmt.Errorf("failed to unmarshal about us: %w", err)
	}

	return content, nil
}

// PutAboutUs saves the About Us content to Firestore.
func PutAboutUs(ctx context.Context, content models.AboutUsContent) error {
	_, err := client.Collection(CollectionConfig).Doc(aboutDocID).Set(ctx, content)
	if err != nil {
		return fmt.Errorf("failed to put about us: %w", err)
	}
	return nil
}
