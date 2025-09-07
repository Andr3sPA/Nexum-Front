import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const nonce = crypto.randomUUID();

  const isDevelopment = process.env.NODE_ENV === 'development';

  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
  ];

  // Allow specific hashes for essential functionality
  // These are placeholder hashes - you'll need to generate actual hashes for your scripts
  const essentialScriptHashes: string[] = [
    // Add specific script hashes here for critical functionality
    // Example: "'sha256-XXXX'"
  ];
  
  scriptSrc.push(...essentialScriptHashes);

  // We've removed 'unsafe-eval' since our vanilla UI components don't require it
  // If you're using libraries that still need eval, you can add specific hashes instead
  
  // In development mode only, we can allow unsafe-eval for better developer experience
  if (isDevelopment) {
    scriptSrc.push("'unsafe-eval'");
  }

  // Style sources with nonce-based approach instead of unsafe-inline
  const styleSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    // We've removed 'unsafe-inline' since our vanilla UI components use className approach
    // If you have specific inline styles that can't be moved to CSS files,
    // add their hashes here instead of using unsafe-inline
  ];

  // In development mode only, we can allow unsafe-inline for styles for better developer experience
  if (isDevelopment) {
    styleSrc.push("'unsafe-inline'");
  }

  const connectSrc = [
    "'self'",
    ...(isDevelopment ? [
      'ws:', 'wss:',
      'http://localhost:8110',
      'http://localhost:8100',
      'http://localhost:3000',
    ] : []),
  ];

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc.join(' ')};
    style-src ${styleSrc.join(' ')};
    img-src 'self' data: blob:;
    font-src 'self' data:;
    connect-src ${connectSrc.join(' ')};
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};