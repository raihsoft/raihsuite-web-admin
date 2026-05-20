import { useState, useEffect } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    apiCreateProgramparticipant,
    apiGetProgramList,
} from '@/services/CustomersService'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

type ProgramOption = {
    label: string
    value: string
}

const CustomerCreate = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [programOptions, setProgramOptions] = useState<ProgramOption[]>([])

    // =========================
    // FETCH PROGRAMS
    // =========================
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await apiGetProgramList()

                console.log('📥 PROGRAM API:', res)

                const list = res?.results || res?.data || []

                const options = list.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                }))

                setProgramOptions(options)

                // console.log('🟢 PROGRAM OPTIONS:', options)
            } catch (err) {
                // console.log('❌ Program fetch failed', err)
            }
        }

        fetchPrograms()
    }, [])

    // =========================
    // SUBMIT
    // =========================
    const handleFormSubmit = async (values: any) => {
        setIsSubmitting(true)

        try {
            const payload = {
                program: values.program,
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                phone: values.phone,
                place: values.place,
            }

            // console.log('🚀 FINAL PAYLOAD:', payload)

            await apiCreateProgramparticipant(payload)

            toast.push(
                <Notification type="success">
                    Participant created successfully
                </Notification>,
                { placement: 'top-center' }
            )

            navigate('/programs-participants')
        } catch (error) {
            // console.log('❌ CREATE ERROR:', error)

            toast.push(
                <Notification type="danger">
                    Failed to create participant
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <CustomerForm
                newCustomer
                programOptions={programOptions}   // ✅ IMPORTANT FIX
                defaultValues={{
                    program: '',
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    place: '',
                }}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex justify-end gap-3 px-8">
                        <Button
                            type="button"
                            onClick={() => setDiscardConfirmationOpen(true)}
                        >
                            Discard
                        </Button>

                        <Button type="submit" variant="solid" loading={isSubmitting}>
                            Create
                        </Button>
                    </div>
                </Container>
            </CustomerForm>

            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                onClose={() => setDiscardConfirmationOpen(false)}
                onCancel={() => setDiscardConfirmationOpen(false)}
                onConfirm={() => navigate('/programs-participants')}
            >
                Are you sure you want to discard?
            </ConfirmDialog>
        </>
    )
}

export default CustomerCreate