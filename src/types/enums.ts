// Backend Enums

export const FACULTIES = ['FIEC', 'FCNM', 'FIMCP', 'FIMCBOR', 'FCSH', 'FADCOM', 'ESPAE', 'FCV', 'FICT'] as const;
export type Faculty = typeof FACULTIES[number];

export const CONDITIONS = {
  new_item: 'Nuevo',
  like_new: 'Como Nuevo',
  good: 'Buen Estado',
  acceptable: 'Aceptable',
} as const;

export type ConditionKey = keyof typeof CONDITIONS;

export const CONDITION_COLORS: Record<ConditionKey, string> = {
  new_item: 'bg-green-100 text-green-800 border-green-200',
  like_new: 'bg-blue-100 text-blue-800 border-blue-200',
  good: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  acceptable: 'bg-gray-100 text-gray-800 border-gray-200',
};

export type AnnouncementStatus = 'active' | 'reserved' | 'sold';

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Más Recientes' },
  { value: 'popular', label: 'Populares' },
  { value: 'price_asc', label: 'Precio: Menor a Mayor' },
  { value: 'price_desc', label: 'Precio: Mayor a Menor' },
] as const;
