import { useState } from 'react'
import { mutate as globalMutate } from 'swr'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbChecks } from 'react-icons/tb'
import useCustomerList from '../hooks/useCustomerList'
import { apiDeleteEvent } from '@/services/CustomersService'

const CustomerListSelected = () => {
    const {
        selectedCustomer,
        setSelectAllCustomer,
        mutate,
        customerList, // get the list
    } = useCustomerList()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    if (!selectedCustomer || selectedCustomer.length === 0) return null

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
            selectedCustomer.map((item) => apiDeleteEvent(item.code))
        )

        // ✅ Force SWR to re-fetch all keys from the server (hard refresh)
        await globalMutate(() => true, undefined, { revalidate: true })

        // ✅ Clear selection
        setSelectAllCustomer([])

        toast.push(
            <Notification type="success">
                Events deleted successfully!
            </Notification>,
            { placement: 'top-center' }
        )
    } catch (error) {
        console.error(error)
        toast.push(
            <Notification type="danger">
                Failed to delete events
            </Notification>,
            { placement: 'top-center' }
        )
    } finally {
        setDeleteLoading(false)
        setDeleteConfirmationOpen(false)
    }
}





    return (
<div className="pb-12"> 
    <>
    <StickyFooter
        className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
        stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
        defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
    >
        {/* Fade only the inner content */}
        <div
            className={`w-full transition-opacity duration-150 ${
                selectedCustomer.length > 0
                    ? 'opacity-100 visible'
                    : 'opacity-0 invisible pointer-events-none'
            }`}
        >
            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    <span>
                        {selectedCustomer.length > 0 && (
                            <span className="flex items-center gap-2">
                                <span className="text-lg text-primary">
                                    <TbChecks />
                                </span>
                                <span className="font-semibold flex items-center gap-1">
                                    <span className="heading-text">
                                        {selectedCustomer.length} Events
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
        </div>
    </StickyFooter>

    <ConfirmDialog
        isOpen={deleteConfirmationOpen}
        type="danger"
        title="Remove participants"
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        confirmButtonProps={{ loading: deleteLoading }}
    >
        <p>
            Are you sure you want to remove these customers? This action
            can&apos;t be undone.
        </p>
    </ConfirmDialog>
</>
</div>



    )
}

export default CustomerListSelected
