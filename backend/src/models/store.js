// In-memory data store (replace with DB later)
export const store = {
  users: [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', blocked: false, email: 'admin@test.local', phone: '', preferences: {}, notifications: [] }, // legacy plain
  { id: 2, username: 'user', password: 'user123', role: 'native', blocked: false, email: 'user@test.local', phone: '', preferences: {}, notifications: [] }
  ],
  models: [
    { id: 1, name: 'Beach Paradise', description: 'Enjoy the best beaches.', price: 500, type: 'tour', image: '', details: 'Full package details here.', origin: 'Mumbai', destination: 'Goa', stops: ['Pune'], itinerary: 'Day1 Travel, Day2 Beach, Day3 Return' },
    { id: 2, name: 'Mountain Adventure', description: 'Explore the mountains.', price: 700, type: 'bus', image: '', details: 'Full package details here.', origin: 'Delhi', destination: 'Manali', stops: ['Chandigarh'], itinerary: 'Night travel, 2 days stay, return' }
  ],
  hotels: [
    // sample offline hotel records (mirrors mongo Hotel schema shape with nid -> id mapping for simplicity)
    { id: 1, name: 'Sample Hotel One', city: 'Goa', description: 'Comfortable stay near the beach.', pricePerNight: 1500, image: '', amenities: ['Wifi','Breakfast'], available: true },
    { id: 2, name: 'City Business Inn', city: 'Delhi', description: 'Business friendly hotel in city center.', pricePerNight: 2200, image: '', amenities: ['AC','Wifi'], available: true }
  ],
  bookings: [],
  contacts: [],
  rentals: [] // rental requests (bus / cab / bike)
  ,siteSettings: {
    companyName: 'VN Tour & Travels',
    phone: '+91-00000-00000',
    email: 'info@vntourtravels.test',
    address: 'Your Address Here',
    supportHours: '09:00 - 18:00'
  },
  promos: [
    { code: 'WELCOME10', type: 'percent', value: 10, active: true }
  ],
  reviews: [], // {id, modelId, userId, rating, comment, createdAt}
  analytics: { bookingCount:0, revenue:0 }
};
