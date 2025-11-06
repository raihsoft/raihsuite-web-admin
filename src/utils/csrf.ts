// src/utils/csrf.ts

/**
 * Get CSRF token from cookies (Django-style, name: 'csrftoken').
 */
export function getCsrfToken(): string | undefined {
    if (typeof document === 'undefined') return undefined;
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : undefined;
}

/**
 * Add CSRF token to fetch headers.
 */
export function withCsrf(headers: Record<string, string> = {}): Record<string, string> {
    const token = getCsrfToken();
    if (token) {
        headers['X-CSRFToken'] = token;
    }
    return headers;
}
