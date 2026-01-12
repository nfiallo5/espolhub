import {
  BookOpen,
  Laptop,
  Shirt,
  Dumbbell,
  Armchair,
  Wrench,
  Music,
  Bike,
  Utensils,
  Package,
  LucideIcon,
} from 'lucide-react';
import { Faculty, ConditionKey, AnnouncementStatus, CONDITIONS, CONDITION_COLORS, FACULTIES } from '@/types/enums';

// Re-export enums for convenience
export { CONDITIONS, CONDITION_COLORS, FACULTIES };
export type { ConditionKey, Faculty };

// Category to Icon Mapping
export const categoryIcons: Record<string, LucideIcon> = {
  'Libros y Apuntes': BookOpen,
  'Electrónica': Laptop,
  'Ropa y Accesorios': Shirt,
  'Deportes': Dumbbell,
  'Muebles': Armchair,
  'Servicios': Wrench,
  'Instrumentos Musicales': Music,
  'Vehículos': Bike,
  'Hogar y Cocina': Utensils,
  'Otros': Package,
};

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Más Recientes' },
  { value: 'popular', label: 'Populares' },
  { value: 'price_asc', label: 'Precio: Menor a Mayor' },
  { value: 'price_desc', label: 'Precio: Mayor a Menor' },
] as const;

export const CATEGORIES = Object.keys(categoryIcons);

// Types for mock data
export interface MockSeller {
  id: number;
  name: string;
  email: string;
  phone: string;
  faculty: Faculty;
  avatar: string;
  isVerified: boolean;
  joinedDate: string;
}

export interface MockItem {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ConditionKey;
  location: string;
  images: string[];
  sellerId: number;
  views: number;
  status: AnnouncementStatus;
  createdAt: string;
}

// Mock Sellers
export const mockSellers: MockSeller[] = [
  {
    id: 101,
    name: 'Juan Pérez',
    email: 'jperez@espol.edu.ec',
    phone: '0991234567',
    faculty: 'FIEC',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    joinedDate: '2023-03-15',
  },
  {
    id: 102,
    name: 'María Santos',
    email: 'msantos@espol.edu.ec',
    phone: '0987654321',
    faculty: 'FCNM',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    joinedDate: '2023-06-20',
  },
  {
    id: 103,
    name: 'Carlos Delgado',
    email: 'cdelgado@espol.edu.ec',
    phone: '0998765432',
    faculty: 'FIMCP',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    isVerified: false,
    joinedDate: '2024-01-10',
  },
  {
    id: 104,
    name: 'Roberto Mendoza',
    email: 'rmendoza@espol.edu.ec',
    phone: '0976543210',
    faculty: 'FCSH',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    joinedDate: '2022-11-05',
  },
];

// Mock Items
export const mockItems: MockItem[] = [
  {
    id: 1,
    title: 'Cálculo de Thomas 14va Edición',
    description:
      'Libro en excelente estado, sin subrayados ni anotaciones. Ideal para estudiantes de primer año de ingeniería. Incluye código de acceso online sin usar.',
    price: 45.0,
    category: 'Libros y Apuntes',
    condition: 'like_new',
    location: 'Campus Gustavo Galindo',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    ],
    sellerId: 101,
    views: 45,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'Laptop HP Pavilion Core i5',
    description:
      'HP Pavilion con procesador Intel Core i5 11va generación, 8GB RAM, 512GB SSD. Perfecta para programación y diseño. Batería dura 6 horas. Incluye cargador original.',
    price: 520.0,
    category: 'Electrónica',
    condition: 'good',
    location: 'FIEC',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80',
    ],
    sellerId: 102,
    views: 120,
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: 3,
    title: 'Mochila North Face Borealis',
    description:
      'Mochila original North Face Borealis en color negro. Perfecta para llevar laptop de hasta 15 pulgadas. Muy cómoda y resistente.',
    price: 75.0,
    category: 'Ropa y Accesorios',
    condition: 'like_new',
    location: 'Campus Prosperina',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    ],
    sellerId: 103,
    views: 12,
    status: 'active',
    createdAt: '2024-01-08',
  },
  {
    id: 4,
    title: 'Raqueta Wilson Pro Staff',
    description:
      'Raqueta de tenis Wilson Pro Staff 97. Usada por una temporada. Grip nuevo. Ideal para jugadores intermedios.',
    price: 95.0,
    category: 'Deportes',
    condition: 'good',
    location: 'Canchas ESPOL',
    images: [
      'https://images.unsplash.com/photo-1617137599056-2db932ba61c4?auto=format&fit=crop&w=600&q=80',
    ],
    sellerId: 101,
    views: 8,
    status: 'reserved',
    createdAt: '2024-01-05',
  },
  {
    id: 5,
    title: 'Tutorías de Cálculo I y II',
    description:
      'Ofrezco tutorías personalizadas de Cálculo I y II. Soy estudiante de matemáticas con experiencia. $10/hora. Disponible fines de semana.',
    price: 10.0,
    category: 'Servicios',
    condition: 'new_item',
    location: 'Biblioteca',
    images: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    ],
    sellerId: 104,
    views: 200,
    status: 'active',
    createdAt: '2024-01-12',
  },
  {
    id: 6,
    title: 'Guitarra Acústica Yamaha F310',
    description:
      'Guitarra acústica Yamaha F310, perfecta para principiantes. Incluye funda, capo y cuerdas de repuesto.',
    price: 150.0,
    category: 'Instrumentos Musicales',
    condition: 'good',
    location: 'FADCOM',
    images: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
    ],
    sellerId: 103,
    views: 35,
    status: 'active',
    createdAt: '2024-01-14',
  },
  {
    id: 7,
    title: 'Escritorio Plegable para Estudiante',
    description:
      'Escritorio plegable ideal para espacios pequeños. Color blanco, superficie de 80x50cm. Fácil de transportar.',
    price: 65.0,
    category: 'Muebles',
    condition: 'acceptable',
    location: 'Campus Gustavo Galindo',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
    ],
    sellerId: 102,
    views: 28,
    status: 'active',
    createdAt: '2024-01-11',
  },
  {
    id: 8,
    title: 'Bicicleta MTB Aro 26',
    description:
      'Bicicleta montañera aro 26, 21 velocidades. Marco de aluminio. Perfecta para moverse por el campus.',
    price: 180.0,
    category: 'Vehículos',
    condition: 'good',
    location: 'Parqueadero FIEC',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    ],
    sellerId: 101,
    views: 67,
    status: 'active',
    createdAt: '2024-01-09',
  },
];

// Helper functions
export const getSellerById = (id: number): MockSeller | undefined =>
  mockSellers.find((seller) => seller.id === id);

export const getItemById = (id: number): MockItem | undefined =>
  mockItems.find((item) => item.id === id);

export const getItemsBySeller = (sellerId: number): MockItem[] =>
  mockItems.filter((item) => item.sellerId === sellerId);

export const getItemsByCategory = (category: string): MockItem[] =>
  mockItems.filter((item) => item.category === category);

export const getFeaturedItems = (): MockItem[] =>
  mockItems
    .filter((item) => item.status === 'active')
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

export const getRecentItems = (): MockItem[] =>
  mockItems
    .filter((item) => item.status === 'active')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
