import type { Control, FieldErrors, UseFormSetValue, UseFormGetValues } from 'react-hook-form'

export type OverviewFields = {
    event_title: string
    title: string
    start_datetime: string
    end_datetime: string
    day: string
    speaker: string
    location: string
    event: string
}

export type CustomerFormSchema = OverviewFields

export type FormSectionBaseProps = {
    control: Control<CustomerFormSchema>
    errors: FieldErrors<CustomerFormSchema>
    setValue?: UseFormSetValue<CustomerFormSchema>
    getValues?: UseFormGetValues<CustomerFormSchema>
}
