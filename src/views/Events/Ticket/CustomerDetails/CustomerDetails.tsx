import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import Button from '@/components/ui/Button'
import useSWR from 'swr'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGetTicketDetails } from '@/services/CustomersService'
import { TbArrowNarrowLeft, TbDownload } from 'react-icons/tb'
import { useRef, useEffect, useState } from 'react'
// @ts-ignore
import QRCode from 'qrcode'

type Ticket = {
    id: string
    title: string
    description?: string
    price?: number
    quantity?: number
    status?: string
    event_id?: string
    event_title?: string
    created_at?: string
    updated_at?: string
    participant_name?: string
    token?: string
}

const TicketDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const qrCanvasRef = useRef<HTMLCanvasElement>(null)
    const [qrGenerated, setQrGenerated] = useState(false)

    const { data, isLoading, error } = useSWR<Ticket>(
        id ? `/events/tickets/${id}` : null,
        () => apiGetTicketDetails(id!),
        { revalidateOnFocus: false }
    )

    const handleBack = () => navigate(-1)

    // Generate QR code on mount or when token changes
    useEffect(() => {
        if (qrCanvasRef.current && data?.token) {
            QRCode.toCanvas(qrCanvasRef.current, data.token, {
                width: 200,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            }).then(() => setQrGenerated(true))
              .catch(console.error)
        }
    }, [data?.token])

    const handleDownloadTicket = () => {
        if (!qrCanvasRef.current || !data) return

        // Create a new canvas for the complete ticket
        const ticketCanvas = document.createElement('canvas')
        const ctx = ticketCanvas.getContext('2d')
        if (!ctx) return

        ticketCanvas.width = 280
        ticketCanvas.height = 380

        // Fill background
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, ticketCanvas.width, ticketCanvas.height)

        // Draw border
        ctx.strokeStyle = '#cccccc'
        ctx.lineWidth = 2
        ctx.strokeRect(10, 10, ticketCanvas.width - 20, ticketCanvas.height - 20)

        // Draw QR code
        const qrImage = qrCanvasRef.current
        ctx.drawImage(qrImage, 40, 30, 200, 200)

        // Draw title
        ctx.font = 'bold 18px Arial'
        ctx.fillStyle = '#000'
        ctx.textAlign = 'center'
        ctx.fillText(data.title || 'Ticket', ticketCanvas.width / 2, 260)

        // Draw token
        ctx.font = '12px Arial'
        ctx.fillStyle = '#666'
        const token = data.token || ''
        const tokenLabel = `Token: ${token.substring(0, 20)}${token.length > 20 ? '...' : ''}`
        ctx.fillText(tokenLabel, ticketCanvas.width / 2, 290)

        // Draw event name
        if (data.event_title) {
            ctx.font = '11px Arial'
            ctx.fillStyle = '#888'
            ctx.fillText(data.event_title, ticketCanvas.width / 2, 315)
        }

        // Draw participant name
        if (data.participant_name) {
            ctx.font = '11px Arial'
            ctx.fillStyle = '#888'
            ctx.fillText(data.participant_name, ticketCanvas.width / 2, 340)
        }

        // Download ticket image
        const link = document.createElement('a')
        link.href = ticketCanvas.toDataURL('image/png')
        link.download = `ticket-${data.token || 'ticket'}.png`
        link.click()
    }

    if (isLoading) return <Loading loading />

    if (error || !data) {
        return <div className="text-center text-gray-500 mt-12">Ticket not found.</div>
    }

    const ticket = data

    return (
        <div className="p-6">
            {/* Back Button */}
            <div className="mb-4">
                <button
                    type="button"
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:opacity-70 transition"
                    onClick={handleBack}
                >
                    <TbArrowNarrowLeft className="text-xl" />
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Details Card */}
                <div className="lg:col-span-2">
                    <Card className="p-6 rounded-xl border border-gray-200">
                        <h3 className="text-lg font-semibold mb-6">Ticket Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Detail label="Title" value={ticket.participant_name || '—'} />
                            <Detail label="Token" value={ticket.token || '—'} />
                            <Detail label="Status" value={ticket.status ?? '—'} />
                            <Detail label="Created At" value={ticket.created_at ? new Date(ticket.created_at).toLocaleString() : '—'} />
                            <Detail label="Updated At" value={ticket.updated_at ? new Date(ticket.updated_at).toLocaleString() : '—'} />
                        </div>
                    </Card>
                </div>

                {/* QR Code Card */}
                <div className="lg:col-span-1">
                    <Card className="p-6 rounded-xl border border-gray-200 flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-4">Ticket QR Code</h3>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-300 mb-4">
                            {ticket.token && (
                                <canvas 
                                    ref={qrCanvasRef}
                                    style={{ display: 'block', width: '200px', height: '200px' }}
                                />
                            )}
                        </div>

                        <Button
                            size="sm"
                            variant="solid"
                            icon={<TbDownload />}
                            onClick={handleDownloadTicket}
                            className="w-full"
                            disabled={!qrGenerated}
                        >
                            Download Ticket
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}

const Detail = ({ label, value }: { label: string; value: string | number }) => (
    <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-lg font-semibold">{value ?? '—'}</div>
    </div>
)

export default TicketDetails
