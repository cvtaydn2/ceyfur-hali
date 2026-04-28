// Client-only — HttpOnly cookie kullanıldığı için bu dosya artık işlevsizdir.
// Geriye dönük uyumluluk için boş fonksiyonlar bırakılmıştır.

export function getAuthToken(): string | null {
  return null;
}

export function setAuthToken(token: string): void {
  // Artik token body'de dönmüyor, sadece cookie kullaniliyor.
}

export function clearAuthToken(): void {
  // Cookie temizliği için logout endpoint'i çağrılmalıdır.
}

export function getAuthHeaders(): HeadersInit {
  return {};
}
