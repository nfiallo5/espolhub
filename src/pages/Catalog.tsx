import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getAnnouncements } from '@/api/announcements';
import { getCategories } from '@/api/categories';
import { ConditionKey, CONDITIONS } from '@/types/enums';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get('category') ? Number(searchParams.get('category')) : null
  );
  const [selectedCondition, setSelectedCondition] = useState<ConditionKey | null>(
    searchParams.get('condition') as ConditionKey | null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('min_price')) || 0,
    Number(searchParams.get('max_price')) || 100000,
  ]);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Build query params for API
  const queryParams = {
    q: searchQuery || undefined,
    category_id: selectedCategory || undefined,
    condition: selectedCondition || undefined,
    min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
    max_price: priceRange[1] < 100000 ? priceRange[1] : undefined,
    per_page: 20,
  };

  // Fetch announcements with filters
  const {
    data: announcementsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['announcements', 'catalog', queryParams],
    queryFn: () => getAnnouncements(queryParams),
  });

  const categories = categoriesData || [];
  const announcements = announcementsData?.data || [];

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory.toString());
    if (selectedCondition) params.set('condition', selectedCondition);
    if (priceRange[0] > 0) params.set('min_price', priceRange[0].toString());
    if (priceRange[1] < 100000) params.set('max_price', priceRange[1].toString());
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedCondition, priceRange, setSearchParams]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-0 rounded-xl h-12"
              />
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-xl"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              Todos
            </button>
            {categories.map((category) => {
              if (!category?.attributes) return null;
              const categoryId = Number(category.id) || category.attributes.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(categoryId || null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === categoryId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                >
                  {category.attributes.icon} {category.attributes.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-border/50 overflow-hidden"
          >
            <div className="container py-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filtros</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Estado</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCondition(null)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedCondition === null
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    }`}
                  >
                    Todos
                  </button>
                  {(Object.entries(CONDITIONS) as [ConditionKey, string][]).map(
                    ([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedCondition(key)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          selectedCondition === key
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-muted'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Rango de precio: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="flex gap-4">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="bg-secondary border-0"
                  />
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="bg-secondary border-0"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <main className="container py-6">
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-4">
            {announcementsData?.meta?.total_count || announcements.length} productos
            encontrados
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-destructive">Error al cargar productos</p>
            </div>
          ) : announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <ProductCard key={announcement.id} announcement={announcement} index={index} />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground">No se encontraron productos</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Catalog;
