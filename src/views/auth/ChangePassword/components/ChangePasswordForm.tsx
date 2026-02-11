import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import { apiChangePassword } from '@/services/AuthService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'

interface ChangePasswordFormProps extends CommonProps {
    changeComplete: boolean
    setChangeComplete?: (complete: boolean) => void
    setMessage?: (message: string) => void
}

type ChangePasswordFormSchema = {
    current_password: string
    new_password: string
    confirm_new_password: string
}

const validationSchema: ZodType<ChangePasswordFormSchema> = z
    .object({
        current_password: z
            .string({ required_error: 'Please enter your current password' })
            .min(1, 'Current password is required'),
        new_password: z
            .string({ required_error: 'Please enter your new password' })
            .min(6, 'Password must be at least 6 characters'),
        confirm_new_password: z.string({
            required_error: 'Confirm Password Required',
        }),
    })
    .refine((data) => data.new_password === data.confirm_new_password, {
        message: 'Your passwords do not match',
        path: ['confirm_new_password'],
    })
    .refine((data) => data.current_password !== data.new_password, {
        message: 'New password must be different from current password',
        path: ['new_password'],
    })

const ChangePasswordForm = (props: ChangePasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null) // State for API error

    const { className, setMessage, setChangeComplete, changeComplete, children } =
        props

    const {
        handleSubmit,
        formState: { errors },
        control,
        setError, // Add setError from react-hook-form
        clearErrors, // Add clearErrors to clear API errors
    } = useForm<ChangePasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onChangePassword = async (values: ChangePasswordFormSchema) => {
        const { current_password, new_password, confirm_new_password } = values

        try {
            setSubmitting(true)
            setApiError(null) // Clear previous API error
            clearErrors('current_password') // Clear any existing errors on the field
            
            const resp = await apiChangePassword<boolean>({
                current_password,
                new_password,
                confirm_new_password,
            })
            if (resp) {
                setChangeComplete?.(true)
            }
        } catch (error: any) {
            // Check if the error response contains current_password validation error
            if (error?.response?.data?.current_password) {
                // Set error on the current_password field
                setError('current_password', {
                    type: 'manual',
                    message: error.response.data.current_password[0], // Get the first error message
                })
            } else {
                // Handle other errors
                setMessage?.(
                    typeof error === 'string'
                        ? error
                        : 'Failed to change password',
                )
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Card className={`max-w-md mx-auto ${className}`}>
            {!changeComplete ? (
                <>
                    <h4 className="mb-1">Change Password</h4>
                    <p className="text-sm text-gray-500 mb-6">
                        Enter your current password and choose a new one
                    </p>

                    <Form onSubmit={handleSubmit(onChangePassword)}>
                        <div className="space-y-5">
                            <FormItem
                                label="Current Password"
                                invalid={!!errors.current_password}
                                errorMessage={errors.current_password?.message}
                            >
                                <Controller
                                    name="current_password"
                                    control={control}
                                    render={({ field }) => (
                                        <PasswordInput
                                            autoComplete="current-password"
                                            placeholder="Enter current password"
                                            {...field}
                                            // Clear API error when user starts typing
                                            onChange={(e) => {
                                                field.onChange(e)
                                                if (errors.current_password?.type === 'manual') {
                                                    clearErrors('current_password')
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="New Password"
                                invalid={!!errors.new_password}
                                errorMessage={errors.new_password?.message}
                            >
                                <Controller
                                    name="new_password"
                                    control={control}
                                    render={({ field }) => (
                                        <PasswordInput
                                            autoComplete="new-password"
                                            placeholder="Enter new password"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Confirm New Password"
                                invalid={!!errors.confirm_new_password}
                                errorMessage={errors.confirm_new_password?.message}
                            >
                                <Controller
                                    name="confirm_new_password"
                                    control={control}
                                    render={({ field }) => (
                                        <PasswordInput
                                            autoComplete="new-password"
                                            placeholder="Confirm new password"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>

                            <Button
                                block
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                            >
                                Update Password
                            </Button>
                        </div>
                    </Form>
                </>
            ) : (
                <div className="text-center py-8">{children}</div>
            )}
        </Card>
    )
}

export default ChangePasswordForm