import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    passwordHint?: string | ReactNode
    setMessage?: (message: string) => void
}

type SignInFormSchema = {
    email: string
    password: string
}

const validationSchema: ZodType<SignInFormSchema> = z.object({
    email: z
        .string({ required_error: 'Please enter your email' })
        .min(1, { message: 'Please enter your email' }),
    password: z
        .string({ required_error: 'Please enter your password' })
        .min(1, { message: 'Please enter your password' }),
})

const SignInForm = (props: SignInFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { disableSubmit = false, className, setMessage, passwordHint } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
        setError,
        clearErrors,
    } = useForm<SignInFormSchema>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const { signIn } = useAuth()

    const onSignIn = async (values: SignInFormSchema) => {
        const { email, password } = values

        if (disableSubmit) return

        setSubmitting(true)
        // clear previous form errors and messages
        try {
            clearErrors()
        } catch (err) {
            // ignore
        }
        setMessage?.('')

        try {
            const result = await signIn({ email, password })

            if (result?.status === 'failed') {
                const msg = result.message || ''

                if (/user not found/i.test(msg) || /no user/i.test(msg)) {
                    setError('email', { type: 'manual', message: 'User not found' })
                } else if (/wrong password|password/i.test(msg)) {
                    setError('password', { type: 'manual', message: ' wrong username or password — please try again' })
                } else if (/invalid credentials/i.test(msg)) {
                    // Ambiguous backend message — cannot determine if user missing or password wrong
                    setMessage?.('User not found or wrong password')
                } else {
                    // network / server / fallback messages
                    setMessage?.(msg)
                }
            } else if (result?.status === 'success') {
                // success - AuthProvider already handled tokens and user state
            }
        } catch (err) {
            // Unexpected errors — show generic message but do not reload
            setMessage?.('Sign in failed. Please try again.')
            // console.error('Sign in error', err)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <Form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    // call react-hook-form submit handler explicitly
                    void handleSubmit(onSignIn)()
                }}
            >
                <FormItem
                    label="Email"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder="Email"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                    className={`${passwordHint ? 'mb-0' : ''} ${errors.password?.message ? 'mb-8' : ''}`.trim()}
                >
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <PasswordInput
                                type="text"
                                placeholder="Password"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                {passwordHint}
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                    className="py-3 text-base"
                >
                    {isSubmitting ? 'Signing in...' : 'Login'}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm
