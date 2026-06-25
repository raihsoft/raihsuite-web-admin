import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import RichTextEditor from '@/components/shared/RichTextEditor'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useCustomerList from '../hooks/useCustomerList'
import { TbChecks } from 'react-icons/tb'
import { apiDeleteProgramparticipant } from '@/services/CustomersService'
import type { Customer } from '../types'

const CustomerListSelected = () => {
    const {
        selectedCustomer,
        customerList,
        mutate,
        customerListTotal,
        tableData,
        setSelectAllCustomer,
        setTableData,
    } = useCustomerList()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
        useState(false)

    const [sendMessageDialogOpen, setSendMessageDialogOpen] =
        useState(false)

    const [sendMessageLoading, setSendMessageLoading] =
        useState(false)

    // =========================
    // OPEN DELETE DIALOG
    // =========================
    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    // =========================
    // CANCEL DELETE
    // =========================
    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    // =========================
    // BULK DELETE
    // =========================
    const handleConfirmDelete = async () => {
        try {
            if (!selectedCustomer.length) return

            // DELETE API CALLS
            await Promise.all(
                selectedCustomer.map((item) => {
                    if (item.id) {
                        return apiDeleteProgramparticipant(String(item.id))
                    }
                    return Promise.resolve()
                })
            )

            // REMOVE FROM CURRENT PAGE
            const updatedList = customerList.filter(
                (customer: Customer) =>
                    !selectedCustomer.some(
                        (selected) =>
                            selected.id === customer.id
                    )
            )

            // UPDATED TOTAL
            const updatedTotal =
                customerListTotal -
                selectedCustomer.length

            // CLEAR SELECTION
            setSelectAllCustomer([])

            // UPDATE SWR CACHE
            mutate(
                {
                    results: updatedList,
                    count: updatedTotal,
                },
                false
            )

            // =========================
            // FIX EMPTY PAGE ISSUE
            // =========================
            const totalPages = Math.ceil(
                updatedTotal / (tableData.pageSize ?? 10)
            )

            if (
                updatedList.length === 0 &&
                (tableData.pageIndex ?? 1) > 1
            ) {
                setTableData({
                    ...tableData,
                    pageIndex: totalPages || 1,
                })
            }

            toast.push(
                <Notification type="success">
                    Participants deleted
                    successfully!
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } catch (error) {
            console.error(error)

            toast.push(
                <Notification type="danger">
                    Failed to delete participants
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setDeleteConfirmationOpen(false)
        }
    }

    // =========================
    // SEND MESSAGE
    // =========================
    const handleSend = () => {
        setSendMessageLoading(true)

        setTimeout(() => {
            toast.push(
                <Notification type="success">
                    Message sent!
                </Notification>,
                {
                    placement: 'top-center',
                }
            )

            setSendMessageLoading(false)
            setSendMessageDialogOpen(false)
            setSelectAllCustomer([])
        }, 500)
    }

    return (
        <>
            {selectedCustomer.length > 0 && (
                <StickyFooter
                    className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <span className="text-lg text-primary">
                                    <TbChecks />
                                </span>

                                <span className="font-semibold flex items-center gap-1">
                                    <span className="heading-text">
                                        {
                                            selectedCustomer.length
                                        }{' '}
                                        participants
                                    </span>

                                    <span>
                                        selected
                                    </span>
                                </span>
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

            {/* DELETE CONFIRM */}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete Participants"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to
                    delete selected
                    participants? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>

            {/* MESSAGE DIALOG */}
            <Dialog
                isOpen={sendMessageDialogOpen}
                onRequestClose={() =>
                    setSendMessageDialogOpen(false)
                }
                onClose={() =>
                    setSendMessageDialogOpen(false)
                }
            >
                <h5 className="mb-2">
                    Send Message
                </h5>

                <p>
                    Send message to selected
                    participants
                </p>

                <Avatar.Group
                    chained
                    omittedAvatarTooltip
                    className="mt-4"
                    maxCount={4}
                    omittedAvatarProps={{
                        size: 30,
                    }}
                >
                    {selectedCustomer.map(
                        (customer) => (
                            <Tooltip
                                key={customer.id}
                                title={
                                    customer.name
                                }
                            >
                                <Avatar
                                    size={30}
                                    src={
                                        customer.img
                                    }
                                    alt=""
                                />
                            </Tooltip>
                        )
                    )}
                </Avatar.Group>

                <div className="my-4">
                    <RichTextEditor
                        content={''}
                    />
                </div>

                <div className="flex items-center gap-2 justify-end">
                    <Button
                        size="sm"
                        onClick={() =>
                            setSendMessageDialogOpen(
                                false
                            )
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        size="sm"
                        variant="solid"
                        loading={
                            sendMessageLoading
                        }
                        onClick={handleSend}
                    >
                        Send
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default CustomerListSelected