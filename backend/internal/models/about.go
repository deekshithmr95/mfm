package models

// AboutValue represents a single company value displayed on the About Us page
type AboutValue struct {
	Icon        string `json:"icon" dynamodbav:"icon"`
	Title       string `json:"title" dynamodbav:"title"`
	Description string `json:"description" dynamodbav:"description"`
}

// TeamMember represents a team member displayed on the About Us page
type TeamMember struct {
	Name string `json:"name" dynamodbav:"name"`
	Role string `json:"role" dynamodbav:"role"`
	Bio  string `json:"bio" dynamodbav:"bio"`
}

// AboutUsContent is the admin-customizable content for the About Us page
type AboutUsContent struct {
	HeroTitle    string       `json:"heroTitle" dynamodbav:"heroTitle"`
	HeroSubtitle string       `json:"heroSubtitle" dynamodbav:"heroSubtitle"`
	Mission      string       `json:"mission" dynamodbav:"mission"`
	Story        string       `json:"story" dynamodbav:"story"`
	Values       []AboutValue `json:"values" dynamodbav:"values"`
	TeamMembers  []TeamMember `json:"teamMembers" dynamodbav:"teamMembers"`
}

// DefaultAboutUsContent returns the default content for a fresh deployment
func DefaultAboutUsContent() AboutUsContent {
	return AboutUsContent{
		HeroTitle:    "Bringing Mysore's Farms to Your Table",
		HeroSubtitle: "We connect local farmers directly with conscious consumers, eliminating middlemen and ensuring fair prices for everyone.",
		Mission:      "Our mission is to build a sustainable food ecosystem where farmers earn what they deserve and consumers get the freshest, chemical-free produce — straight from the farms of Mysore.",
		Story:        "Mysore Farmer Market was born in 2024 from a simple observation: the freshest produce in the region was traveling through 4-5 middlemen before reaching your kitchen, losing freshness and increasing cost at every step. We built this platform to change that. Today, we work with over 50 local farmers across Mysore, Nanjangud, T. Narasipura, and H.D. Kote — delivering farm-fresh produce to your doorstep within hours of harvest.",
		Values: []AboutValue{
			{Icon: "🌱", Title: "Farm Fresh Promise", Description: "Every product is harvested within 24 hours of delivery. We never sell stored or old produce."},
			{Icon: "🤝", Title: "Fair Trade", Description: "Farmers receive 80% of what you pay — no middlemen, no exploitation. Transparent pricing always."},
			{Icon: "🌍", Title: "Sustainability First", Description: "We use biodegradable packaging and optimize delivery routes to minimize our carbon footprint."},
			{Icon: "✅", Title: "Quality Verified", Description: "Every farmer is personally vetted. Every product is tested for quality and organic compliance."},
		},
		TeamMembers: []TeamMember{
			{Name: "Rajesh Kumar", Role: "Founder & CEO", Bio: "Former agricultural engineer with 15 years of experience in sustainable farming practices."},
			{Name: "Priya Nair", Role: "Head of Operations", Bio: "Supply chain expert who ensures your produce reaches you at peak freshness."},
			{Name: "Deepak Gowda", Role: "Farmer Relations", Bio: "Third-generation farmer who bridges the gap between technology and traditional farming."},
		},
	}
}
