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
    confirmPassword: string
}

const validationSchema: ZodType<ChangePasswordFormSchema> = z
    .object({
        current_password: z
            .string({ required_error: 'Please enter your current password' })
            .min(1, 'Current password is required'),
        new_password: z
            .string({ required_error: 'Please enter your new password' })
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string({
            required_error: 'Confirm Password Required',
        }),
    })
    .refine((data) => data.new_password === data.confirmPassword, {
        message: 'Your passwords do not match',
        path: ['confirmPassword'],
    })
    .refine((data) => data.current_password !== data.new_password, {
        message: 'New password must be different from current password',
        path: ['new_password'],
    })

const ChangePasswordForm = (props: ChangePasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState(false)

    const { className, setMessage, setChangeComplete, changeComplete, children } =
        props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ChangePasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onChangePassword = async (values: ChangePasswordFormSchema) => {
        const { current_password, new_password } = values

        try {
            setSubmitting(true)
            const resp = await apiChangePassword<boolean>({
                current_password,
                new_password,
            })
            if (resp) {
                setChangeComplete?.(true)
            }
        } catch (error) {
            setMessage?.(
                typeof error === 'string'
                    ? error
                    : 'Failed to change password',
            )
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
                                invalid={!!errors.confirmPassword}
                                errorMessage={errors.confirmPassword?.message}
                            >
                                <Controller
                                    name="confirmPassword"
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
