import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from './types'
import { apiGetEvents } from '@/services/CustomersService'
import { DatePicker } from '@/components/ui'

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
                    label:
                        e.event_title ?? e.title ?? e.name ?? 'Untitled Event',
                }))

                if (mounted) setEvents(options)
            } catch (err) {
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
            {/* First Row: Event & Event Title */}
            <div className="grid md:grid-cols-2 gap-4">
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
                                value={
                                    events.find(
                                        (option) =>
                                            option.value ===
                                            String(field.value),
                                    ) ?? null
                                }
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                                isClearable={false}
                                isLoading={loading}
                            />
                        )}
                    />
                </FormItem>

                  <FormItem
                    label="Title"
                    invalid={Boolean(errors.title)}
                    errorMessage={errors.title?.message}
                >
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} type="text" placeholder="Title" />
                        )}
                    />
                </FormItem>
            </div>



            {/* Third Row: Start & End Date */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormItem
                    label="Start Date"
                    invalid={Boolean(errors.start_datetime)}
                    errorMessage={errors.start_datetime?.message}
                >
                    <Controller
                        name="start_datetime"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={field.value ? new Date(field.value) : ''}
                                onChange={(d) => {
                                    if (d) {
                                        const dateString = d instanceof Date 
                                            ? d.toISOString().slice(0, 16).replace('T', ' ')
                                            : String(d)
                                        field.onChange(dateString)
                                    }
                                }}
                                inputFormat="YYYY-MM-DD HH:mm"
                                type="date"
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="End Date"
                    invalid={Boolean(errors.end_datetime)}
                    errorMessage={errors.end_datetime?.message}
                >
                    <Controller
                        name="end_datetime"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={field.value ? new Date(field.value) : ''}
                                onChange={(d) => {
                                    if (d) {
                                        const dateString = d instanceof Date 
                                            ? d.toISOString().slice(0, 16).replace('T', ' ')
                                            : String(d)
                                        field.onChange(dateString)
                                    }
                                }}
                                inputFormat="YYYY-MM-DD HH:mm"
                                type="date"
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Fourth Row: Day & Speaker */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              

                <FormItem
                    label="Speaker"
                    invalid={Boolean(errors.speaker)}
                    errorMessage={errors.speaker?.message}
                >
                    <Controller
                        name="speaker"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} type="text" placeholder="Speaker" />
                        )}
                    />
                </FormItem>

<FormItem
                    label="Location"
                    invalid={Boolean(errors.location)}
                    errorMessage={errors.location?.message}
                >
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} type="text" placeholder="Location" />
                        )}
                    />
                </FormItem>

            </div>

            {/* Fifth Row: Location */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                
            </div>
        </Card>
    )
}

export default OverviewSection
