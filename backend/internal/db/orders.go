package db

import (
	"context"
	"fmt"

	"farmers-marketplace-backend/internal/models"

	"github.com/google/uuid"
	"google.golang.org/api/iterator"
)

// PutOrder stores an order in Firestore
func PutOrder(ctx context.Context, order models.Order) (models.Order, error) {
	if order.ID == "" {
		order.ID = uuid.New().String()
	}

	_, err := client.Collection(CollectionOrders).Doc(order.ID).Set(ctx, order)
	if err != nil {
		return order, fmt.Errorf("failed to put order: %w", err)
	}

	return order, nil
}

// GetOrder retrieves a single order by ID
func GetOrder(ctx context.Context, orderID string) (*models.Order, error) {
	doc, err := client.Collection(CollectionOrders).Doc(orderID).Get(ctx)
	if err != nil {
		if isNotFound(err) {
			return nil, nil
		}
		return nil, err
	}

	var order models.Order
	if err := doc.DataTo(&order); err != nil {
		return nil, err
	}
	return &order, nil
}

// ListCustomerOrders queries orders for a specific customer
func ListCustomerOrders(ctx context.Context, customerID string) ([]models.Order, error) {
	iter := client.Collection(CollectionOrders).Where("customerId", "==", customerID).Documents(ctx)
	defer iter.Stop()

	var orders []models.Order
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var order models.Order
		if err := doc.DataTo(&order); err != nil {
			continue
		}
		orders = append(orders, order)
	}

	return orders, nil
}

// ListAllOrders retrieves all orders (admin use)
func ListAllOrders(ctx context.Context) ([]models.Order, error) {
	iter := client.Collection(CollectionOrders).Documents(ctx)
	defer iter.Stop()

	var orders []models.Order
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var order models.Order
		if err := doc.DataTo(&order); err != nil {
			continue
		}
		orders = append(orders, order)
	}

	return orders, nil
}

// UpdateOrderStatus updates the status of an order
func UpdateOrderStatus(ctx context.Context, orderID, status string) error {
	order, err := GetOrder(ctx, orderID)
	if err != nil || order == nil {
		return fmt.Errorf("order not found")
	}

	order.Status = status

	// Re-write the order
	_, err = PutOrder(ctx, *order)
	return err
}
