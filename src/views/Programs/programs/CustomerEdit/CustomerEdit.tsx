import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

import {
    apiUpdateProgram,
    apiDeleteProgram,
    apiGetProgramById,
    apiGetParticipantCustomFields,
    apiCreateParticipantCustomField,
    apiUpdateParticipantCustomField,
    apiDeleteParticipantCustomField,
} from '@/services/CustomersService'

import CustomerForm from '../CustomerForm'

import { mutate } from 'swr'

import { useCustomerListStore } from '../ProgramsList/store/customerListStore'

import NoUserFound from '@/assets/svg/NoUserFound'

import {
    TbTrash,
    TbArrowNarrowLeft,
} from 'react-icons/tb'

import {
    useParams,
    useNavigate,
} from 'react-router-dom'

import useSWR from 'swr'

import type { CustomerFormSchema } from '../CustomerForm'
import type { Customer } from '../ProgramsList/types'

const CustomerEdit = () => {
    const { id } = useParams()

    const navigate = useNavigate()

    // =========================
    // GET PROGRAM
    // =========================
    const { data, isLoading } = useSWR(
        id ? ['/programs/programs', id] : null,
        () => apiGetProgramById<Customer>(id!),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const { data: customFieldsResponse, isLoading: customFieldsLoading, mutate: mutateCustomFields } = useSWR(
        id ? ['/programs/participant-custom-fields', { program: id }] : null,
        () => apiGetParticipantCustomFields<any, any>({ program: id! }),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const initialCustomFields = (customFieldsResponse?.results ?? customFieldsResponse ?? [])
        .filter((field: any) => {
            const fieldProgId = field.program && typeof field.program === 'object' ? field.program.id : (field.program || field.program_id)
            return String(fieldProgId) === String(id)
        })
    const isDataLoading = isLoading || customFieldsLoading

    // =========================
    // STATE
    // =========================
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
        useState(false)

    const [isSubmiting, setIsSubmiting] =
        useState(false)

    const tableData = useCustomerListStore(
        (s) => s.tableData,
    )

    const filterData = useCustomerListStore(
        (s) => s.filterData,
    )

    // =========================
    // UPDATE PROGRAM
    // =========================
    const handleFormSubmit = async (
        values: any,
    ) => {
        if (!id) return

        try {
            setIsSubmiting(true)

            const payload = {
                name: values.name,
                code: values.code,
                description: values.description,
                start_date: values.start_date,
                end_date: values.end_date,
            }

            await apiUpdateProgram(id, payload)

            // Sync Custom Fields
            const fieldsToDelete = initialCustomFields.filter(
                (oldField: any) => !values.customFields.some((newField: any) => newField.id === oldField.id)
            )
            const fieldsToCreate = values.customFields.filter(
                (newField: any) => !newField.id
            )
            const fieldsToUpdate = values.customFields.filter(
                (newField: any) => newField.id
            )

            for (const field of fieldsToDelete) {
                if (field.id) {
                    await apiDeleteParticipantCustomField(field.id)
                }
            }

            for (const field of fieldsToCreate) {
                await apiCreateParticipantCustomField({
                    program: id,
                    label: field.label,
                    field_key: field.field_key,
                    field_type: field.field_type,
                    is_required: field.is_required,
                    placeholder: field.placeholder || '',
                    order: field.order,
                    is_active: field.is_active ?? true,
                    options: field.options || [],
                })
            }

            for (const field of fieldsToUpdate) {
                await apiUpdateParticipantCustomField(field.id, {
                    label: field.label,
                    field_type: field.field_type,
                    is_required: field.is_required,
                    placeholder: field.placeholder || '',
                    order: field.order,
                    is_active: field.is_active ?? true,
                    options: field.options || [],
                })
            }

            toast.push(
                <Notification type="success">
                    Program updated successfully!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            await mutate([
                '/api/programs',
                { ...tableData, ...filterData },
            ])
            await mutateCustomFields()

            navigate('/programs')
        } catch (error) {
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
    const getDefaultValues =
        (): CustomerFormSchema => {
            if (data) {
                const item: any = data

                return {
                    name: item.name || '',
                    code: item.code || '',
                    description:
                        item.description || '',
                    start_date:
                        item.start_date || '',
                    end_date: item.end_date || '',
                }
            }

            return {
                name: '',
                code: '',
                description: '',
                start_date: '',
                end_date: '',
            }
        }

    // =========================
    // DELETE PROGRAM
    // =========================
    const handleConfirmDelete = async () => {
        if (!id) return

        try {
            await apiDeleteProgram(id)

            toast.push(
                <Notification type="success">
                    Program deleted successfully!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            await mutate([
                '/api/programs',
                { ...tableData, ...filterData },
            ])

            navigate('/programs')
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

    // =========================
    // HANDLERS
    // =========================
    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        navigate('/programs')
    }

    // =========================
    // UI
    // =========================
    return (
        <>
            {isDataLoading && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound
                        height={280}
                        width={280}
                    />

                    <h3 className="mt-8">
                        Loading...
                    </h3>
                </div>
            )}

            {!isDataLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound
                        height={280}
                        width={280}
                    />

                    <h3 className="mt-8">
                        No program found!
                    </h3>
                </div>
            )}

            {!isDataLoading && data && (
                <>
                    <CustomerForm
                        defaultValues={
                            getDefaultValues()
                        }
                        defaultCustomFields={initialCustomFields}
                        newCustomer={false}
                        onFormSubmit={
                            handleFormSubmit
                        }
                    >
                        <Container>
                            <div className="flex items-center justify-between px-8">
                                {/* BACK */}
                                <Button
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    variant="plain"
                                    icon={
                                        <TbArrowNarrowLeft />
                                    }
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>

                                {/* ACTIONS */}
                                <div className="flex items-center">
                                    <Button
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        customColorClass={() =>
                                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                        }
                                        icon={<TbTrash />}
                                        onClick={
                                            handleDelete
                                        }
                                    >
                                        Delete
                                    </Button>

                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={
                                            isSubmiting
                                        }
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </CustomerForm>

                    {/* DELETE CONFIRM */}
                    <ConfirmDialog
                        isOpen={
                            deleteConfirmationOpen
                        }
                        type="danger"
                        title="Delete Program"
                        onClose={handleCancel}
                        onRequestClose={
                            handleCancel
                        }
                        onCancel={handleCancel}
                        onConfirm={
                            handleConfirmDelete
                        }
                    >
                        <p>
                            Are you sure you want
                            to delete this
                            program? This action
                            can&apos;t be undone.
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default CustomerEdit