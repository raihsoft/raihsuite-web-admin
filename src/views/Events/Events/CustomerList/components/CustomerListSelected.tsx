import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import useCustomerList from '../hooks/useCustomerList'
import { apiDeleteEvent } from '@/services/CustomersService' // <-- your delete API
import { TbChecks } from 'react-icons/tb'

const CustomerListSelected = () => {
    const { selectedCustomer, setSelectAllCustomer, mutate } = useCustomerList()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleDelete = () => setDeleteConfirmationOpen(true)
    const handleCancel = () => setDeleteConfirmationOpen(false)

    const handleConfirmDelete = async () => {
        if (selectedCustomer.length === 0) return

        setDeleteLoading(true)
        try {
            await Promise.all(
                selectedCustomer.map((c) => apiDeleteEvent(c.id))
            )

            await mutate()
            setSelectAllCustomer([])

            toast.push(
                <Notification type="success">Participants deleted!</Notification>,
                { placement: 'top-center' }
            )
        } catch (err) {
            toast.push(
                <Notification type="danger">Failed to delete participants</Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setDeleteLoading(false)
            setDeleteConfirmationOpen(false)
        }
    }

    if (selectedCustomer.length === 0) return null

    return (
        <>
            <StickyFooter
                className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
            >
                <div className="flex items-center gap-3">
                    <TbChecks className="text-primary text-lg" />
                    <span>{selectedCustomer.length} participants selected</span>
                </div>
                <div>
                    <Button
                        size="sm"
                        customColorClass={() =>
                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                        }
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </StickyFooter>

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove participants"
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
                confirmButtonProps={{ loading: deleteLoading }}
            >
                <p>Are you sure you want to remove these participants? This action cannot be undone.</p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerListSelected
