import { Heart, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Product } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const conditionColors = {
    nuevo: 'bg-teal text-accent-foreground',
    'como nuevo': 'bg-coral-light/20 text-coral-dark',
    usado: 'bg-secondary text-secondary-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 group">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                // Toggle favorite logic
              }}
              className="absolute top-3 right-3 w-9 h-9 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
            >
              <Heart className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </button>
            <span
              className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                conditionColors[product.condition]
              }`}
            >
              {product.condition}
            </span>
          </div>
          <div className="p-4">
            <p className="text-xl font-bold text-primary">${product.price}</p>
            <h3 className="font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mt-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-sm">{product.location}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
