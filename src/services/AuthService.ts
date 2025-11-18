import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type {
  SignInCredential,
  SignUpCredential,
  ForgotPassword,
  ResetPassword,
  SignInResponse,
  SignUpResponse,
} from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
  const res = await ApiService.fetchDataWithAxios<SignInResponse>({
    url: endpointConfig.signIn,
    method: 'post',
    data,
  });

  // 🔹 Save tokens
  if (res.access) {
    localStorage.setItem("access_token", res.access);
  }
  if (res.refresh) {
    localStorage.setItem("refresh_token", res.refresh);
  }
  if (res.tenant) {
    localStorage.setItem("tenant", res.tenant);
  }

  // 🔥 Save tenant — DON'T depend on access/refresh
  if (res.tenant) {
    localStorage.setItem("tenant", res.tenant);
  } else {
    console.warn("⚠️ API did not return tenant");
  }

  return res;
}



export async function apiSignUp(data: SignUpCredential) {
  return ApiService.fetchDataWithAxios<SignUpResponse>({
    url: endpointConfig.signUp,
    method: 'post',
    data,
  })
}

export async function apiSignOut() {
  // 🧹 Clear tokens from storage when signing out
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')

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
