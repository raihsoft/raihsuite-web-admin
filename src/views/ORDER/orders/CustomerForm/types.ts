import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    order_by_name: string
    mobile: string
    designation: string
    organization: string
    organization_name: string
    quantity: string
    delivery_place: string
    zone: string
    zone_name: string
    order_type: string
    is_paid?: boolean
    order_type_display: string
    club_name: string
    order_number: string
    status: string
    payment_note: string
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
