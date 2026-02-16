import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignInForm from './components/SignInForm'
import OauthSignIn from './components/OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    disableSubmit?: boolean
    contentClassName?: string
}

export const SignInBase = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    disableSubmit,
    contentClassName,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()

    const mode = useThemeStore((state) => state.mode)

    return (
        <div className={contentClassName ?? ''}>
            <div className="mx-auto w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
                    <div className="flex flex-col items-center">
                        {/* <Logo type="streamline" mode={mode} imgClass="mx-auto" logoWidth={60} /> */}
                        <h2 className="mt-4 text-2xl sm:text-3xl font-bold ">RAIHSUITE - ERP</h2>
                        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-[340px] text-center">
                            Please enter your credentials to login!
                        </p>
                    </div>

                    {message && (
                        <div className="mt-4">
                            <Alert showIcon type="danger">
                                <span className="break-all">{message}</span>
                            </Alert>
                        </div>
                    )}

                    <div className="mt-6">
                        <SignInForm
                            className="text-left"
                            disableSubmit={disableSubmit}
                            setMessage={setMessage}
                            passwordHint={
                                <div className="mb-7 mt-2">
                                    <ActionLink
                                        to={forgetPasswordUrl}
                                        className="font-semibold heading-text mt-2 underline"
                                        themeColor={false}
                                    >
                                        Forgot password?
                                    </ActionLink>
                                </div>
                            }
                        />
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center gap-2 mb-4">
                            {/* <div className="border-t border-gray-200 dark:border-gray-700 flex-1 mt-[1px]" />
                            <p className="font-semibold text-sm text-muted-foreground">or continue with</p>
                            <div className="border-t border-gray-200 dark:border-gray-700 flex-1 mt-[1px]" /> */}
                        </div>
                        <OauthSignIn disableSubmit={disableSubmit} setMessage={setMessage} />
                    </div>

                    <div className="mt-6 text-center">
                        <ActionLink to={signUpUrl} className="heading-text font-bold" themeColor={false}>
                            {/* Sign up */}
                        </ActionLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SignIn = () => {
    return <SignInBase />
}

export default SignIn
