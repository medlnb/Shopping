import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const locales = ["en", "fr"];
const authPrivatePages = ["/myacc"]; // Base route for authenticated users
const adminPrivatePages = ["/manageproducts"]; // Base route for admins

const handleI18nRouting = createMiddleware(routing);

const authMiddleware = withAuth(
  function middleware(req) {
    return handleI18nRouting(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/",
    },
  }
);

const adminMiddleware = withAuth(
  function middleware(req) {
    return handleI18nRouting(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token?.isAdmin,
    },
    pages: {
      signIn: "/",
    },
  }
);

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const locale = locales.find((loc) => pathname.startsWith(`/${loc}`));
  const pathnameWithoutLocale = locale
    ? pathname.replace(`/${locale}`, "")
    : pathname;

  const isAuthPrivate = authPrivatePages.some((page) =>
    pathnameWithoutLocale.startsWith(page)
  );

  const isAdminPrivate = adminPrivatePages.some((page) =>
    pathnameWithoutLocale.startsWith(page)
  );

  if (isAdminPrivate) return (adminMiddleware as any)(req);
  if (isAuthPrivate) return (authMiddleware as any)(req);
  return handleI18nRouting(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
