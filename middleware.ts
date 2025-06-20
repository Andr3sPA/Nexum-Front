import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const isDevelopment = process.env.NODE_ENV === 'development';

  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
  ];

  if (isDevelopment) {
    scriptSrc.push("'unsafe-eval'");
  }

  const styleSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'unsafe-inline'", // Required for UI libraries like Radix
  ];

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc.join(' ')};
    style-src ${styleSrc.join(' ')};
    img-src 'self' data:;
    font-src 'self' data:;
    connect-src 'self';
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
    object-src 'none';
    upgrade-insecure-requests;
  `;

  const cspHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeaderValue);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', cspHeaderValue);

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
