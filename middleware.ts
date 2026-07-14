import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Role based routing logic
    if (path.startsWith('/dashboard/manager') && token.role !== 'MANAGER' && token.role !== 'HR' && token.role !== 'CEO') {
      return NextResponse.rewrite(new URL('/unauthorized', req.url))
    }

    if (path.startsWith('/dashboard/hr') && token.role !== 'HR' && token.role !== 'CEO') {
      return NextResponse.rewrite(new URL('/unauthorized', req.url))
    }

    if (path.startsWith('/dashboard/ceo') && token.role !== 'CEO') {
      return NextResponse.rewrite(new URL('/unauthorized', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/api/leave/:path*']
}
