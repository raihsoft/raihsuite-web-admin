import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller, useWatch } from 'react-hook-form'
import type { FormSectionBaseProps } from './types'
import {
    apiGetSessionList,
    apiGetEventsList, // participants API
} from '@/services/CustomersService'

type OverviewSectionProps = FormSectionBaseProps

type OptionType = {
    value: string
    label: string
}

const OverviewSection = ({ control, errors }: OverviewSectionProps) => {
    const [sessions, setSessions] = useState<OptionType[]>([])
    const [participants, setParticipants] = useState<OptionType[]>([])

    const [loadingSession, setLoadingSession] = useState(false)
    const [loadingParticipant, setLoadingParticipant] = useState(false)

    /* ---------------- Watch selected session ---------------- */
    const selectedSession = useWatch({
        control,
        name: 'session',
    })

    /* ---------------- Fetch Sessions ---------------- */
    useEffect(() => {
        let mounted = true

        const fetchSessions = async () => {
            setLoadingSession(true)
            try {
                const data = await apiGetSessionList<any, {}>({})
                const list = data?.results ?? data ?? []

                const options: OptionType[] = list.map((s: any) => ({
                    value: String(s.id), // ✅ UUID
                    label:
                        s.title +s.day
                }))

                if (mounted) setSessions(options)
            } catch (err) {
                console.error('Failed to load sessions', err)
            } finally {
                if (mounted) setLoadingSession(false)
            }
        }

        fetchSessions()
        return () => {
            mounted = false
        }
    }, [])

    /* ---------------- Fetch Participants (based on session) ---------------- */
    useEffect(() => {
        if (!selectedSession) {
            setParticipants([])
            return
        }

        let mounted = true

        const fetchParticipants = async () => {
            setLoadingParticipant(true)
            try {
                // 🔴 FIX: use correct param name → session_id
                const data = await apiGetEventsList<
                    any,
                    { session_id: string }
                >({
                    session_id: selectedSession,
                })

                const list = data?.results ?? data ?? []

                const options: OptionType[] = list.map((p: any) => ({
                    value: String(p.id),
                    label:
                        p.participant_name ??
                        p.full_name ??
                        p.email ??
                        'Unnamed Participant',
                }))

                if (mounted) setParticipants(options)
            } catch (err) {
                console.error('Failed to load participants', err)
            } finally {
                if (mounted) setLoadingParticipant(false)
            }
        }

        fetchParticipants()
        return () => {
            mounted = false
        }
    }, [selectedSession])

    return (
        <Card>
            {/* -------- Session -------- */}
            <FormItem
                label="Session"
                invalid={Boolean(errors.session)}
                errorMessage={errors.session?.message}
            >
                <Controller
                    name="session"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={sessions}
                            placeholder={
                                loadingSession
                                    ? 'Loading sessions...'
                                    : 'Select session'
                            }
                            value={
                                sessions.find(
                                    (o) =>
                                        o.value === String(field.value),
                                ) ?? null
                            }
                            onChange={(option) =>
                                field.onChange(option?.value)
                            }
                            isLoading={loadingSession}
                            isClearable={false}
                        />
                    )}
                />
            </FormItem>

            {/* -------- Participant -------- */}
            <FormItem
                label="Participant"
                invalid={Boolean(errors.participant)}
                errorMessage={errors.participant?.message}
            >
                <Controller
                    name="participant"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={participants}
                            placeholder={
                                !selectedSession
                                    ? 'Select session first'
                                    : loadingParticipant
                                      ? 'Loading participants...'
                                      : 'Select participant'
                            }
                            value={
                                participants.find(
                                    (o) =>
                                        o.value === String(field.value),
                                ) ?? null
                            }
                            onChange={(option) =>
                                field.onChange(option?.value)
                            }
                            isLoading={loadingParticipant}
                            isDisabled={!selectedSession}
                            isClearable={false}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default OverviewSection
