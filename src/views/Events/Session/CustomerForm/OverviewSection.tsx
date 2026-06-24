import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller, useWatch } from 'react-hook-form'
import type { FormSectionBaseProps } from './types'
import { apiGetEvents, apiGetEvent } from '@/services/CustomersService'
import { TimeInput } from '@/components/ui'
import { HiOutlineCalendar } from 'react-icons/hi'
import dayjs from 'dayjs'

type OverviewSectionProps = FormSectionBaseProps & {
    disableEvent?: boolean
}

const OverviewSection = ({ control, errors, disableEvent, setValue, getValues }: OverviewSectionProps) => {
    const [events, setEvents] = useState<{ value: string; label: string }[]>([])
    const [loading, setLoading] = useState(false)
    const [eventDetail, setEventDetail] = useState<any>(null)

    const eventId = useWatch({ control, name: 'event' })

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
                // console.error('Failed to load events', err)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchEvents()
        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => {
        if (!eventId) {
            setEventDetail(null)
            return
        }
        let mounted = true
        apiGetEvent(eventId)
            .then((res: any) => {
                if (mounted) {
                    setEventDetail(res)
                    const baseDateStr = res?.start_date || res?.start_datetime
                    if (baseDateStr && getValues && setValue) {
                        const newBaseDate = new Date(baseDateStr)
                        const currentStart = getValues('start_datetime')
                        const currentEnd = getValues('end_datetime')
                        
                        if (currentStart) {
                            const startDateObj = new Date(currentStart)
                            const updatedStart = new Date(newBaseDate)
                            updatedStart.setHours(startDateObj.getHours())
                            updatedStart.setMinutes(startDateObj.getMinutes())
                            updatedStart.setSeconds(0)
                            updatedStart.setMilliseconds(0)
                            setValue('start_datetime', updatedStart.toISOString())
                        }
                        
                        if (currentEnd) {
                            const endDateObj = new Date(currentEnd)
                            const updatedEnd = new Date(newBaseDate)
                            updatedEnd.setHours(endDateObj.getHours())
                            updatedEnd.setMinutes(endDateObj.getMinutes())
                            updatedEnd.setSeconds(0)
                            updatedEnd.setMilliseconds(0)
                            setValue('end_datetime', updatedEnd.toISOString())
                        }
                    }
                }
            })
            .catch(() => {
                if (mounted) setEventDetail(null)
            })
        return () => {
            mounted = false
        }
    }, [eventId, setValue, getValues])

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
                                isDisabled={disableEvent}
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

            {eventDetail && (
                <div className="mt-4 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3">
                    <HiOutlineCalendar className="text-2xl text-primary" />
                    <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Date</div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {dayjs(eventDetail.start_date).format('DD MMMM YYYY')}
                            {eventDetail.end_date && dayjs(eventDetail.end_date).isAfter(dayjs(eventDetail.start_date), 'day') && (
                                <> to {dayjs(eventDetail.end_date).format('DD MMMM YYYY')}</>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Third Row: Start & End Time */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormItem
                    label="Start Time"
                    invalid={Boolean(errors.start_datetime)}
                    errorMessage={errors.start_datetime?.message}
                >
                    <Controller
                        name="start_datetime"
                        control={control}
                        render={({ field }) => (
                            <TimeInput
                                format="24"
                                value={field.value ? new Date(field.value) : null}
                                onChange={(t) => {
                                    if (t) {
                                        const baseDateStr = eventDetail?.start_date || eventDetail?.start_datetime || new Date().toISOString()
                                        const baseDate = new Date(baseDateStr)
                                        const newDateTime = new Date(baseDate)
                                        newDateTime.setHours(t.getHours())
                                        newDateTime.setMinutes(t.getMinutes())
                                        newDateTime.setSeconds(0)
                                        newDateTime.setMilliseconds(0)
                                        field.onChange(newDateTime.toISOString())
                                    } else {
                                        field.onChange('')
                                    }
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="End Time"
                    invalid={Boolean(errors.end_datetime)}
                    errorMessage={errors.end_datetime?.message}
                >
                    <Controller
                        name="end_datetime"
                        control={control}
                        render={({ field }) => (
                            <TimeInput
                                format="24"
                                value={field.value ? new Date(field.value) : null}
                                onChange={(t) => {
                                    if (t) {
                                        const baseDateStr = eventDetail?.start_date || eventDetail?.start_datetime || new Date().toISOString()
                                        const baseDate = new Date(baseDateStr)
                                        const newDateTime = new Date(baseDate)
                                        newDateTime.setHours(t.getHours())
                                        newDateTime.setMinutes(t.getMinutes())
                                        newDateTime.setSeconds(0)
                                        newDateTime.setMilliseconds(0)
                                        field.onChange(newDateTime.toISOString())
                                    } else {
                                        field.onChange('')
                                    }
                                }}
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
