import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { apiCreateEvent } from '@/services/CustomersService'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { mutate } from 'swr'
import { useCustomerListStore } from '../CustomerList/store/customerListStore'

// ✅ Validation schema
const schema = z
    .object({
        title: z.string().min(1, { message: 'Title required' }),
        code: z.string().min(1, { message: 'Code required' }),
        start_date: z.date({ required_error: 'Start date required' }),
        end_date: z.date({ required_error: 'End date required' }),
    })
    .refine(
        (data) => data.end_date > data.start_date,
        {
            message: 'End date  must be after start date',
            path: ['end_date'], // 👈 shows error under End Date field
        }
    )


type FormValues = z.infer<typeof schema>

const EventCreate = () => {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)

    const {
        handleSubmit,
        control,
        formState: { errors },
        setError,
        clearErrors,
        setFocus,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            code: '',
            start_date: null as unknown as Date,
            end_date: null as unknown as Date,
        },
    })

    // ✅ Submit handler
    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true)
        clearErrors('code')

        const payload = {
            title: values.title,
            code: values.code,
            start_date: values.start_date.toISOString(),
            end_date: values.end_date.toISOString(),
        }

        console.log('📤 Sending payload:', payload)

        try {
            const response = await apiCreateEvent(payload)
            console.log('✅ API Success:', response)

            const { tableData, filterData } = useCustomerListStore.getState()
            await mutate(['/api/events/events', { ...tableData, ...filterData }])

            toast.push(
                <Notification type="success">
                    Event created successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            navigate('/events')
        } catch (err: any) {
            console.log('❌ API ERROR:', err)
            const errorData = err?.response?.data

            if (errorData?.code) {
                const codeErrorMessage = Array.isArray(errorData.code)
                    ? errorData.code[0]
                    : errorData.code

                setError(
                    'code',
                    { type: 'server', message: codeErrorMessage },
                    { shouldFocus: true }
                )

                setTimeout(() => {
                    setFocus('code')
                }, 100)

                return
            }

            const errorMessage =
                errorData?.message ||
                errorData?.detail ||
                'Failed to create event'

            toast.push(
                <Notification type="danger">{errorMessage}</Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    // ✅ Discard handler
    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="warning">Changes discarded!</Notification>,
            { placement: 'top-center' }
        )
        navigate('/events')
    }

    return (
        <>
           <form onSubmit={handleSubmit(onSubmit)}>
  {/* Added proper padding bottom */}
  <Container className="pb-[22rem]">
    <Card>
      <h4 className="mb-6">Create Event</h4>

      <div className="grid md:grid-cols-2 gap-4">
        <FormItem
          label="Title"
          invalid={Boolean(errors.title)}
          errorMessage={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter event title" />
            )}
          />
        </FormItem>

        <FormItem
          label="Code"
          invalid={Boolean(errors.code)}
          errorMessage={errors.code?.message}
        >
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Event code"
                invalid={Boolean(errors.code)}
              />
            )}
          />
        </FormItem>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <FormItem
          label="Start Date"
          invalid={Boolean(errors.start_date)}
          errorMessage={errors.start_date?.message}
        >
          <Controller
            name="start_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={(d) => field.onChange(d)}
                inputFormat="YYYY-MM-DD HH:mm"
                type="date"
              />
            )}
          />
        </FormItem>

        <FormItem
          label="End Date"
          invalid={Boolean(errors.end_date)}
          errorMessage={errors.end_date?.message}
        >
          <Controller
            name="end_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={(d) => field.onChange(d)}
                inputFormat="YYYY-MM-DD HH:mm"
                type="date"
              />
            )}
          />
        </FormItem>
      </div>
    </Card>
  </Container>

  {/* Sticky Bottom Bar */}
  <BottomStickyBar className="mt-10 bg-white border-t border-gray-200 py-3">
    <Container>
      <div className="flex items-center justify-between px-8">
        <span />
        <div className="flex items-center">
          <Button
            type="button"
            className="ltr:mr-3 rtl:ml-3"
            customColorClass={() =>
              'border-error ring-1 ring-error text-error bg-transparent hover:border-error hover:ring-error hover:text-error'
            }
            icon={<TbTrash />}
            onClick={() => setDiscardConfirmationOpen(true)}
          >
            Discard
          </Button>

          <Button variant="solid" type="submit" loading={isSubmitting}>
            Create
          </Button>
        </div>
      </div>
    </Container>
  </BottomStickyBar>
</form>

            {/* Confirm Discard Modal */}
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={() => setDiscardConfirmationOpen(false)}
                onCancel={() => setDiscardConfirmationOpen(false)}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want to discard this? This action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default EventCreate
