import Button from '@/components/ui/Button'
import { useAuth } from '@/auth'
import {
    apiGoogleOauthSignIn,
    apiGithubOauthSignIn,
} from '@/services/OAuthServices'

type OauthSignInProps = {
    setMessage?: (message: string) => void
    disableSubmit?: boolean
}

const OauthSignIn = ({ setMessage, disableSubmit }: OauthSignInProps) => {
    const { oAuthSignIn } = useAuth()

    const handleGoogleSignIn = async () => {
        if (!disableSubmit) {
            oAuthSignIn(async ({ redirect, onSignIn }) => {
                try {
                    const resp = await apiGoogleOauthSignIn()
                    if (resp) {
                        const { token, user } = resp
                        onSignIn({ accessToken: token }, user)
                        redirect()
                    }
                } catch (error: any) {
                    if (!error?.response) {
                        setMessage?.('No internet connection')
                    } else if (error.response?.status >= 500) {
                        setMessage?.('Server is not available. Please try again later.')
                    } else {
                        const msg = error?.response?.data?.message || error?.message || 'Sign in failed'
                        setMessage?.(msg)
                    }
                }
            })
        }
    }

    const handleGithubSignIn = async () => {
        if (!disableSubmit) {
            oAuthSignIn(async ({ redirect, onSignIn }) => {
                try {
                    const resp = await apiGithubOauthSignIn()
                    if (resp) {
                        const { token, user } = resp
                        onSignIn({ accessToken: token }, user)
                        redirect()
                    }
                } catch (error: any) {
                    if (!error?.response) {
                        setMessage?.('No internet connection')
                    } else if (error.response?.status >= 500) {
                        setMessage?.('Server is not available. Please try again later.')
                    } else {
                        const msg = error?.response?.data?.message || error?.message || 'Sign in failed'
                        setMessage?.(msg)
                    }
                }
            })
        }
    }

    return (
        <div className="flex items-center gap-2">
            {/* <Button
                className="flex-1"
                type="button"
                onClick={handleGoogleSignIn}
            >
                <div className="flex items-center justify-center gap-2">
                    <img
                        className="h-[25px] w-[25px]"
                        src="/img/others/google.png"
                        alt="Google sign in"
                    />
                    <span>Google</span>
                </div>
            </Button>
            <Button
                className="flex-1"
                type="button"
                onClick={handleGithubSignIn}
            >
                <div className="flex items-center justify-center gap-2">
                    <img
                        className="h-[25px] w-[25px]"
                        src="/img/others/github.png"
                        alt="Google sign in"
                    />
                    <span>Github</span>
                </div>
            </Button> */}
        </div>
    )
}

export default OauthSignIn
