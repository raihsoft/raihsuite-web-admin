import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import ChangePasswordForm from './components/ChangePasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router-dom'

type ChangePasswordProps = {
    dashboardUrl?: string
}

export const ChangePasswordBase = ({
    dashboardUrl = '/dashboard',
}: ChangePasswordProps) => {
    const [changeComplete, setChangeComplete] = useState(false)

    const [message, setMessage] = useTimeOutMessage()

    const navigate = useNavigate()

    const handleContinue = () => {
        navigate(dashboardUrl)
    }

    return (
        <div>
            <div className="mb-6">
                {changeComplete ? (
                    <>
                        <h3 className="mb-1">Password changed successfully</h3>
                        <p className="font-semibold heading-text">
                            Your password has been successfully updated
                        </p>
                    </>
                ) : (
                    <>
                        {/* <h3 className="mb-1">Change your password</h3>
                        <p className="font-semibold heading-text">
                            Please enter your old password and set a new password
                        </p> */}
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <ChangePasswordForm
                changeComplete={changeComplete}
                setMessage={setMessage}
                setChangeComplete={setChangeComplete}
            >
                <Button
                    block
                    variant="solid"
                    type="button"
                    onClick={handleContinue}
                >
                    Continue
                </Button>
            </ChangePasswordForm>
            <div className="mt-4 text-center">
                <span>Back to </span>
                <ActionLink
                    to={dashboardUrl}
                    className="heading-text font-bold"
                    themeColor={false}
                >
                    Dashboard
                </ActionLink>
            </div>
        </div>
    )
}

const ChangePassword = () => {
    return <ChangePasswordBase />
}

export default ChangePassword
