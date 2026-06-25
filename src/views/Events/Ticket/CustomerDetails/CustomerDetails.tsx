import Card from '@/components/ui/Card'
import Loading from '@/components/shared/Loading'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import useSWR from 'swr'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGetTicketDetails, apiGetSessionList } from '@/services/CustomersService'
import { TbArrowNarrowLeft, TbDownload, TbTicket, TbCalendar, TbUser, TbHash, TbClock, TbAB, TbActivity, TbAdCircle, TbAdjustmentsCode } from 'react-icons/tb'
import { useRef, useEffect, useState } from 'react'
// @ts-ignore
import QRCode from 'qrcode'
import TBody from '@/components/ui/Table/TBody'

type Ticket = {
    id: string
    title: string
    description?: string
    price?: number
    quantity?: number
    status?: string
    event_id?: string
    event?: string
    event_title?: string
    created_at?: string
    updated_at?: string
    participant_name?: string
    token?: string
    session?: string
    session_id?: string
    session_title?: string
}

type SessionOption = {
    value: string
    label: string
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
    active:   { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    used:     { bg: 'bg-gray-100',   text: 'text-gray-600',    dot: 'bg-gray-400'    },
    expired:  { bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-500'     },
    pending:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
}

const TicketDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const qrCanvasRef = useRef<HTMLCanvasElement>(null)
    const [qrGenerated, setQrGenerated] = useState(false)
    const [selectedSession, setSelectedSession] = useState<string>('')
    const [sessionOptions, setSessionOptions] = useState<SessionOption[]>([])
    const [sessionsLoading, setSessionsLoading] = useState(false)

    const { data, isLoading, error } = useSWR<Ticket>(
        id ? `/events/tickets/${id}` : null,
        () => apiGetTicketDetails(id!),
        { revalidateOnFocus: false }
    )

    const handleBack = () => navigate(-1)

    // Fetch sessions for the event when ticket data is available
    useEffect(() => {
        let mounted = true
        const eventId = data?.event_id || data?.event

        if (!eventId) return

        const fetchSessions = async () => {
            setSessionsLoading(true)
            try {
                const response = await apiGetSessionList<any, {}>({})
                const list = response?.results ?? response ?? []

                const filtered = (list || [])
                    .filter((session: any) =>
                        String(session.event) === String(eventId) ||
                        String(session.event_id) === String(eventId)
                    )
                    .map((session: any) => ({
                        value: String(session.id),
                        label:
                            session.title ||
                            session.session_title ||
                            session.name ||
                            'Unnamed Session',
                    }))

                if (mounted) {
                    setSessionOptions(filtered)
                    // If ticket already has a session, pre-select it
                    const existingSession = data?.session_id || data?.session
                    if (existingSession && filtered.some((s: SessionOption) => s.value === String(existingSession))) {
                        setSelectedSession(String(existingSession))
                    }
                }
            } catch (err) {
                // console.error('Failed to load sessions', err)
            } finally {
                if (mounted) setSessionsLoading(false)
            }
        }

        fetchSessions()
        return () => {
            mounted = false
        }
    }, [data?.event_id, data?.event, data?.session_id, data?.session])

    // Generate QR code with token and session
    useEffect(() => {
        if (qrCanvasRef.current && data?.token && selectedSession) {
            const qrData = JSON.stringify({
                token: data.token,
                session: selectedSession,
            })
            QRCode.toCanvas(qrCanvasRef.current, qrData, {
                width: 220,
                margin: 1,
                color: { dark: '#1a1a2e', light: '#ffffff' },
            })
                .then(() => setQrGenerated(true))
                // .catch(console.error)
        } else {
            setQrGenerated(false)
        }
    }, [data?.token, selectedSession])

    const handleDownloadTicket = () => {
        if (!qrCanvasRef.current || !data) return

        const W = 600
        const H = 280
        const ticketCanvas = document.createElement('canvas')
        ticketCanvas.width = W * 2   // retina
        ticketCanvas.height = H * 2
        const ctx = ticketCanvas.getContext('2d')
        if (!ctx) return
        ctx.scale(2, 2)

        const R = 16 // corner radius

        /* ── Background gradient ── */
        const grad = ctx.createLinearGradient(0, 0, W, H)
        grad.addColorStop(0, '#1a1a2e')
        grad.addColorStop(1, '#16213e')
        ctx.fillStyle = grad
        roundRect(ctx, 0, 0, W, H, R)
        ctx.fill()

        /* ── Decorative circle accents ── */
        ctx.save()
        ctx.globalAlpha = 0.06
        ctx.fillStyle = '#ffffff'
        ctx.beginPath(); ctx.arc(W - 30, -30, 120, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(30, H + 30, 100, 0, Math.PI * 2); ctx.fill()
        ctx.restore()

        /* ── Left accent strip ── */
        const accentGrad = ctx.createLinearGradient(0, 0, 0, H)
        accentGrad.addColorStop(0, '#6366f1')
        accentGrad.addColorStop(1, '#8b5cf6')
        ctx.fillStyle = accentGrad
        roundRect(ctx, 0, 0, 6, H, [R, 0, 0, R])
        ctx.fill()

        /* ── Divider (dashed perforated line) ── */
        const divX = 420
        ctx.save()
        ctx.setLineDash([6, 5])
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(divX, 24); ctx.lineTo(divX, H - 24); ctx.stroke()
        ctx.restore()

        // Notch circles on divider
        ctx.fillStyle = '#1a1a2e'
        ctx.beginPath(); ctx.arc(divX, 0, 14, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(divX, H, 14, 0, Math.PI * 2); ctx.fill()

        /* ── QR Code (right section) ── */
        const qrSize = 130
        const qrX = divX + (W - divX - qrSize) / 2
        const qrY = (H - qrSize) / 2

        // White QR background
        ctx.fillStyle = '#ffffff'
        roundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 10)
        ctx.fill()
        ctx.drawImage(qrCanvasRef.current, qrX, qrY, qrSize, qrSize)

        /* ── Left section: text ── */
        const padL = 28

        // "EVENT TICKET" badge
        ctx.font = '600 9px "Helvetica Neue", Helvetica, sans-serif'
        ctx.fillStyle = '#6366f1'
        ctx.letterSpacing = '2px'
        ctx.fillText('EVENT TICKET', padL + 6, 38)

        // Title / participant name
        ctx.font = `bold 22px "Georgia", serif`
        ctx.fillStyle = '#ffffff'
        ctx.fillText(data?.participant_name || data?.title || 'Attendee', padL + 6, 74)

        // Event title
        if (data?.event_title) {
            ctx.font = '14px "Helvetica Neue", Helvetica, sans-serif'
            ctx.fillStyle = 'rgba(255,255,255,0.6)'
            ctx.fillText(data.event_title, padL + 6, 98)
        }

        // Divider line
        ctx.strokeStyle = 'rgba(255,255,255,0.1)'
        ctx.lineWidth = 1
        ctx.setLineDash([])
        ctx.beginPath(); ctx.moveTo(padL + 6, 115); ctx.lineTo(divX - 20, 115); ctx.stroke()

        // Find selected session label
        const sessionLabel = sessionOptions.find(s => s.value === selectedSession)?.label || ''

        // Meta fields
        const metaItems = [
            { icon: '●', label: 'STATUS', val: (data?.status || 'active').toUpperCase() },
            { icon: '◆', label: 'TOKEN',  val: data?.token ? data.token.substring(0, 18) + '…' : '—' },
            { icon: '▲', label: 'SESSION', val: sessionLabel || '—' },
        ]

        metaItems.forEach((item, i) => {
            const col = i % 2
            const row = Math.floor(i / 2)
            const x = padL + 6 + col * 180
            const y = 140 + row * 52

            ctx.font = '8px "Helvetica Neue", Helvetica, sans-serif'
            ctx.fillStyle = 'rgba(255,255,255,0.4)'
            ctx.fillText(item.label, x, y)

            ctx.font = '600 13px "Helvetica Neue", Helvetica, sans-serif'
            ctx.fillStyle = '#ffffff'
            ctx.fillText(item.val, x, y + 18)
        })

        // Footer branding
        ctx.font = '9px "Helvetica Neue", Helvetica, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.25)'
        ctx.fillText(`ID: ${data?.id || ''}`, padL + 6, H - 18)

        /* ── Download ── */
        const link = document.createElement('a')
        link.href = ticketCanvas.toDataURL('image/png')
        link.download = `ticket-${data?.token || 'ticket'}-session-${selectedSession}.png`
        link.click()
    }

    if (isLoading) return <Loading loading />
    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center mt-24 gap-3 text-gray-400">
                <TbTicket className="text-5xl opacity-30" />
                <p className="text-base font-medium">Ticket not found.</p>
            </div>
        )
    }

    const ticket = data
    const status = (ticket.status || 'active').toLowerCase()
    const statusStyle = statusColors[status] ?? statusColors['active']

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Back */}
            <button
                type="button"
                className="mb-6 flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                onClick={handleBack}
            >
                <TbArrowNarrowLeft className="text-lg" />
                Back
            </button>

            {/* Page header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                    <TbTicket className="text-indigo-600 dark:text-indigo-400 text-xl" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                        {ticket.participant_name || ticket.title || 'Ticket'}
                    </h1>
                    {ticket.event_title && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{ticket.event_title}</p>
                    )}
                </div>
                <span className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {ticket.status || 'Active'}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Details */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <Card className="rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide uppercase">
                                Ticket Details
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <DetailRow icon={<TBody />}     label="Participant"  value={ticket.participant_name || '—'} />
                            <DetailRow icon={<TBody />}     label="Event"        value={ticket.event_title || '—'} />
                            <DetailRow icon={<TBody />}     label="Token"        value={ticket.token || '—'} mono />
                            <DetailRow icon={<TBody />} label="Created"      value={ticket.created_at ? new Date(ticket.created_at).toLocaleString() : '—'} />
                            <DetailRow icon={<TBody />}    label="Updated"      value={ticket.updated_at ? new Date(ticket.updated_at).toLocaleString() : '—'} />
                        </div>
                    </Card>
                </div>

                {/* QR */}
                <div className="lg:col-span-1">
                    <Card className="rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden h-full">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide uppercase">
                                Generate Ticket
                            </h2>
                        </div>
                        <div className="p-6 flex flex-col items-center gap-5">
                            {/* Session Selector */}
                            <div className="w-full">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
                                    Select Session
                                </label>
                                <Select
                                    options={sessionOptions}
                                    placeholder={
                                        sessionsLoading
                                            ? 'Loading sessions...'
                                            : sessionOptions.length === 0
                                              ? 'No sessions available'
                                              : 'Select a session'
                                    }
                                    value={
                                        sessionOptions.find(
                                            (option) => option.value === selectedSession
                                        ) || null
                                    }
                                    onChange={(option: SessionOption | null) => {
                                        setSelectedSession(option?.value || '')
                                        setQrGenerated(false)
                                    }}
                                    isClearable
                                    isLoading={sessionsLoading}
                                    isDisabled={sessionsLoading || sessionOptions.length === 0}
                                />
                            </div>

                            {/* QR Code Display */}
                            <div className="bg-white rounded-2xl p-4 shadow-inner border border-gray-100">
                                {ticket.token && selectedSession ? (
                                    <canvas
                                        ref={qrCanvasRef}
                                        style={{ display: 'block', width: 200, height: 200 }}
                                    />
                                ) : (
                                    <div className="w-[200px] h-[200px] flex items-center justify-center text-gray-300 text-sm text-center px-4">
                                        {!ticket.token
                                            ? 'No token available'
                                            : 'Select a session to generate QR code'}
                                    </div>
                                )}
                            </div>

                            {ticket.token && selectedSession && (
                                <p className="text-xs font-mono text-gray-400 text-center break-all px-2">
                                    {ticket.token} | Session: {sessionOptions.find(s => s.value === selectedSession)?.label || selectedSession}
                                </p>
                            )}

                            <Button
                                size="sm"
                                variant="solid"
                                icon={<TbDownload />}
                                onClick={handleDownloadTicket}
                                className="w-full !rounded-xl !bg-indigo-600 hover:!bg-indigo-700 !text-white font-semibold transition-colors"
                                disabled={!qrGenerated}
                            >
                                Download Ticket
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

/* ── Helpers ── */

function DetailRow({
    icon, label, value, mono = false,
}: {
    icon: React.ReactNode
    label: string
    value: string | number
    mono?: boolean
}) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 text-indigo-500 dark:text-indigo-400 text-base shrink-0">{icon}</span>
            <div className="min-w-0">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
                <p className={`text-sm font-medium text-gray-800 dark:text-gray-100 break-all ${mono ? 'font-mono' : ''}`}>
                    {value ?? '—'}
                </p>
            </div>
        </div>
    )
}

/** Polyfill-style roundRect helper (ctx.roundRect not available everywhere) */
function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    r: number | [number, number, number, number] = 0,
) {
    const [tl, tr, br, bl] = Array.isArray(r) ? r : [r, r, r, r]
    ctx.beginPath()
    ctx.moveTo(x + tl, y)
    ctx.lineTo(x + w - tr, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + tr)
    ctx.lineTo(x + w, y + h - br)
    ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h)
    ctx.lineTo(x + bl, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - bl)
    ctx.lineTo(x, y + tl)
    ctx.quadraticCurveTo(x, y, x + tl, y)
    ctx.closePath()
}

export default TicketDetails