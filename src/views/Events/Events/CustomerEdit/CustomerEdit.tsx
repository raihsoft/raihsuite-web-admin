import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    apiGetEvents,
    apiUpdateEvent,
    apiDeleteEvent,
} from '@/services/CustomersService'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'

/* ---------------- schema ---------------- */
const schema = z.object({
    title: z.string().min(1, { message: 'Title required' }),
    code: z.string().optional(),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    fee_amount: z.coerce.number().optional(), // ✅ added fee_amount
})

type FormValues = z.infer<typeof schema>

/* ---------------- component ---------------- */
const CustomerEdit = () => {
    const { id: code } = useParams() // URL param is event code
    const navigate = useNavigate()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    /* ---------------- fetch events ---------------- */
    const { data: resp, isLoading } = useSWR(
        code ? ['/events/events', { code }] : null,
        ([_, params]) => apiGetEvents<any, { code: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        }
    )

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    })

    /* ---------------- populate form when data changes ---------------- */
    useEffect(() => {
        if (!resp) return

        // Find the event object in API response
        const event =
            resp.list?.find((e: any) => e.code === code) ??
            resp.results?.find((e: any) => e.code === code) ??
            (resp.code === code ? resp : null)

        if (!event) return

        reset({
            title: event.title || '',
            code: event.code || '',
            start_date: event.start_date ? new Date(event.start_date) : undefined,
            end_date: event.end_date ? new Date(event.end_date) : undefined,
            fee_amount: event.fee_amount ? Number(event.fee_amount) : 0, // ✅ map fee_amount
        })
    }, [resp, code, reset])

    /* ---------------- submit ---------------- */
    const onSubmit = async (values: FormValues) => {
        if (!code) return
        setIsSubmitting(true)

        try {
            await apiUpdateEvent(code, {
                title: values.title,
                code: values.code,
                start_date: values.start_date ? values.start_date.toISOString() : null,
                end_date: values.end_date ? values.end_date.toISOString() : null,
                fee_amount: values.fee_amount, // ✅ include fee_amount
            })

            toast.push(
                <Notification type="success">Event updated!</Notification>,
                { placement: 'top-center' }
            )
            navigate('/events')
        } catch {
            toast.push(
                <Notification type="danger">Failed to update event</Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    /* ---------------- delete ---------------- */
    const handleConfirmDelete = async () => {
        if (!code) return
        setDeleteLoading(true)

        try {
            await apiDeleteEvent(code)
            toast.push(
                <Notification type="success">Event deleted!</Notification>,
                { placement: 'top-center' }
            )
            navigate('/events')
        } finally {
            setDeleteLoading(false)
            setDeleteConfirmationOpen(false)
        }
    }

    /* ---------------- no event found ---------------- */
    if (!isLoading && (!resp || (!resp.list && !resp.results && !resp.code))) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <NoUserFound height={280} width={280} />
                <h3 className="mt-8">No event found!</h3>
            </div>
        )
    }

    /* ---------------- UI ---------------- */
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="pb-24">
                    <Container>
                        <div className="max-w-6xl mx-auto mt-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-8">
                                <div>
                                    <h4 className="text-xl font-semibold">Event Details</h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Update event information below
                                    </p>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="label font-medium">Event Title</label>
                                    <Controller
                                        name="title"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} className="h-12" placeholder="Enter event title" />
                                        )}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-error mt-1">{errors.title.message}</p>
                                    )}
                                </div>

                                {/* Code */}
                                <div>
                                    <label className="label font-medium">Event Code</label>
                                    <Controller
                                        name="code"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} className="h-12" placeholder="Unique event code" />
                                        )}
                                    />
                                </div>

                                {/* Fee Amount */}
                                <div>
                                    <label className="label font-medium">Fee Amount</label>
                                    <Controller
                                        name="fee_amount"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                className="h-12"
                                                placeholder="Enter fee amount"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="label font-medium">Start Date</label>
                                        <Controller
                                            name="start_date"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    value={field.value as any}
                                                    onChange={field.onChange}
                                                    type="date"
                                                    className="h-12"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <label className="label font-medium">End Date</label>
                                        <Controller
                                            name="end_date"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    value={field.value as any}
                                                    onChange={field.onChange}
                                                    type="date"
                                                    className="h-12"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>

                {/* ================= FIXED BOTTOM BAR ================= */}
                <div className="fixed bottom-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 w-full lg:left-64 lg:w-[calc(100%-16rem)]">
                    <Container>
                        <div className="flex items-center justify-between py-4">
                            <Button variant="plain" icon={<TbArrowNarrowLeft />} onClick={() => navigate(-1)}>
                                Back
                            </Button>

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    icon={<TbTrash />}
                                    onClick={() => setDeleteConfirmationOpen(true)}
                                    customColorClass={() =>
                                        'border-error ring-1 ring-error text-error hover:bg-error/10'
                                    }
                                >
                                    Delete
                                </Button>

                                <Button variant="solid" type="submit" loading={isSubmitting} className="min-w-[110px]">
                                    Save
                                </Button>
                            </div>
                        </div>
                    </Container>
                </div>
            </form>

            {/* ================= CONFIRM DELETE ================= */}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove event"
                onClose={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleConfirmDelete}
                confirmButtonProps={{ loading: deleteLoading }}
            >
                Are you sure you want to remove this event? This action can’t be undone.
            </ConfirmDialog>
        </>
    )
}

export default CustomerEdit
