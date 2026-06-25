import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useTicketList from '../hooks/useTicketList'
import { apiDeleteTicket } from '@/services/CustomersService'
import { TbChecks } from 'react-icons/tb'

const CustomerListSelected = ({ eventId }: { eventId?: string }) => {
    const {
        selectedTicket,
        ticketList,
        mutate,
        ticketListTotal,
        setSelectAllTicket,
    } = useTicketList(eventId)

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleConfirmDelete = async () => {
        setDeleteLoading(true)
        try {
            await Promise.all(
                selectedTicket.map((t) => apiDeleteTicket(t.id!))
            )

            await mutate()
            setSelectAllTicket([])

            toast.push(
                <Notification type="success">
                    Tickets deleted successfully
                </Notification>,
                { placement: 'top-center' },
            )
        } catch (err) {
            toast.push(
                <Notification type="danger">
                    Failed to delete tickets
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteLoading(false)
            setDeleteConfirmationOpen(false)
        }
    }

    return (
        <>
            {selectedTicket.length > 0 && (
                <StickyFooter
                    className=" flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span>
                                {selectedTicket.length > 0 && (
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg text-primary">
                                            <TbChecks />
                                        </span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <span className="heading-text">
                                                {selectedTicket.length}{' '}
                                                Tickets
                                            </span>
                                            <span>selected</span>
                                        </span>
                                    </span>
                                )}
                            </span>

                            <div className="flex items-center">
                                <Button
                                    size="sm"
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    customColorClass={() =>
                                        'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                                    }
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </StickyFooter>
            )}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove tickets"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
                confirmButtonProps={{ loading: deleteLoading }}
            >
                <p>
                    {' '}
                    Are you sure you want to remove these tickets? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerListSelected
