import type { Handle } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // Max 10 submissions per 15 minutes per IP
    checkRequests: 100 // Max 100 check requests per 15 minutes per IP
};

function getRealIP(request: Request): string {
    // Check various headers for real IP (for production behind proxies)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');

    if (cfConnectingIP) return cfConnectingIP;
    if (realIP) return realIP;
    if (forwarded) return forwarded.split(',')[0].trim();

    return 'unknown';
}

function isRateLimited(ip: string, endpoint: string): boolean {
    const key = `${ip}:${endpoint}`;
    const now = Date.now();
    const limit = endpoint === 'submit' ? RATE_LIMIT.maxRequests : RATE_LIMIT.checkRequests;

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
        return false;
    }

    if (record.count >= limit) {
        return true;
    }

    record.count++;
    return false;
}

export const handle: Handle = async ({ event, resolve }) => {
    const { request, url } = event;
    const ip = getRealIP(request);

    // Apply rate limiting to API endpoints
    if (url.pathname.startsWith('/api/')) {
        const endpoint = url.pathname.includes('/submit') ? 'submit' : 'check';

        if (isRateLimited(ip, endpoint)) {
            return json(
                {
                    success: false,
                    message: 'Too many requests. Please try again later.',
                    retryAfter: Math.ceil(RATE_LIMIT.windowMs / 1000)
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(Math.ceil(RATE_LIMIT.windowMs / 1000))
                    }
                }
            );
        }
    }

    const response = await resolve(event);

    // Security Headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'", // Note: 'unsafe-inline' needed for Svelte
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "font-src 'self'",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ')
    );

    // HSTS (only in production with HTTPS)
    if (url.protocol === 'https:') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    return response;
}; 