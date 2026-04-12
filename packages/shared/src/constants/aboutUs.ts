export interface AboutUsContent {
  heroTitle: string;
  heroSubtitle: string;
  mission: string;
  story: string;
  values: { icon: string; title: string; description: string }[];
  teamMembers: { name: string; role: string; bio: string }[];
}

export const DEFAULT_ABOUT_CONTENT: AboutUsContent = {
  heroTitle: 'Bringing Mysore\'s Farms to Your Table',
  heroSubtitle: 'We connect local farmers directly with conscious consumers, eliminating middlemen and ensuring fair prices for everyone.',
  mission: 'Our mission is to build a sustainable food ecosystem where farmers earn what they deserve and consumers get the freshest, chemical-free produce — straight from the farms of Mysore.',
  story: 'Mysore Farmer Market was born in 2024 from a simple observation: the freshest produce in the region was traveling through 4-5 middlemen before reaching your kitchen, losing freshness and increasing cost at every step. We built this platform to change that. Today, we work with over 50 local farmers across Mysore, Nanjangud, T. Narasipura, and H.D. Kote — delivering farm-fresh produce to your doorstep within hours of harvest.',
  values: [
    { icon: '🌱', title: 'Farm Fresh Promise', description: 'Every product is harvested within 24 hours of delivery. We never sell stored or old produce.' },
    { icon: '🤝', title: 'Fair Trade', description: 'Farmers receive 80% of what you pay — no middlemen, no exploitation. Transparent pricing always.' },
    { icon: '🌍', title: 'Sustainability First', description: 'We use biodegradable packaging and optimize delivery routes to minimize our carbon footprint.' },
    { icon: '✅', title: 'Quality Verified', description: 'Every farmer is personally vetted. Every product is tested for quality and organic compliance.' },
  ],
  teamMembers: [
    { name: 'Rajesh Kumar', role: 'Founder & CEO', bio: 'Former agricultural engineer with 15 years of experience in sustainable farming practices.' },
    { name: 'Priya Nair', role: 'Head of Operations', bio: 'Supply chain expert who ensures your produce reaches you at peak freshness.' },
    { name: 'Deepak Gowda', role: 'Farmer Relations', bio: 'Third-generation farmer who bridges the gap between technology and traditional farming.' },
  ],
};
