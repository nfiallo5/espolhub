import { Heart, MapPin, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Announcement } from '@/types/models';
import { CONDITIONS, CONDITION_COLORS, ConditionKey } from '@/types/enums';
import { getFullImageUrl } from '@/utils/imageUrl';
import { formatPrice } from '@/utils/format';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  announcement: Announcement;
  index?: number;
}

const ProductCard = ({ announcement, index = 0 }: ProductCardProps) => {
  // Defensive check for undefined announcement
  if (!announcement || !announcement.attributes) {
    return null;
  }

  const { attributes } = announcement;

  // Use top-level ID (from JSON:API spec) or attributes.id as fallback
  const announcementId = announcement.id || attributes.id;

  // Skip rendering if no valid ID
  if (!announcementId) {
    return null;
  }

  const conditionLabel = CONDITIONS[attributes.condition];
  const conditionColor = CONDITION_COLORS[attributes.condition];

  // Get first image or placeholder
  const imageUrl = attributes.images?.length > 0
    ? getFullImageUrl(attributes.images[0])
    : 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/product/${announcementId}`}>
        <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 group">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={imageUrl}
              alt={attributes.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                // TODO: Handle favorite
              }}
              className="absolute top-3 right-3 w-9 h-9 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
            >
              <Heart className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </button>

            {/* Status Badge */}
            {attributes.status === 'reserved' && (
              <Badge className="absolute top-3 left-3 bg-warning text-warning-foreground border-none">
                Reservado
              </Badge>
            )}
            {attributes.status === 'sold' && (
              <Badge className="absolute top-3 left-3 bg-muted text-muted-foreground border-none">
                Vendido
              </Badge>
            )}

            {/* Condition Badge */}
            <span
              className={cn(
                'absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold',
                conditionColor
              )}
            >
              {conditionLabel}
            </span>
          </div>
          <div className="p-4">
            <p className="text-xl font-bold text-primary">${formatPrice(attributes.price)}</p>
            <h3 className="font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors">
              {attributes.title}
            </h3>
            <div className="flex items-center justify-between mt-2 text-muted-foreground text-xs">
              {attributes.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[100px]">{attributes.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{attributes.views}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
