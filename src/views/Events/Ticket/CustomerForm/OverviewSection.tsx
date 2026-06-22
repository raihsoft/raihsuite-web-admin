import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller, useWatch } from 'react-hook-form'
import type { FormSectionBaseProps } from './types'
import { apiGetEvents, apiParticipantList, apiGetSessionList } from '@/services/CustomersService'

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({ control, errors }: OverviewSectionProps) => {
    const [events, setEvents] = useState<{ value: string; label: string }[]>([])
    const [participants, setParticipants] = useState<{ value: string; label: string }[]>([])
    const [eventsLoading, setEventsLoading] = useState(false)
    const [participantsLoading, setParticipantsLoading] = useState(false)
    const [sessions, setSessions] = useState<any[]>([])
    const [sessionsLoading, setSessionsLoading] = useState(false)

    const event_id = useWatch({
        control,
        name: 'event_id'
    })

    useEffect(() => {
        let mounted = true

        const fetchEvents = async () => {
            setEventsLoading(true)
            try {
                const data = await apiGetEvents<any, {}>({})
                const list = data?.results ?? data ?? []

                const options = (list || []).map((e: any) => ({
                    value: e.id ?? String(e.value ?? ''),
                    label:
                        e.event_title ?? e.title ?? e.name ?? e.code ?? 'Untitled Event',
                }))

                if (mounted) setEvents(options)
            } catch (err) {
                // console.error('Failed to load events', err)
            } finally {
                if (mounted) setEventsLoading(false)
            }
        }

        fetchEvents()
        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => {
        let mounted = true

        const fetchParticipants = async () => {
            setParticipantsLoading(true)
            try {
                const data = await apiParticipantList<any, {}>({})
                const list = data?.results ?? data?.list ?? data ?? []

                const options = (list || []).map((p: any) => ({
                    value: p.id ?? p.pk ?? String(p.value ?? ''),
                    label: p.first_name && p.last_name
                        ? `${p.first_name} ${p.last_name}`
                        : p.name ?? p.email ?? p.participant_name ?? 'Unnamed Participant',
                }))

                if (mounted) setParticipants(options)
            } catch (err) {
                // console.error('Failed to load participants', err)
            } finally {
                if (mounted) setParticipantsLoading(false)
            }
        }

        fetchParticipants()
        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => {
        let mounted = true

        const fetchSessions = async () => {
            setSessionsLoading(true)

            try {
                const data = await apiGetSessionList<any, {}>({})
                const list = data?.results ?? data ?? []

                if (mounted) {
                    setSessions(list)
                }
            } catch (err) {
                console.error(err)
            } finally {
                if (mounted) {
                    setSessionsLoading(false)
                }
            }
        }

        fetchSessions()

        return () => {
            mounted = false
        }
    }, [])

    // const sessionOptions = sessions
    //     .filter(
    //         (session: any) =>
    //             String(session.event) === String(event_id) ||
    //             String(session.event_id) === String(event_id)
    //     )
    //     .map((session: any) => ({
    //         value: session.id,
    //         label:
    //             session.title ||
    //             session.session_title ||
    //             session.name ||
    //             'Unnamed Session',
    //     }))

    return (
        <Card>
            {/* Events & Participants */}
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Event"
                    invalid={Boolean(errors.event_id)}
                    errorMessage={errors.event_id?.message}
                >
                    <Controller
                        name="event_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={events}
                                placeholder={
                                    eventsLoading
                                        ? 'Loading events...'
                                        : events.length === 0
                                            ? 'No events available'
                                            : 'Select Event'
                                }
                                value={
                                    events.find(
                                        (option) => option.value === field.value
                                    ) || null
                                }
                                onChange={(option) =>
                                    field.onChange(option?.value || '')
                                }
                                isClearable={true}
                                isLoading={eventsLoading}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Participant"
                    invalid={Boolean(errors.participant_id)}
                    errorMessage={errors.participant_id?.message}
                >
                    <Controller
                        name="participant_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={participants}
                                placeholder={
                                    participantsLoading
                                        ? 'Loading participants...'
                                        : participants.length === 0
                                            ? 'No participants available'
                                            : 'Select Participant'
                                }
                                value={
                                    participants.find(
                                        (option) => option.value === field.value
                                    ) || null
                                }
                                onChange={(option) =>
                                    field.onChange(option?.value || '')
                                }
                                isClearable={true}
                                isLoading={participantsLoading}
                            />
                        )}
                    />
                </FormItem>
                {/* <FormItem label="Session">
    <Controller
        name="session_id"
        control={control}
        render={({ field }) => (
            <Select
                options={sessionOptions}
                placeholder={
                    sessionsLoading
                        ? 'Loading sessions...'
                        : !event_id
                          ? 'Select Event First'
                          : 'Select Session'
                }
                value={
                    sessionOptions.find(
                        (option) => option.value === field.value
                    ) || null
                }
                onChange={(option) =>
                    field.onChange(option?.value || '')
                }
                isClearable
                isLoading={sessionsLoading}
                isDisabled={!event_id}
            />
        )}
    />
</FormItem> */}
            </div>
        </Card>
    )
}

export default OverviewSection
