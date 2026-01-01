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
                const list = data?.results ?? data?.list ?? data ?? []
                const options = (list || []).map((e: any) => ({ value: String(e.id), label: e.name || e.title || e.slug || String(e.id) }))
                if (mounted) setEvents(options)
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Failed to load events', err)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchEvents()
        return () => {
            mounted = false
        }
    }, [])

    return (
        <Card>
            {/* <h4 className="mb-6">Overview</h4> */}
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
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="First Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="User Name"
                    invalid={Boolean(errors.lastName)}
                    errorMessage={errors.lastName?.message}
                >
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Last Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormItem label="Place" invalid={Boolean(errors.place)} errorMessage={errors.place?.message}>
                    <Controller
                        name="place"
                        control={control}
                        render={({ field }) => (
                            <Input type="text" autoComplete="off" placeholder="Place" {...field} />
                        )}
                    />
                </FormItem>

                <FormItem label="Referenced By" invalid={Boolean(errors.referencedBy)} errorMessage={errors.referencedBy?.message}>
                    <Controller
                        name="referencedBy"
                        control={control}
                        render={({ field }) => (
                            <Input type="text" autoComplete="off" placeholder="Referenced By" {...field} />
                        )}
                    />
                </FormItem>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormItem label="Phone" invalid={Boolean(errors.phone)} errorMessage={errors.phone?.message}>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input type="text" autoComplete="off" placeholder="Phone" {...field} />
                        )}
                    />
                </FormItem>

                <FormItem label="Event" invalid={Boolean(errors.event)} errorMessage={errors.event?.message}>
                    <Controller
                        name="event"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={events}
                                placeholder="Select event"
                                isClearable={false}
                                value={events.filter((option) => option.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                                isLoading={loading}
                            />
                        )}
                    />
                </FormItem>
            </div>
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
                            autoComplete="off"
                            placeholder="Email"
                            {...field}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default OverviewSection
