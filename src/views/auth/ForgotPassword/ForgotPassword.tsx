// import { useState } from 'react'
// import Alert from '@/components/ui/Alert'
// import Button from '@/components/ui/Button'
// import ActionLink from '@/components/shared/ActionLink'
// import ForgotPasswordForm from './components/ForgotPasswordForm'
// import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
// import { useNavigate } from 'react-router-dom'

// type ForgotPasswordProps = {
//     signInUrl?: string
// }

// export const ForgotPasswordBase = ({
//     signInUrl = '/sign-in',
// }: ForgotPasswordProps) => {
//     const [emailSent, setEmailSent] = useState(false)
//     const [message, setMessage] = useTimeOutMessage()

//     const navigate = useNavigate()

//     const handleContinue = () => {
//         navigate(signInUrl)
//     }

//     return (
//         <div>
//             <div className="mb-6">
//                 {emailSent ? (
//                     <>
//                         <h3 className="mb-2">Check your email</h3>
//                         <p className="font-semibold heading-text">
//                             We have sent a password recovery to your email
//                         </p>
//                     </>
//                 ) : (
//                     <>
//                         <h3 className="mb-2">Forgot Password</h3>
//                         <p className="font-semibold heading-text">
//                             Please enter your email to receive a verification
//                             code
//                         </p>
//                     </>
//                 )}
//             </div>
//             {message && (
//                 <Alert showIcon className="mb-4" type="danger">
//                     <span className="break-all">{message}</span>
//                 </Alert>
//             )}
//             <ForgotPasswordForm
//                 emailSent={emailSent}
//                 setMessage={setMessage}
//                 setEmailSent={setEmailSent}
//             >
//                 <Button
//                     block
//                     variant="solid"
//                     type="button"
//                     onClick={handleContinue}
//                 >
//                     Continue
//                 </Button>
//             </ForgotPasswordForm>
//             <div className="mt-4 text-center">
//                 <span>Back to </span>
//                 <ActionLink
//                     to={signInUrl}
//                     className="heading-text font-bold"
//                     themeColor={false}
//                 >
//                     Sign in
//                 </ActionLink>
//             </div>
//         </div>
//     )
// }

// const ForgotPassword = () => {
//     return <ForgotPasswordBase />
// }

// export default ForgotPassword
import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

type ForgotPasswordProps = {
    signInUrl?: string
}

export const ForgotPasswordBase = ({
    signInUrl = '/sign-in',
}: ForgotPasswordProps) => {

    const [showMessage, setShowMessage] = useState(false)
    const navigate = useNavigate()

    const handleForgotPasswordClick = () => {
        setShowMessage(true)
    }

    const handleContinue = () => {
        navigate(signInUrl)
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h3 className="mb-2">Forgot Password</h3>
                <p className="font-semibold heading-text">
                    Forgot password is currently not available
                </p>
            </div>

            {/* Alert Message */}
            {showMessage && (
                <Alert showIcon className="mb-4" type="warning">
                    Please contact the support team to reset your password. <br />

                    <a
                        href="mailto:contact@raihsoft.com?subject=Forgot Password Request&body=Hi Support Team, I need help resetting my password."
                        className="text-blue-600 underline font-semibold"
                    >
                        contact@raihsoft.com
                    </a>
                </Alert>
            )}

            {/* Forgot Password Button → Hide After Click */}
            {!showMessage && (
                <Button
                    block
                    variant="solid"
                    type="button"
                    onClick={handleForgotPasswordClick}
                >
                    Forgot Password
                </Button>
            )}

            {/* Continue Button */}
            <Button
                block
                className="mt-3"
                variant="default"
                type="button"
                onClick={handleContinue}
            >
                Continue to Login In
            </Button>
        </div>
    )
}

const ForgotPassword = () => {
    return <ForgotPasswordBase />
}

export default ForgotPassword
