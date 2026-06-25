import type { Control, FieldErrors } from 'react-hook-form'

export type CustomerFormSchema = {
    program: string
    first_name: string
    last_name: string
    email: string
    phone: string
    place: string
    custom_data?: Record<string, any>
    // Template compatibility fields
    firstName?: string
    lastName?: string
    dialCode?: string
    phoneNumber?: string
    img?: string
    country?: string
    address?: string
    postcode?: string
    city?: string
    tags?: Array<{ value: string; label: string }>
    banAccount?: boolean
    accountVerified?: boolean
}

export type FormSectionBaseProps = {
    control: Control<CustomerFormSchema>
    errors: FieldErrors<CustomerFormSchema>
}
