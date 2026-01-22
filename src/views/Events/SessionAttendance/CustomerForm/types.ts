import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    participant: string
    session: string
    participant_name:string
}

export type CustomerFormSchema = OverviewFields

export type FormSectionBaseProps = {
    control: Control<CustomerFormSchema>
    errors: FieldErrors<CustomerFormSchema>
}
