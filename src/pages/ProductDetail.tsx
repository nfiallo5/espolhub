import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MapPin, Shield, MessageCircle, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockProducts } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const product = mockProducts.find((p) => p.id === id);
  const isInCart = items.some((item) => item.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Producto no encontrado</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Producto añadido al carrito', {
      description: product.name,
      action: {
        label: 'Ver carrito',
        onClick: () => navigate('/cart'),
      },
    });
  };

  const conditionColors = {
    nuevo: 'bg-teal text-accent-foreground',
    'como nuevo': 'bg-coral-light/20 text-coral-dark',
    usado: 'bg-secondary text-secondary-foreground',
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-card">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-card">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Product Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-16"
      >
        <div className="aspect-square w-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Product Info */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="container -mt-6 relative"
      >
        <div className="bg-card rounded-t-3xl shadow-elevated p-6">
          {/* Price & Condition */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-bold text-primary">${product.price}</p>
              <h1 className="text-xl font-semibold mt-2">{product.name}</h1>
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                conditionColors[product.condition]
              }`}
            >
              {product.condition}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mt-4 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{product.location}</span>
          </div>

          {/* Category */}
          <div className="mt-4">
            <span className="px-3 py-1.5 bg-secondary rounded-full text-sm">
              {product.category}
            </span>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Descripción</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Seller Info */}
          <div className="mt-6 p-4 bg-secondary rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {product.seller[0]}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold">{product.seller}</p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-teal" />
                  <span className="text-sm">Vendedor verificado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Note */}
          <div className="mt-6 p-4 bg-peach rounded-2xl flex items-start gap-3">
            <Shield className="w-5 h-5 text-coral-dark mt-0.5" />
            <p className="text-sm text-foreground/80">
              Siempre verifica el producto antes de pagar. Recomendamos hacer el
              intercambio en lugares públicos y seguros.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 p-4">
        <div className="container flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 h-14 rounded-2xl font-semibold"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contactar
          </Button>
          <Button
            size="lg"
            className="flex-1 h-14 rounded-2xl font-semibold"
            onClick={handleAddToCart}
          >
            {isInCart ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                En el carrito
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Añadir
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
