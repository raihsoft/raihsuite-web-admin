import { useState, useEffect } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    apigetProgramparticipantbyid,
    apiUpdateProgramparticipant,
    apiDeleteProgramparticipant,
    apiGetProgramList,
} from '@/services/CustomersService'
import CustomerForm from '../CustomerForm'
import { mutate } from 'swr'
import { useCustomerListStore } from '../ParticipantList/store/customerListStore'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import useSWR from 'swr'
import type { CustomerFormSchema } from '../CustomerForm'

type Participant = {
    id: string | number
    program: string | number
    program_id?: string | number
    program_name?: string
    first_name: string
    last_name: string
    participant_name?: string
    email: string
    phone: string
    place: string
    custom_data?: Record<string, any>
}

type ProgramResponse = {
    results: { id: string | number; name: string }[]
}

const CustomerEdit = () => {
    const { id } = useParams()

    const navigate = useNavigate()
    const location = useLocation()
    const from = (location.state as any)?.from || '/programs-participants'

    // =========================
    // GET PARTICIPANT
    // =========================
    const { data, isLoading } = useSWR(
        ['/api/programparticipants', id as string],
        ([_, idParam]) =>
            apigetProgramparticipantbyid<Participant, Record<string, unknown>>(idParam as string, {}),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    // =========================
    // PROGRAM DROPDOWN
    // =========================
    const [programOptions, setProgramOptions] = useState<{ label: string; value: string }[]>([])

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await apiGetProgramList<ProgramResponse, Record<string, unknown>>({})

                // console.log('📥 PROGRAM API:', res)

                const results = res?.results || []

                const formatted = results.map((item: { name: string; id: string | number }) => ({
                    label: item.name,
                    value: String(item.id),
                }))

                // console.log('🟢 PROGRAM OPTIONS:', formatted)

                setProgramOptions(formatted)
            } catch (err) {
                // console.log('❌ PROGRAM LOAD ERROR:', err)
            }
        }

        fetchPrograms()
    }, [])

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
        useState(false)

    const [isSubmiting, setIsSubmiting] = useState(false)

    const tableData = useCustomerListStore((s) => s.tableData)

    const filterData = useCustomerListStore((s) => s.filterData)

    // =========================
    // UPDATE
    // =========================
    const handleFormSubmit = async (values: CustomerFormSchema) => {
        if (!id) return

        // console.log('📝 UPDATE VALUES:', values)

        try {
            setIsSubmiting(true)

            const payload = {
                program: values.program,
                first_name: values.first_name,
                last_name: values.last_name || '',
                email: values.email,
                phone: values.phone,
                place: values.place,
                custom_data: values.custom_data || {},
            }

            // console.log('🚀 UPDATE PAYLOAD:', payload)

            await apiUpdateProgramparticipant(id as string, payload)

            toast.push(
                <Notification type="success">
                    Participant updated successfully!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            await mutate([
                '/api/programparticipants',
                { ...tableData, ...filterData },
            ])

            navigate(from)
        } catch (error: any) {
            // console.log('❌ UPDATE ERROR:', error)

            toast.push(
                <Notification type="danger">
                    Update failed!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    // =========================
    // DEFAULT VALUES
    // =========================
    const getDefaultValues = (): CustomerFormSchema => {
        if (data) {
            // console.log('📦 EDIT DATA:', data)
            let parsedCustomData = data.custom_data || {}
            if (typeof parsedCustomData === 'string') {
                try {
                    parsedCustomData = JSON.parse(parsedCustomData)
                } catch {
                    parsedCustomData = {}
                }
            }

            return {
                program: String(data.program || data.program_id || ''),
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                email: data.email || '',
                phone: data.phone || '',
                place: data.place || '',
                custom_data: parsedCustomData,
            }
        }

        return {
            program: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            place: '',
        }
    }

    // =========================
    // DELETE
    // =========================
    const handleConfirmDelete = async () => {
        if (!id) return

        try {
            await apiDeleteProgramparticipant(id as string)

            toast.push(
                <Notification type="success">
                    Participant deleted!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            await mutate([
                '/api/programparticipants',
                { ...tableData, ...filterData },
            ])

            navigate(from)
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    Delete failed!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        } finally {
            setDeleteConfirmationOpen(false)
        }
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        navigate(from)
    }

    return (
        <>
            {!isLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">No participant found!</h3>
                </div>
            )}

            {!isLoading && data && (
                <>
                    <CustomerForm
                        defaultValues={getDefaultValues()}
                        newCustomer={false}
                        onFormSubmit={handleFormSubmit}
                        programOptions={programOptions}
                    >
                        <Container>
                            <div className="flex items-center justify-between px-8">
                                <Button
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>

                                <div className="flex items-center">
                                    <Button
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        customColorClass={() =>
                                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                        }
                                        icon={<TbTrash />}
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>

                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmiting}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </CustomerForm>

                    <ConfirmDialog
                        isOpen={deleteConfirmationOpen}
                        type="danger"
                        title={data ? `Delete "${data.participant_name || `${data.first_name || ''} ${data.last_name || ''}`.trim()}"` : 'Delete Participant'}
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        <p>
                            Are you sure you want to delete "{data ? (data.participant_name || `${data.first_name || ''} ${data.last_name || ''}`.trim()) : ''}"?
                            This action can&apos;t be undone.
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default CustomerEdit