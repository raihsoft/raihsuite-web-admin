import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import type { CustomerFormSchema } from '../CustomerForm'
import { apiCreateOrganizations } from '@/services/CustomersService'

const CustomerCreate = () => {
  const navigate = useNavigate()
  const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSubmit = async (values: CustomerFormSchema) => {
    try {
      setIsSubmitting(true)

      const payload = {
        organization_name: values.organization_name,
        place: values.place,
        zone_name: values.zone_name,
      }

      // capture response from API
      const response = await apiCreateOrganizations(payload)

      // show success with Order Number
      toast.push(
        <Notification type="success">
          Organization created successfully! 
          
        </Notification>,
        { placement: 'top-center' }
      )

    } catch (error) {
      // console.error(error)
      toast.push(
        <Notification type="danger">Failed to create organization!</Notification>,
        { placement: 'top-center' }
      )
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleConfirmDiscard = () => {
    setDiscardConfirmationOpen(false)
    toast.push(
      <Notification type="success">Customer discarded!</Notification>,
      { placement: 'top-center' }
    )
    navigate('/orderform/orderform-create')
  }

  const handleDiscard = () => {
    setDiscardConfirmationOpen(true)
  }

  const handleCancel = () => {
    setDiscardConfirmationOpen(false)
  }

  return (
    <>
      <CustomerForm
        newCustomer
        defaultValues={{
            organization_name: '',
            place: '',
            zone_name: '',
            tags: [],
        }}
        onFormSubmit={handleFormSubmit}
      >
        {/* Buttons inside form submit context */}
        <Container>
          <div className="flex items-center justify-between px-8">
            <span></span>
            <div className="flex items-center">
              <Button
                className="ltr:mr-3 rtl:ml-3"
                type="button"
                customColorClass={() =>
                  'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                }
                icon={<TbTrash />}
                onClick={handleDiscard}
              >
                Discard
              </Button>

              <Button
                variant="solid"
                type="submit" // submit type triggers handleFormSubmit
                loading={isSubmitting}
              >
                Create
              </Button>
            </div>
          </div>
        </Container>
      </CustomerForm>

      <ConfirmDialog
        isOpen={discardConfirmationOpen}
        type="danger"
        title="Discard changes"
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmDiscard}
      >
        <p>Are you sure you want to discard this? This action can't be undone.</p>
      </ConfirmDialog>
    </>
  )
}

export default CustomerCreate
