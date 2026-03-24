import { useState } from 'react'
import Button from '@/components/ui/Button'
import { TbCloudDownload, TbUserPlus, TbQrcode } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useTicketList from '../hooks/useTicketList'
import useScanTicket from '../hooks/useScanTicket'
import { CSVLink } from 'react-csv'
import QRScannerModal from '@/components/shared/QRScannerModal'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

const CustomerListActionTools = () => {
    const navigate = useNavigate()
    const [showQRScanner, setShowQRScanner] = useState(false)
    const { ticketList, mutate } = useTicketList()
    const { scanTicket, isLoading } = useScanTicket()

    const handleQRScan = async (qrCode: string) => {
        try {
            // Parse the QR code data - it should contain a token field
            let token = qrCode

            // If QR code is JSON, extract the token
            try {
                const parsedData = JSON.parse(qrCode)
                token = parsedData.token || qrCode
            } catch {
                // If not JSON, use the raw QR code as token
                token = qrCode
            }

            await scanTicket(token)

            toast.push(
                <Notification title="QR Scanned" type="success">
                    Ticket has been marked as entered successfully.
                </Notification>,
            )

            // Refresh the ticket list to show updated status
            mutate()

            setShowQRScanner(false)
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'QR code is not valid'

            toast.push(
                <Notification title="Not Valid" type="danger">
                    {errorMessage}
                </Notification>,
            )

            setShowQRScanner(false)
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row gap-3">
                <CSVLink
                    className="w-full"
                    filename="ticketList.csv"
                    data={ticketList}
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
                    icon={<TbUserPlus className="text-xl" />}
                    onClick={() => navigate('/ticket/create')}
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
