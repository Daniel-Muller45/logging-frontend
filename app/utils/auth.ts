// utils/auth.js

import { auth } from '@/app/utils/api'

interface AuthResponse {
  status: string
  detail: {
    user_state: {
      access_token: string
      refresh_token: string
    }
  }
}

export async function verifyToken(): Promise<boolean> {
  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')
  const supabaseId = localStorage.getItem('supabase_id')

  if (!accessToken || !refreshToken || !supabaseId) {
    return false // Tokens not available, user is not logged in
  }

  try {
    const data: AuthResponse = await auth(accessToken, refreshToken, supabaseId)

    if (data.status === '200') {
      // Update tokens in local storage
      localStorage.setItem('access_token', data.detail.user_state.access_token)
      localStorage.setItem(
        'refresh_token',
        data.detail.user_state.refresh_token
      )
      return true
    } else {
      // Authentication failed, clear tokens
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('supabase_id')
      localStorage.removeItem('user_role')
      return false
    }
  } catch (error) {
    console.error('Error verifying token:', error)
    return false
  }
}
