import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from './types'
import { apiGetEvents } from '@/services/CustomersService'

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({ control, errors }: OverviewSectionProps) => {
    const [events, setEvents] = useState<{ value: string; label: string }[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let mounted = true

        const fetchEvents = async () => {
            setLoading(true)
            try {
                const data = await apiGetEvents<any, {}>({})
                const list = data?.results ?? data ?? []

                // Map backend events properly
                const options = (list || []).map((e: any) => ({
                    value: e.id ?? e.code ?? String(e.value ?? ''),
                    label: e.event_title ?? e.title ?? e.name ?? 'Untitled Event',
                }))

                if (mounted) setEvents(options)
            } catch (err) {
                console.error('Failed to load events', err)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchEvents()
        return () => { mounted = false }
    }, [])

    return (
        <Card>
            {/* First Row: First Name & Last Name */}
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="First Name"
                    invalid={Boolean(errors.firstName)}
                    errorMessage={errors.firstName?.message}
                >
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} type="text" placeholder="First Name" />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Last Name"
                    invalid={Boolean(errors.lastName)}
                    errorMessage={errors.lastName?.message}
                >
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} type="text" placeholder="Last Name" />
                        )}
                    />
                </FormItem>
            </div>

            {/* Second Row: Place & Referred By */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormItem
                    label="Place"
                    invalid={Boolean(errors.place)}
                    errorMessage={errors.place?.message}
                >
                    <Controller
                        name="place"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} type="text" placeholder="Place" />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Referred By"
                    invalid={Boolean(errors.referred_by)}
                    errorMessage={errors.referred_by?.message}
                >
                    <Controller
                        name="referred_by"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} type="text" placeholder="Referred By" />
                        )}
                    />
                </FormItem>
            </div>

            {/* Third Row: Phone & Event */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormItem
                    label="Phone"
                    invalid={Boolean(errors.phone)}
                    errorMessage={errors.phone?.message}
                >
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} type="text" placeholder="Phone" />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Event"
                    invalid={Boolean(errors.event)}
                    errorMessage={errors.event?.message}
                >
                    <Controller
                        name="event"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={events}
                                placeholder={
                                    loading
                                        ? 'Loading events...'
                                        : events.length === 0
                                        ? 'No events available'
                                        : 'Select Event'
                                }
                                value={events.find(
                                    (option) => option.value === String(field.value)
                                ) ?? null}
                                onChange={(option) => field.onChange(option?.value)}
                                isClearable={false}
                                isLoading={loading}
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Fourth Row: Email */}
            <FormItem
                label="Email"
                invalid={Boolean(errors.email)}
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
