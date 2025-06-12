import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Handles OAuth code exchange and user upsert for authentication callback.
 *
 * Exchanges the provided OAuth `code` for a Supabase session, upserts user information into the `users` table with a default coupon, and redirects the client to the specified next path on success. If an error occurs during code exchange or user upsert, redirects to an authentication error page or returns a JSON error response.
 *
 * @param request - The incoming HTTP request containing query parameters for code exchange.
 * @returns A redirect response to the next page on success, a JSON error response if user upsert fails, or a redirect to the authentication error page on failure.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    const user = data.user; 
    if (!error) {
      if(user){
        const {error} = await supabase.from('users').upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name,
          nickname: user.user_metadata.user_name || user.user_metadata.name, 
          avatar: user.user_metadata.avatar_url, 
          coupons: ['WELCOME01']
        })
        if (error) {
          console.error(error.message, '유저 정보 저장 실패');
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}