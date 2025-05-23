import {
  InfluencerRegistrationData,
  LoginData,
  ResetData
} from '@/app/types/interfaces'
import { BASE_URL } from '@/app/utils/url'


async function auth(
  accessToken: string,
  refreshToken: string,
  supabaseId: string
) {
  const response = await fetch(`${BASE_URL}/api/v1/auth/state`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
      supabase_id: supabaseId
    })
  })

  return response.json()
}

async function submitFeedback(
  supabase_id: string | null | undefined,
  feedback: string,
  rating: number
) {
  const response = await fetch(`${BASE_URL}/api/v1/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uid: supabase_id,
      description: feedback,
      rating,
      role: localStorage.getItem('user_role')
    })
  })

  return response
}



interface RegisterData {
  name: string
  email: string
  password: string
}
async function registerUser(registerData: RegisterData) {
  const response = await fetch(`${BASE_URL}/api/v1/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(registerData)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error('Registration failed: ' + errorData.detail)
  }

  return response.json()
}


async function loginUser(loginData: LoginData) {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}

async function Resetpassword(resetData: ResetData) {
  const response = await fetch(`${BASE_URL}/api/v1/auth/update_password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resetData)
  })

  if (!response.ok) {
    throw new Error('Password Reset failed')
  }

  return response.json()
}

async function passwordReset(email: string) {
  const response = await fetch(
    `${BASE_URL}/api/v1/auth/passwordReset/${email}`,
    { method: 'POST' }
  )

  if (!response.ok) {
    throw new Error('Password Reset failed')
  }

  return response.json()
}


async function fetchLogs() {
  const response = await fetch('https://fastapiapp-eight.vercel.app/meallog',
      { method: 'GET' })
  return response.json()
}




export {
  registerUser,
  loginUser,
  submitFeedback,
  auth,
  passwordReset,
  Resetpassword,
  fetchLogs
}
