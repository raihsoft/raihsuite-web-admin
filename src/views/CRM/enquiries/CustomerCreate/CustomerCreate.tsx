import { useEffect } from 'react'
import Container from '@/components/shared/Container'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useNavigate } from 'react-router-dom'

const CustomerCreate = () => {
    const navigate = useNavigate()

    useEffect(() => {
        toast.push(
            <Notification type="info">Enquiries are read-only and cannot be created manually. They are automatically created when customers submit enquiry forms.</Notification>,
            { placement: 'top-center' },
        )
        navigate('/enquiries')
    }, [navigate])

    return (
        <Container>
            <div className="h-full flex flex-col items-center justify-center">
                <p>Redirecting to enquiries list...</p>
            </div>
        </Container>
    )
}

export default CustomerCreate
