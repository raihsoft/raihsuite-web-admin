import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetEvents, apiUpdateEvent, apiDeleteEvent } from '@/services/CustomersService'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
    title: z.string().min(1, { message: 'Title required' }),
    code: z.string().optional(),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
})

type FormValues = z.infer<typeof schema>

const CustomerEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: resp, isLoading, error } = useSWR(
        id ? ['/events/events', { id: id as string }] : null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetEvents<any, { id: string }>(params),
        { revalidateOnFocus: false, revalidateIfStale: false },
    )

    const data = resp?.list?.[0] ?? resp?.results?.[0] ?? (resp && typeof resp === 'object' ? resp : null)

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormValues>({ resolver: zodResolver(schema) })

    useEffect(() => {
        if (data) {
            reset({
                title: data.title || data.name || '',
                code: data.code || data.event_code || '',
                start_date: data.start_date ? new Date(data.start_date) : undefined,
                end_date: data.end_date ? new Date(data.end_date) : undefined,
            })
        }
    }, [data, reset])

    const onSubmit = async (values: FormValues) => {
        if (!id) return
        setIsSubmitting(true)
        try {
            const payload: any = {
                title: values.title,
                code: values.code,
                start_date: values.start_date ? values.start_date.toISOString() : null,
                end_date: values.end_date ? values.end_date.toISOString() : null,
            }

            await apiUpdateEvent(id as string, payload)

            toast.push(<Notification type="success">Event updated!</Notification>, { placement: 'top-center' })
            navigate('/events')
        } catch (err) {
            toast.push(<Notification type="danger">Failed to update event</Notification>, { placement: 'top-center' })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (!id) return
        setDeleteLoading(true)
        try {
            await apiDeleteEvent(id as string)
            toast.push(<Notification type="success">Event deleted!</Notification>, { placement: 'top-center' })
            navigate('/events')
        } catch (err) {
            toast.push(<Notification type="danger">Failed to delete event</Notification>, { placement: 'top-center' })
        } finally {
            setDeleteLoading(false)
            setDeleteConfirmationOpen(false)
        }
    }

    const handleDelete = () => setDeleteConfirmationOpen(true)
    const handleCancel = () => setDeleteConfirmationOpen(false)
    const handleBack = () => history.back()

    if (!isLoading && !data) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <NoUserFound height={280} width={280} />
                <h3 className="mt-8">No event found!</h3>
            </div>
        )
    }

    return (
<>
    {data && (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Form Card */}
            <Container>
                <div className="max-w-6xl mx-auto mt-6 mb-28">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-8">
                        {/* Section Title */}
                        <div>
                            <h4 className="text-xl font-semibold">
                                Event Details
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                                Update event information below
                            </p>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="label font-medium">
                                Event Title
                            </label>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter event title"
                                        className="h-12 text-base"
                                    />
                                )}
                            />
                            {errors.title && (
                                <p className="text-sm text-error mt-1">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Code */}
                        <div>
                            <label className="label font-medium">
                                Event Code
                            </label>
                            <Controller
                                name="code"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Unique event code"
                                        className="h-12 text-base"
                                    />
                                )}
                            />
                            {errors.code && (
                                <p className="text-sm text-error mt-1">
                                    {errors.code.message}
                                </p>
                            )}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="label font-medium">
                                    Start Date
                                </label>
                                <Controller
                                    name="start_date"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value as any}
                                            onChange={(d) =>
                                                field.onChange(d)
                                            }
                                            inputFormat="YYYY-MM-DD HH:mm"
                                            type="date"
                                            className="h-12"
                                        />
                                    )}
                                />
                                {errors.start_date && (
                                    <p className="text-sm text-error mt-1">
                                        {errors.start_date.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label font-medium">
                                    End Date
                                </label>
                                <Controller
                                    name="end_date"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value as any}
                                            onChange={(d) =>
                                                field.onChange(d)
                                            }
                                            inputFormat="YYYY-MM-DD HH:mm"
                                            type="date"
                                            className="h-12"
                                        />
                                    )}
                                />
                                {errors.end_date && (
                                    <p className="text-sm text-error mt-1">
                                        {errors.end_date.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Sticky Bottom Action Bar */}
          {/* Sticky Bottom Action Bar */}
<div className="
    fixed bottom-0 right-0 z-20
    bg-white dark:bg-gray-900
    border-t border-gray-200 dark:border-gray-700
    w-full lg:w-[calc(105%-24.1rem)]
    lg:ml-64
">
    <Container>
        <div className="flex items-center justify-between py-4">
            <Button
                type="button"
                variant="plain"
                icon={<TbArrowNarrowLeft />}
                onClick={handleBack}
            >
                Back
            </Button>

            <div className="flex items-center gap-4">
                <Button
                    type="button"
                    customColorClass={() =>
                        'border-error ring-1 ring-error text-error hover:bg-error/10'
                    }
                    icon={<TbTrash />}
                    onClick={handleDelete}
                >
                    Delete
                </Button>

                <Button
                    variant="solid"
                    type="submit"
                    loading={isSubmitting}
                    className="min-w-[110px]"
                    style={{marginRight:10}}
                >
                    Save 
                </Button>
            </div>
        </div>
    </Container>
</div>

        </form>
    )}

    {/* Delete Confirmation */}
    <ConfirmDialog
        isOpen={deleteConfirmationOpen}
        type="danger"
        title="Remove event"
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        confirmButtonProps={{ loading: deleteLoading }}
    >
        <p>
            Are you sure you want to remove this event? This action
            can&apos;t be undone.
        </p>
    </ConfirmDialog>
</>


    )
}

export default CustomerEdit
