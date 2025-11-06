import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    name: string
    email_link: string
    designation: string
    organization: string
   facebook_link: string
   instagram_link: string
   youtube_link: string
   linkedin_link: string
    phone: string
    website_link: string
    img: string
    tenant: string
}

export type AddressFields = {
    country: string
    address: string
    postcode: string
    city: string
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
