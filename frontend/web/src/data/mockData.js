export const mockUser = {
  id: 1,
  name: 'Adam Klimov',
  email: 'adam@example.com',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
}

export const mockCategories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'books', name: 'Books' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home' },
  { id: 'sports', name: 'Sports' },
]

export const mockProducts = [
  {
    id: 1,
    category: 'electronics',
    title: 'Wireless Headphones',
    description: 'Comfortable headphones with deep bass and long battery life.',
    price: 89,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    category: 'electronics',
    title: 'Mechanical Keyboard',
    description: 'Compact keyboard for work and gaming with tactile switches.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    category: 'books',
    title: 'Clean Architecture',
    description: 'A practical book about software architecture and design.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    category: 'fashion',
    title: 'Minimal Hoodie',
    description: 'Soft fabric hoodie for everyday use.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    category: 'home',
    title: 'Desk Lamp',
    description: 'Modern lamp with adjustable brightness.',
    price: 35,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    category: 'sports',
    title: 'Training Shoes',
    description: 'Lightweight shoes for running and gym workouts.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
]

export const mockCartItems = [
  { productId: 1, quantity: 1 },
  { productId: 3, quantity: 2 },
  { productId: 5, quantity: 1 },
]

export const mockFavoriteIds = [2, 4, 6]
