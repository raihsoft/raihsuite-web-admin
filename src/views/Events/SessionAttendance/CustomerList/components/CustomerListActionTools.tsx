import { useState } from 'react'
import Button from '@/components/ui/Button'
import { TbCloudDownload, TbUserPlus, TbQrcode } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useCustomerList from '../hooks/useCustomerList'
import { CSVLink } from 'react-csv'
import QRScannerModal from '@/components/shared/QRScannerModal'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { apiCheckInParticipant, apiGetParticipant } from '@/services/CustomersService'

const CustomerListActionTools = ({ eventId }: { eventId?: string }) => {
    const navigate = useNavigate()
    const [showQRScanner, setShowQRScanner] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { customerList } = useCustomerList(eventId)

    const handleQRScan = async (qrCode: string) => {
        setIsLoading(true)
        try {
            // The QR code might contain the participant ID or a special code
            // Try to find the participant and check them in
            const response = await apiCheckInParticipant({
                qr_code: qrCode,
                check_in_time: new Date().toISOString(),
            })

            toast.push(
                <Notification title="Check-in Successful" type="success">
                    Participant has been checked in successfully.
                </Notification>,
            )
            setShowQRScanner(false)
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to check in participant'

            toast.push(
                <Notification title="Check-in Failed" type="danger">
                    {errorMessage}
                </Notification>,
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row gap-3">
                <CSVLink
                    className="w-full"
                    filename="customerList.csv"
                    data={customerList}
                >
                    <Button
                        icon={<TbCloudDownload className="text-xl" />}
                        className="w-full"
                    >
                        Download
                    </Button>
                </CSVLink>
                <Button
                    icon={<TbQrcode className="text-xl" />}
                    onClick={() => setShowQRScanner(true)}
                >
                    Scan QR
                </Button>
                <Button
                    variant="solid"
                   
                    onClick={() => navigate('/sessionAttendance/create')}
                >
                    Add new
                </Button>
            </div>

            <QRScannerModal
                isOpen={showQRScanner}
                onClose={() => setShowQRScanner(false)}
                onScan={handleQRScan}
                isLoading={isLoading}
            />
        </>
    )
}

export default CustomerListActionTools



