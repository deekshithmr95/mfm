package models

import "time"

// OrderAddress contains structured delivery address fields
type OrderAddress struct {
	FullName     string `json:"fullName" firestore:"fullName"`
	Phone        string `json:"phone" firestore:"phone"`
	AddressLine1 string `json:"addressLine1" firestore:"addressLine1"`
	AddressLine2 string `json:"addressLine2,omitempty" firestore:"addressLine2,omitempty"`
	City         string `json:"city" firestore:"city"`
	State        string `json:"state" firestore:"state"`
	Pincode      string `json:"pincode" firestore:"pincode"`
}

// OrderItem represents a single item in an order
type OrderItem struct {
	ProductID string  `json:"productId" firestore:"productId"`
	Name      string  `json:"name" firestore:"name"`
	Image     string  `json:"image,omitempty" firestore:"image,omitempty"`
	Farmer    string  `json:"farmer,omitempty" firestore:"farmer,omitempty"`
	Quantity  int     `json:"quantity" firestore:"quantity"`
	Price     float64 `json:"price" firestore:"price"`
	Unit      string  `json:"unit,omitempty" firestore:"unit,omitempty"`
}

// Order represents a customer order
type Order struct {
	ID                string       `json:"id" firestore:"id"`
	CustomerID        string       `json:"customerId" firestore:"customerId"`
	CustomerName      string       `json:"customer" firestore:"customerName"`
	Items             []OrderItem  `json:"items" firestore:"items"`
	Address           OrderAddress `json:"address" firestore:"address"`
	PaymentMethod     string       `json:"paymentMethod" firestore:"paymentMethod"`     // upi | cod
	Subtotal          float64      `json:"subtotal" firestore:"subtotal"`
	DeliveryFee       float64      `json:"deliveryFee" firestore:"deliveryFee"`
	Total             float64      `json:"total" firestore:"total"`
	Status            string       `json:"status" firestore:"status"`
	EstimatedDelivery string       `json:"estimatedDelivery" firestore:"estimatedDelivery"`
	CreatedAt         string       `json:"createdAt" firestore:"createdAt"`
}

// Valid order statuses in lifecycle order
var ValidOrderStatuses = map[string]bool{
	"confirmed":        true,
	"processing":       true,
	"shipped":          true,
	"out_for_delivery": true,
	"delivered":        true,
}

// CreateOrderInput is the payload for placing a new order
type CreateOrderInput struct {
	Items         []OrderItem  `json:"items"`
	Address       OrderAddress `json:"address"`
	PaymentMethod string       `json:"paymentMethod"`
	Subtotal      float64      `json:"subtotal"`
}

// NewOrder creates a new Order from the checkout input
func NewOrder(input CreateOrderInput, customerID, customerName string) Order {
	deliveryFee := 40.0
	if input.Subtotal >= 500 {
		deliveryFee = 0
	}

	estimatedDelivery := time.Now().Add(24 * time.Hour).Format("Monday, 2 Jan")

	return Order{
		ID:                "",
		CustomerID:        customerID,
		CustomerName:      customerName,
		Items:             input.Items,
		Address:           input.Address,
		PaymentMethod:     input.PaymentMethod,
		Subtotal:          input.Subtotal,
		DeliveryFee:       deliveryFee,
		Total:             input.Subtotal + deliveryFee,
		Status:            "confirmed",
		EstimatedDelivery: estimatedDelivery,
		CreatedAt:         time.Now().UTC().Format(time.RFC3339),
	}
}
