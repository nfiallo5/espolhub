import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Shield,
  MessageCircle,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getAnnouncement } from '@/api/announcements';
import { getSellerAnnouncements } from '@/api/sellers';
import { getFullImageUrl } from '@/utils/imageUrl';
import { formatPrice, formatDateShort } from '@/utils/format';
import { CONDITIONS, CONDITION_COLORS } from '@/types/enums';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Validate ID is a valid number
  const numericId = id ? Number(id) : NaN;
  const isValidId = !isNaN(numericId) && numericId > 0;

  // Fetch announcement details (this also increments views)
  const {
    data: announcement,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['announcement', id],
    queryFn: () => getAnnouncement(numericId),
    enabled: !!id && isValidId,
  });

  // Fetch seller's other announcements
  const sellerId = announcement?.relationships?.seller?.data?.attributes?.id;
  const { data: sellerAnnouncements } = useQuery({
    queryKey: ['sellerAnnouncements', sellerId],
    queryFn: () => getSellerAnnouncements(sellerId!),
    enabled: !!sellerId,
  });

  // Filter out current announcement from seller's other items
  const otherItems =
    sellerAnnouncements
      ?.filter((a) => a.attributes.id !== announcement?.attributes.id)
      .slice(0, 4) || [];

  // Handle invalid ID
  if (!id || !isValidId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground mb-4">ID de producto inválido</p>
        <Button onClick={() => navigate('/catalog')}>Volver a explorar</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <header className="fixed top-0 left-0 right-0 z-50 glass">
          <div className="container flex items-center justify-between py-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>
        </header>
        <div className="pt-16">
          <Skeleton className="aspect-square w-full" />
        </div>
        <div className="container -mt-6 relative">
          <div className="bg-card rounded-t-3xl shadow-elevated p-6 space-y-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground mb-4">Producto no encontrado</p>
        <Button onClick={() => navigate('/catalog')}>Volver a explorar</Button>
      </div>
    );
  }

  const { attributes, relationships } = announcement;
  const seller = relationships?.seller?.data;
  const category = relationships?.category?.data;
  const images = attributes.images || [];
  const conditionLabel = CONDITIONS[attributes.condition];
  const conditionColor = CONDITION_COLORS[attributes.condition];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: attributes.title, url });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos');
  };

  const handleContact = () => {
    if (seller?.attributes?.whatsapp_link) {
      window.open(seller.attributes.whatsapp_link, '_blank');
    } else {
      toast.info('Información de contacto no disponible');
    }
  };

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const currentImage =
    images.length > 0
      ? getFullImageUrl(images[currentImageIndex])
      : 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&h=600&fit=crop';

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
            <button
              onClick={handleShare}
              className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-card"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleFavorite}
              className={cn(
                'w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-card',
                isFavorite && 'text-destructive'
              )}
            >
              <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
            </button>
          </div>
        </div>
      </header>

      {/* Product Image */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-16">
        <div className="relative aspect-square w-full">
          <img
            src={currentImage}
            alt={attributes.title}
            className="w-full h-full object-cover"
          />

          {/* Image navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur rounded-full flex items-center justify-center shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur rounded-full flex items-center justify-center shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      currentImageIndex === idx ? 'bg-primary' : 'bg-card/60'
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Status Badge */}
          {attributes.status === 'reserved' && (
            <Badge className="absolute top-4 left-4 bg-warning text-warning-foreground">
              Reservado
            </Badge>
          )}
          {attributes.status === 'sold' && (
            <Badge className="absolute top-4 left-4 bg-muted text-muted-foreground">
              Vendido
            </Badge>
          )}
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
              <p className="text-3xl font-bold text-primary">
                ${formatPrice(attributes.price)}
              </p>
              <h1 className="text-xl font-semibold mt-2">{attributes.title}</h1>
            </div>
            <span className={cn('px-3 py-1.5 rounded-full text-sm font-semibold', conditionColor)}>
              {conditionLabel}
            </span>
          </div>

          {/* Location & Stats */}
          <div className="flex flex-wrap gap-4 mt-4 text-muted-foreground text-sm">
            {attributes.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{attributes.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{attributes.views} vistas</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDateShort(attributes.created_at)}</span>
            </div>
          </div>

          {/* Category */}
          {category?.attributes && (
            <div className="mt-4">
              <span className="px-3 py-1.5 bg-secondary rounded-full text-sm">
                {category.attributes.icon} {category.attributes.name}
              </span>
            </div>
          )}

          {/* Description */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Descripción</h2>
            <p className="text-muted-foreground leading-relaxed">{attributes.description}</p>
          </div>

          <Separator className="my-6" />

          {/* Seller Info */}
          {seller?.attributes && (
            <div className="p-4 bg-secondary rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {seller.attributes.name?.[0] || 'V'}
                  </span>
                </div>
                <div className="flex-1">
                  <Link
                    to={`/seller/${seller.attributes.id}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {seller.attributes.name}
                  </Link>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 text-teal" />
                    <span className="text-sm">{seller.attributes.faculty}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Safety Note */}
          <div className="mt-6 p-4 bg-peach rounded-2xl flex items-start gap-3">
            <Shield className="w-5 h-5 text-coral-dark mt-0.5" />
            <p className="text-sm text-foreground/80">
              Siempre verifica el producto antes de pagar. Recomendamos hacer el intercambio
              en lugares públicos y seguros.
            </p>
          </div>
        </div>
      </motion.div>

      {/* More from Seller */}
      {otherItems.length > 0 && (
        <div className="container mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Más de {seller?.attributes?.name}</h2>
            {seller?.attributes && (
              <Link
                to={`/seller/${seller.attributes.id}`}
                className="text-sm text-primary hover:underline"
              >
                Ver todo
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {otherItems.map((item, index) => (
              <ProductCard key={item.id} announcement={item} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 p-4">
        <div className="container flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 h-14 rounded-2xl font-semibold"
            onClick={handleContact}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contactar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
