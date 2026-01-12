import { useEffect, useState } from 'react';
import { Search, Bell, MapPin, TrendingUp, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getPopularAnnouncements, getRecentAnnouncements } from '@/api/announcements';
import { getCategories } from '@/api/categories';
import { Announcement, Category } from '@/types/models';

const Index = () => {
  const navigate = useNavigate();

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Fetch popular announcements
  const { data: popularData, isLoading: popularLoading } = useQuery({
    queryKey: ['announcements', 'popular'],
    queryFn: () => getPopularAnnouncements({ per_page: 4 }),
  });

  // Fetch recent announcements
  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['announcements', 'recent'],
    queryFn: () => getRecentAnnouncements({ per_page: 4 }),
  });

  const categories = categoriesData || [];
  const popularAnnouncements = popularData?.data || [];
  const recentAnnouncements = recentData?.data || [];

  // Category emoji mapping based on name
  const getCategoryEmoji = (name: string): string => {
    const emojiMap: Record<string, string> = {
      'Electrónica': '📱',
      'Libros': '📚',
      'Libros y Apuntes': '📚',
      'Ropa': '👕',
      'Ropa y Accesorios': '👕',
      'Deportes': '⚽',
      'Hogar': '🏠',
      'Hogar y Cocina': '🏠',
      'Música': '🎸',
      'Instrumentos Musicales': '🎸',
      'Moda': '👕',
      'Vehículos': '🚗',
      'Servicios': '🛠️',
      'Muebles': '🪑',
    };
    return emojiMap[name] || '📦';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-primary">Espol</span>Hub
              </h1>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-sm">Campus Espol</span>
              </div>
            </div>
            <button className="relative w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-card">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full" />
            </button>
          </div>

          {/* Search Bar */}
          <Link to="/catalog">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="¿Qué estás buscando?"
                readOnly
                className="pl-12 bg-secondary border-0 rounded-2xl h-12 cursor-pointer"
              />
            </div>
          </Link>
        </div>
      </header>

      <main className="container py-6">
        {/* Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">Categorías</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categoriesLoading ? (
              // Loading skeleton for categories
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-2 min-w-[80px]">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                  <Skeleton className="w-12 h-3" />
                </div>
              ))
            ) : (
              categories.map((category, index) => {
                if (!category?.attributes) return null;
                const categoryId = Number(category.id) || category.attributes.id;
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/catalog?category=${categoryId}`)}
                    className="flex flex-col items-center gap-2 min-w-[80px]"
                  >
                    <div className="w-16 h-16 bg-peach rounded-2xl flex items-center justify-center">
                      <span className="text-2xl">
                        {category.attributes.icon || getCategoryEmoji(category.attributes.name)}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-center line-clamp-1">
                      {category.attributes.name}
                    </span>
                  </motion.button>
                );
              })
            )}
          </div>
        </motion.section>

        {/* Featured/Popular Products */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Destacados</h2>
            </div>
            <Link
              to="/catalog?sort=popular"
              className="text-sm text-primary font-medium hover:underline"
            >
              Ver todo
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {popularLoading ? (
              // Loading skeleton for products
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-card rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : (
              popularAnnouncements.map((announcement, index) => (
                <ProductCard
                  key={announcement.id}
                  announcement={announcement}
                  index={index}
                />
              ))
            )}
          </div>
        </motion.section>

        {/* Recent Products */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal" />
              <h2 className="text-lg font-semibold">Recientes</h2>
            </div>
            <Link
              to="/catalog?sort=recent"
              className="text-sm text-primary font-medium hover:underline"
            >
              Ver todo
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recentLoading ? (
              // Loading skeleton for products
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-card rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : (
              recentAnnouncements.map((announcement, index) => (
                <ProductCard
                  key={announcement.id}
                  announcement={announcement}
                  index={index}
                />
              ))
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Index;
