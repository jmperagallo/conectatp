import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // The `getAll` method is used to read the cookies on the request
          getAll() {
            return cookieStore.getAll()
          },
          // The `setAll` method is used to set the cookies on the response
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options })
            })
          },
        },
      }
    )

    // This will exchange the code for a session and set the cookies
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=Auth callback failed`)
    }
  }

  // Finally, redirect the user to the dashboard
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}