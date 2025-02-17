import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token }) => token != null,
  },
  pages: {
    signIn: "/",
  },
});

const adminMiddleware = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token?.isAdmin,
  },
  pages: {
    signIn: "/",
  },
});

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.includes("/manageproducts"))
    return (adminMiddleware as any)(req);
  return (authMiddleware as any)(req);
}

export const config = {
  matcher: ["/myacc/:path*", "/manageproducts/:path*"],
};
