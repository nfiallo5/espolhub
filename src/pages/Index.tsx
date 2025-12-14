import { Search, Bell, MapPin, TrendingUp, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockProducts, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';

const Index = () => {
  const navigate = useNavigate();
  const featuredProducts = mockProducts.slice(0, 4);
  const recentProducts = mockProducts.slice(4);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-primary">Market</span>Hub
              </h1>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-sm">Ciudad de México</span>
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
            {categories.slice(1).map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate('/catalog')}
                className="flex flex-col items-center gap-2 min-w-[80px]"
              >
                <div className="w-16 h-16 bg-peach rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">
                    {['📱', '⚽', '🏠', '🎸', '👕', '🚗', '🛠️'][index] || '📦'}
                  </span>
                </div>
                <span className="text-xs font-medium text-center">{category}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Featured Products */}
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
              to="/catalog"
              className="text-sm text-primary font-medium hover:underline"
            >
              Ver todo
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
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
              to="/catalog"
              className="text-sm text-primary font-medium hover:underline"
            >
              Ver todo
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recentProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Index;
