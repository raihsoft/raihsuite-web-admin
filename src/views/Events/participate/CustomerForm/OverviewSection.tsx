import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from './types'
import { apiGetEvents } from '@/services/CustomersService'

type OverviewSectionProps = FormSectionBaseProps & {
    serverPhoneError?: string
    disableEvent?: boolean
}

const OverviewSection = ({
    control,
    errors,
    serverPhoneError,
    disableEvent,
}: OverviewSectionProps) => {
    const [events, setEvents] = useState<{ value: string; label: string }[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let mounted = true

        const fetchEvents = async () => {
            setLoading(true)
            try {
                const data = await apiGetEvents<any, {}>({})
                const list = data?.results ?? data ?? []

                const options = list.map((e: any) => ({
                    value: e.id,
                    label: e.event_title ?? e.title ?? 'Untitled Event',
                }))

                if (mounted) setEvents(options)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchEvents()
        return () => {
            mounted = false
        }
    }, [])

    const phoneError = serverPhoneError || errors.phone?.message
    const isPhoneInvalid = Boolean(phoneError)

    return (
        <Card>
            {/* ================= NAME ================= */}
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="First Name"
                    invalid={!!errors.firstName}
                    errorMessage={errors.firstName?.message}
                >
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="First Name" />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Last Name"
                    invalid={!!errors.lastName}
                    errorMessage={errors.lastName?.message}
                >
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Last Name" />
                        )}
                    />
                </FormItem>
            </div>

            {/* ================= PLACE + REFERRED ================= */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormItem
                    label="Place"
                    invalid={!!errors.place}
                    errorMessage={errors.place?.message}
                >
                    <Controller
                        name="place"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Place" />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Referred By"
                    invalid={!!errors.referred_by}
                    errorMessage={errors.referred_by?.message}
                >
                    <Controller
                        name="referred_by"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Referred By" />
                        )}
                    />
                </FormItem>
            </div>

            {/* ================= PHONE + EVENT ================= */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormItem
                    label="Phone Number *"
                    invalid={isPhoneInvalid}
                    errorMessage={phoneError}
                >
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="tel"
                                placeholder="Enter phone number"
                                invalid={isPhoneInvalid}
                                onChange={(e) => {
                                    const val = e.target.value
                                    const numericVal = val.replace(/\D/g, '')
                                    field.onChange(numericVal)
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Event"
                    invalid={!!errors.event}
                    errorMessage={errors.event?.message}
                >
                    <Controller
                        name="event"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={events}
                                value={
                                    events.find(
                                        (o) =>
                                            String(o.value) ===
                                            String(field.value)
                                    ) ?? null
                                }
                                onChange={(opt) =>
                                    field.onChange(opt?.value)
                                }
                                placeholder={
                                    loading
                                        ? 'Loading events...'
                                        : 'Select Event'
                                }
                                isDisabled={disableEvent}
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* ================= FEE AMOUNT ================= */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormItem
                    label="Fee Amount"
                    invalid={!!errors.fee_amount}
                    errorMessage={errors.fee_amount?.message}
                >
                    <Controller
                        name="fee_amount"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                placeholder="Enter fee amount"
                                min="0"
                                step="0.01"
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* ================= EMAIL ================= */}
            <FormItem
                label="Email"
                invalid={!!errors.email}
                errorMessage={errors.email?.message}
                className="mt-4"
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} type="email" placeholder="Email" />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default OverviewSection
