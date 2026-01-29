import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type {
  SignInCredential,
  SignUpCredential,
  ForgotPassword,
  ResetPassword,
  ChangePassword,
  SignInResponse,
  SignUpResponse,
} from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
  const res = await ApiService.fetchDataWithAxios<SignInResponse>({
    url: endpointConfig.signIn,
    method: 'post',
    data,
  })

  // 🔹 Save access token
  if (res.access) {
    localStorage.setItem('access_token', res.access)
  }

  // 🔹 Save refresh token
  if (res.refresh) {
    localStorage.setItem('refresh_token', res.refresh)
  }

  // 🔥 Save TENANT from user.tenant_id (backend returns here)
  if (res.user && res.user.tenant_id) {
    localStorage.setItem('tenant', res.user.tenant_id.toString())
  } else {
    console.warn('⚠️ Tenant ID missing in response')
  }

  // 🔹 Store session user if needed
  if (res.user) {
    localStorage.setItem('sessionUser', JSON.stringify(res.user))
  }

  return res
}

export async function apiSignUp(data: SignUpCredential) {
  return ApiService.fetchDataWithAxios<SignUpResponse>({
    url: endpointConfig.signUp,
    method: 'post',
    data,
  })
}

export async function apiSignOut() {
  // 🔹 Clear tokens
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('tenant_id')
  localStorage.removeItem('sessionUser')

  return ApiService.fetchDataWithAxios({
    url: endpointConfig.signOut,
    method: 'post',
  })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
  return ApiService.fetchDataWithAxios<T>({
    url: endpointConfig.forgotPassword,
    method: 'post',
    data,
  })
}

export async function apiResetPassword<T>(data: ResetPassword) {
  return ApiService.fetchDataWithAxios<T>({
    url: endpointConfig.resetPassword,
    method: 'post',
    data,
  })
}

export async function apiChangePassword<T>(data: ChangePassword) {
  return ApiService.fetchDataWithAxios<T>({
    url: endpointConfig.changePassword,
    method: 'post',
    data,
  })
}



