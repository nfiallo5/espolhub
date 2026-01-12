import { FACULTIES, Faculty } from '@/types/enums';

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Ecuador phone validation (09XXXXXXXX)
export function isValidEcuadorPhone(phone: string): boolean {
  const phoneRegex = /^09\d{8}$/;
  return phoneRegex.test(phone);
}

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  return true;
}

export function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Mínimo 8 caracteres');
  if (!/[A-Z]/.test(password)) errors.push('Una letra mayúscula');
  if (!/[a-z]/.test(password)) errors.push('Una letra minúscula');
  if (!/\d/.test(password)) errors.push('Un número');
  return errors;
}

// Name validation (2-100 chars)
export function isValidName(name: string): boolean {
  return name.length >= 2 && name.length <= 100;
}

// Faculty validation
export function isValidFaculty(faculty: string): faculty is Faculty {
  return FACULTIES.includes(faculty as Faculty);
}

// Announcement validations
export function isValidTitle(title: string): boolean {
  return title.length >= 5 && title.length <= 150;
}

export function isValidDescription(description: string): boolean {
  return description.length <= 2000;
}

export function isValidPrice(price: number): boolean {
  return price > 0 && price <= 100000;
}

// Image validations
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGES = 5;

export function isValidImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Formato no permitido. Usa JPEG, PNG o WebP' };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'La imagen excede 5MB' };
  }
  return { valid: true };
}

export function validateImages(files: File[]): { valid: boolean; error?: string } {
  if (files.length > MAX_IMAGES) {
    return { valid: false, error: `Máximo ${MAX_IMAGES} imágenes permitidas` };
  }
  for (const file of files) {
    const result = isValidImageFile(file);
    if (!result.valid) {
      return result;
    }
  }
  return { valid: true };
}
