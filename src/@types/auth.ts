export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
     access: string
    refresh: string  
    tenant_id?: string
    user: {
        userId: string
        userName: string
        authority: string[]
        avatar: string
        email: string
        tenant_id?: string
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type ChangePassword = {
    current_password: string
    new_password: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    email?: string | null
    authority?: string[]
    tenant_id?: string | null
}

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}
