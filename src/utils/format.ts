/**
 * Safely formats a price value to 2 decimal places
 * Handles both string and number inputs from the API
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) {
    return '0.00';
  }

  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numPrice)) {
    return '0.00';
  }

  return numPrice.toFixed(2);
}

/**
 * Formats a date string to a localized format
 */
export function formatDate(dateString: string, locale: string = 'es-EC'): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats a date string to a short format (day and month only)
 */
export function formatDateShort(dateString: string, locale: string = 'es-EC'): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats a number with thousand separators
 */
export function formatNumber(num: number | string): string {
  const numValue = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(numValue)) {
    return '0';
  }

  return numValue.toLocaleString('es-EC');
}
