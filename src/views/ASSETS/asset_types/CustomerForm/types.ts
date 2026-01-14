import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    name: string
    code: string
    file_extension: string
    description: string
}

export type AddressFields = {
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
}

export type ProfileImageFields = {
    img: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type AccountField = {
    banAccount?: boolean
    accountVerified?: boolean
}

export type CustomerFormSchema = OverviewFields &
    AddressFields &
    ProfileImageFields &
    TagsFields &
    AccountField

export type FormSectionBaseProps = {
    control: Control<CustomerFormSchema>
    errors: FieldErrors<CustomerFormSchema>
}
