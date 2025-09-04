import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const guestCookie = request.cookies.get('guest');
  const isGuest = guestCookie?.value === 'true';

  const publicRoutes = ['/sign-up', '/log-in', '/api']; // 누구나 접근 가능 
  const protectedRoutes = ['/my-page','/cart','/pay-history']; // 비회원 접근 불가능 



  const url = request.nextUrl.clone();
  const path = request.nextUrl.pathname;

  // prefix 매칭 유틸
const isUnder = (bases: string[], p: string) =>
  bases.some((base) => p === base || p.startsWith(`${base}/`));

const isPublic = isUnder(publicRoutes, path);
const isProtected = isUnder(protectedRoutes, path);

// 1) 비회원(게스트)이 보호 경로 접근 → 로그인으로
if (!user && isGuest && isProtected) {
  url.pathname = '/log-in';
  return NextResponse.redirect(url);
}

// 2) 비로그인 & 비게스트가 비공개(=public 아님) 경로 접근 → 로그인으로
if (!user && !isGuest && !isPublic) {
  url.pathname = '/log-in';
  return NextResponse.redirect(url);
}

// 3) 로그인 사용자가 public 페이지(로그인/회원가입 등) 접근 → 마이페이지로
if (user && isPublic) {
  url.pathname = '/my-page';
  return NextResponse.redirect(url);
}

// 4) 로그인 사용자 접근 허용 + 게스트 쿠키 정리
if (user) {
  supabaseResponse.cookies.delete('guest');
  return supabaseResponse;
}

  return supabaseResponse;
}
