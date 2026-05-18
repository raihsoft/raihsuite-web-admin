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
        ['/api/programs', id as string],
        ([_, idParam]) =>
            apiGetProgramById<Customer>(
                idParam as string,
            ),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

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
        values: CustomerFormSchema,
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
            {!isLoading && !data && (
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

            {!isLoading && data && (
                <>
                    <CustomerForm
                        defaultValues={
                            getDefaultValues()
                        }
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