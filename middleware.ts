import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const nonce = crypto.randomUUID();

  const isDevelopment = process.env.NODE_ENV === 'development';

  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
  ];

  if (isDevelopment) {
    scriptSrc.push("'unsafe-eval'");
    
    // Additional safety check to ensure this never reaches production
    if (process.env.NODE_ENV === 'production') {
      throw new Error('unsafe-eval detected in production build!');
    }
  }

  // Secure style-src without unsafe-inline
  const styleSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    // Add specific hashes for any unavoidable inline styles
    // "'sha256-xyz123...'", // Replace with actual hashes
  ];

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc.join(' ')};
    style-src ${styleSrc.join(' ')};
    img-src 'self' data: blob:;
    font-src 'self' data:;
    connect-src 'self' ${isDevelopment ? 'ws: wss:' : ''};
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
    object-src 'none';
    media-src 'self';
    worker-src 'self';
    manifest-src 'self';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        {
          type: 'header',
          key: 'next-router-prefetch',
        },
        {
          type: 'header',
          key: 'purpose',
          value: 'prefetch',
        },
      ],
    },
  ],
};