import { useState } from 'react';
import { ArrowLeft, Camera, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/products';
import { toast } from 'sonner';

const conditions = ['nuevo', 'como nuevo', 'usado'] as const;

const Sell = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    condition: '' as typeof conditions[number] | '',
    location: '',
  });

  const handleImageAdd = () => {
    // Simulated image upload - in real app would use file input
    const sampleImages = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
    ];
    if (images.length < 5) {
      setImages([...images, sampleImages[images.length % 3]]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.condition) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    toast.success('¡Producto publicado!', {
      description: 'Tu producto ahora está visible para otros compradores.',
    });
    
    navigate('/catalog');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-card"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Publicar producto</h1>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="text-sm font-medium mb-3 block">
              Fotos del producto *
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-destructive-foreground" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={handleImageAdd}
                  className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">Añadir</span>
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Máximo 5 fotos. La primera será la portada.
            </p>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <label className="text-sm font-medium mb-2 block">
              Título del producto *
            </label>
            <Input
              placeholder="Ej: iPhone 14 Pro 256GB"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-card border-border/50 h-12 rounded-xl"
            />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="text-sm font-medium mb-2 block">Descripción</label>
            <Textarea
              placeholder="Describe tu producto, incluye detalles sobre el estado, características y qué incluye..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="bg-card border-border/50 rounded-xl resize-none"
            />
          </motion.div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="text-sm font-medium mb-2 block">Precio *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                $
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="bg-card border-border/50 h-12 rounded-xl pl-8"
              />
            </div>
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-sm font-medium mb-3 block">Categoría *</label>
            <div className="flex flex-wrap gap-2">
              {categories.filter((c) => c !== 'Todos').map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFormData({ ...formData, category })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.category === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Condition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className="text-sm font-medium mb-3 block">Estado *</label>
            <div className="grid grid-cols-3 gap-3">
              {conditions.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition })}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.condition === condition
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 bg-card hover:border-primary/50'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.condition === condition
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}
                  >
                    {formData.condition === condition && (
                      <Check className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {condition}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-sm font-medium mb-2 block">Ubicación</label>
            <Input
              placeholder="Ej: Ciudad de México"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="bg-card border-border/50 h-12 rounded-xl"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 rounded-2xl font-semibold text-lg"
            >
              Publicar producto
            </Button>
          </motion.div>
        </form>
      </main>
    </div>
  );
};

export default Sell;
