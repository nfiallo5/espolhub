import { useState, useRef } from 'react';
import { ArrowLeft, Camera, X, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { createAnnouncement } from '@/api/announcements';
import { getCategories } from '@/api/categories';
import { useAuth } from '@/contexts/AuthContext';
import { CONDITIONS, ConditionKey } from '@/types/enums';
import { validateImages, isValidImageFile } from '@/utils/validation';

// Validation schema
const sellSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(150, 'El título no puede exceder 150 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres'),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Ingresa un precio válido')
    .refine((val) => Number(val) <= 100000, 'El precio máximo es $100,000'),
  category_id: z.number({ required_error: 'Selecciona una categoría' }),
  condition: z.enum(['new_item', 'like_new', 'good', 'acceptable'] as const, {
    required_error: 'Selecciona una condición',
  }),
  location: z.string().optional(),
});

type SellFormData = z.infer<typeof sellSchema>;

const Sell = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const categories = categoriesData || [];

  // Form handling
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SellFormData>({
    resolver: zodResolver(sellSchema),
    defaultValues: {
      condition: 'good',
    },
  });

  const selectedCondition = watch('condition');
  const selectedCategory = watch('category_id');

  // Create announcement mutation
  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      toast.success('¡Anuncio publicado!', {
        description: 'Tu producto ahora está visible para otros compradores.',
      });
      navigate('/catalog');
    },
    onError: (error: Error) => {
      toast.error('Error al publicar', {
        description: error.message || 'Intenta nuevamente',
      });
    },
  });

  // Handle image upload
  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = imageFiles.length + newFiles.length;

    if (totalImages > 5) {
      toast.error('Máximo 5 imágenes permitidas');
      return;
    }

    // Validate each file
    for (const file of newFiles) {
      const validation = isValidImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
    }

    // Create previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...newFiles]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: SellFormData) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para publicar');
      navigate('/login');
      return;
    }

    if (imageFiles.length === 0) {
      toast.error('Añade al menos una imagen');
      return;
    }

    createMutation.mutate({
      title: data.title,
      description: data.description,
      price: Number(data.price),
      condition: data.condition,
      category_id: data.category_id,
      location: data.location,
      images: imageFiles,
    });
  };

  const LOCATIONS = [
    'Campus Gustavo Galindo',
    'Campus Prosperina',
    'FIEC',
    'FCNM',
    'FIMCP',
    'FCSH',
    'FADCOM',
    'Biblioteca',
    'Canchas ESPOL',
    'Otro',
  ];

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="text-sm font-medium mb-3 block">
              Fotos del producto * <span className="text-muted-foreground">(máx. 5)</span>
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagePreviews.map((img, index) => (
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
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                      Portada
                    </span>
                  )}
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">Añadir</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleImageAdd}
            />
            <p className="text-xs text-muted-foreground mt-2">
              JPEG, PNG o WebP. Máximo 5MB por imagen.
            </p>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <label className="text-sm font-medium mb-2 block">Título del producto *</label>
            <Input
              placeholder="Ej: Cálculo de Thomas 14va Edición"
              {...register('title')}
              className={`bg-card border-border/50 h-12 rounded-xl ${
                errors.title ? 'border-destructive' : ''
              }`}
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="text-sm font-medium mb-2 block">Descripción *</label>
            <Textarea
              placeholder="Describe tu producto, incluye detalles sobre el estado, características y qué incluye..."
              {...register('description')}
              rows={4}
              className={`bg-card border-border/50 rounded-xl resize-none ${
                errors.description ? 'border-destructive' : ''
              }`}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </motion.div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="text-sm font-medium mb-2 block">Precio (USD) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                $
              </span>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100000"
                placeholder="0.00"
                {...register('price')}
                className={`bg-card border-border/50 h-12 rounded-xl pl-8 ${
                  errors.price ? 'border-destructive' : ''
                }`}
              />
            </div>
            {errors.price && (
              <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
            )}
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-sm font-medium mb-3 block">Categoría *</label>
            {categoriesLoading ? (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-full" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setValue('category_id', category.attributes.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.attributes.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    }`}
                  >
                    {category.attributes.icon} {category.attributes.name}
                  </button>
                ))}
              </div>
            )}
            {errors.category_id && (
              <p className="text-sm text-destructive mt-1">{errors.category_id.message}</p>
            )}
          </motion.div>

          {/* Condition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className="text-sm font-medium mb-3 block">Estado *</label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(CONDITIONS) as [ConditionKey, string][]).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue('condition', key)}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    selectedCondition === key
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 bg-card hover:border-primary/50'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedCondition === key ? 'border-primary bg-primary' : 'border-border'
                    }`}
                  >
                    {selectedCondition === key && (
                      <Check className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
            {errors.condition && (
              <p className="text-sm text-destructive mt-1">{errors.condition.message}</p>
            )}
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-sm font-medium mb-3 block">
              Ubicación <span className="text-muted-foreground">(opcional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => setValue('location', location)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    watch('location') === location
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
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
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar producto'
              )}
            </Button>
          </motion.div>
        </form>
      </main>
    </div>
  );
};

export default Sell;
