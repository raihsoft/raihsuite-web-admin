import { useEffect, useRef, useState, useCallback } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { HiXMark } from 'react-icons/hi2'
import {
    TbCircleCheck,
    TbAlertTriangle,
    TbBan,
    TbRefresh,
    TbUser,
    TbHash,
    TbCalendar,
} from 'react-icons/tb'
import jsQR from 'jsqr'

// ─── Types ────────────────────────────────────────────────────────────────────

type ScanStatus = 'idle' | 'scanning' | 'loading' | 'valid' | 'used' | 'invalid' | 'error'

interface TicketInfo {
    participant_name?: string
    event_title?: string
    token?: string
    created_at?: string
}

interface QRScannerModalProps {
    isOpen: boolean
    onClose: () => void
    /** Called with the raw QR string; must return a Response or throw */
    onScan: (qrCode: string) => Promise<{ status: number; data?: TicketInfo }>
}

// ─── Result Screen ─────────────────────────────────────────────────────────────

const ResultScreen = ({
    status,
    ticket,
    onScanAgain,
    onClose,
}: {
    status: 'valid' | 'used' | 'invalid' | 'error'
    ticket?: TicketInfo
    onScanAgain: () => void
    onClose: () => void
}) => {
    const configs = {
        valid: {
            bg: 'bg-emerald-50 dark:bg-emerald-950/40',
            border: 'border-emerald-200 dark:border-emerald-800',
            iconBg: 'bg-emerald-500',
            iconColor: 'text-white',
            icon: <TbCircleCheck className="text-3xl" />,
            title: 'Ticket Valid',
            subtitle: 'Entry approved. Welcome!',
            titleColor: 'text-emerald-700 dark:text-emerald-400',
            subtitleColor: 'text-emerald-600 dark:text-emerald-500',
            pulse: 'ring-4 ring-emerald-300 dark:ring-emerald-700',
        },
        used: {
            bg: 'bg-amber-50 dark:bg-amber-950/40',
            border: 'border-amber-200 dark:border-amber-800',
            iconBg: 'bg-amber-500',
            iconColor: 'text-white',
            icon: <TbAlertTriangle className="text-3xl" />,
            title: 'Ticket Already Used',
            subtitle: 'This ticket has already been scanned.',
            titleColor: 'text-amber-700 dark:text-amber-400',
            subtitleColor: 'text-amber-600 dark:text-amber-500',
            pulse: 'ring-4 ring-amber-300 dark:ring-amber-700',
        },
        invalid: {
            bg: 'bg-red-50 dark:bg-red-950/40',
            border: 'border-red-200 dark:border-red-800',
            iconBg: 'bg-red-500',
            iconColor: 'text-white',
            icon: <TbBan className="text-3xl" />,
            title: 'Invalid Ticket',
            subtitle: 'This ticket was not found or is not valid.',
            titleColor: 'text-red-700 dark:text-red-400',
            subtitleColor: 'text-red-500 dark:text-red-500',
            pulse: 'ring-4 ring-red-300 dark:ring-red-700',
        },
        error: {
            bg: 'bg-gray-50 dark:bg-gray-800/40',
            border: 'border-gray-200 dark:border-gray-700',
            iconBg: 'bg-gray-500',
            iconColor: 'text-white',
            icon: <TbAlertTriangle className="text-3xl" />,
            title: 'Server Error',
            subtitle: 'Something went wrong. Please try again.',
            titleColor: 'text-gray-700 dark:text-gray-300',
            subtitleColor: 'text-gray-500',
            pulse: 'ring-4 ring-gray-300 dark:ring-gray-600',
        },
    }

    const c = configs[status]

    return (
        <div
            className={`flex flex-col items-center gap-6 rounded-2xl border p-8 ${c.bg} ${c.border} transition-all`}
            style={{ animation: 'fadeSlideUp 0.3s ease both' }}
        >
            {/* Icon */}
            <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${c.iconBg} ${c.iconColor} ${c.pulse} transition-all`}
                style={{ animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}
            >
                {c.icon}
            </div>

            {/* Title */}
            <div className="text-center">
                <h3 className={`text-2xl font-bold mb-1 ${c.titleColor}`}>{c.title}</h3>
                <p className={`text-sm ${c.subtitleColor}`}>{c.subtitle}</p>
            </div>

            {/* Ticket info (only on valid) */}
            {status === 'valid' && ticket && (
                <div className="w-full rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-900/50 divide-y divide-emerald-100 dark:divide-emerald-900 overflow-hidden">
                    {ticket.participant_name && (
                        <TicketInfoRow
                            icon={<TbUser />}
                            label="Participant"
                            value={ticket.participant_name}
                        />
                    )}
                    {ticket.event_title && (
                        <TicketInfoRow
                            icon={<TbCalendar />}
                            label="Event"
                            value={ticket.event_title}
                        />
                    )}
                    {ticket.token && (
                        <TicketInfoRow
                            icon={<TbHash />}
                            label="Token"
                            value={ticket.token.substring(0, 24) + (ticket.token.length > 24 ? '…' : '')}
                            mono
                        />
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 w-full">
                <button
                    type="button"
                    onClick={onScanAgain}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                    <TbRefresh className="text-base" />
                    Scan Again
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors shadow-sm"
                >
                    Done
                </button>
            </div>
        </div>
    )
}

const TicketInfoRow = ({
    icon,
    label,
    value,
    mono = false,
}: {
    icon: React.ReactNode
    label: string
    value: string
    mono?: boolean
}) => (
    <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-emerald-500 text-base shrink-0">{icon}</span>
        <span className="text-xs text-gray-400 w-20 shrink-0">{label}</span>
        <span className={`text-sm font-medium text-gray-800 dark:text-gray-100 truncate ${mono ? 'font-mono' : ''}`}>
            {value}
        </span>
    </div>
)

// ─── Main Modal ────────────────────────────────────────────────────────────────

const QRScannerModal = ({ isOpen, onClose, onScan }: QRScannerModalProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const animationIdRef = useRef<number | null>(null)
    const scannedCodesRef = useRef<Set<string>>(new Set())

    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([])
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)

    const [scanStatus, setScanStatus] = useState<ScanStatus>('idle')
    const [ticketInfo, setTicketInfo] = useState<TicketInfo | undefined>()

    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop())
            streamRef.current = null
        }
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current)
            animationIdRef.current = null
        }
    }, [])

    const startStream = useCallback(async (constraints: MediaStreamConstraints) => {
        stopStream()
        const s = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = s
        if (videoRef.current) {
            videoRef.current.srcObject = s
            videoRef.current.muted = true
            videoRef.current.onloadedmetadata = async () => {
                try { await videoRef.current?.play() } catch {}
            }
        }
    }, [stopStream])

    // Camera init
    useEffect(() => {
        if (!isOpen) return
        scannedCodesRef.current.clear()
        setScanStatus('scanning')
        setTicketInfo(undefined)

        const init = async () => {
            try {
                try {
                    await startStream({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } })
                } catch {
                    await startStream({ video: true })
                }

                try {
                    const devices = await navigator.mediaDevices.enumerateDevices()
                    const videoInputs = devices.filter((d) => d.kind === 'videoinput')
                    setCameraDevices(videoInputs)
                    const deviceId = (streamRef.current?.getVideoTracks()[0] as any)?.getSettings?.()?.deviceId
                    setSelectedDeviceId(deviceId || videoInputs[0]?.deviceId || null)
                } catch {}

                setHasPermission(true)
                setIsScanning(true)
                setCameraError(null)
            } catch {
                setHasPermission(false)
                setCameraError('Unable to access camera. Please check permissions.')
            }
        }

        init()
        return () => stopStream()
    }, [isOpen])

    // Switch camera device
    useEffect(() => {
        if (!selectedDeviceId || !isOpen) return
        const switchCamera = async () => {
            try {
                await startStream({ video: { deviceId: { exact: selectedDeviceId } } })
                setIsScanning(true)
            } catch {
                setCameraError('Unable to switch camera.')
            }
        }
        switchCamera()
    }, [selectedDeviceId])

    // QR scanning loop
    useEffect(() => {
        if (!isScanning || scanStatus !== 'scanning') return

        const scan = async () => {
            const video = videoRef.current
            const canvas = canvasRef.current
            if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
                animationIdRef.current = requestAnimationFrame(scan)
                return
            }
            if (video.videoWidth && video.videoHeight) {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                    try {
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                        const code = jsQR(imageData.data, canvas.width, canvas.height)
                        if (code?.data && !scannedCodesRef.current.has(code.data)) {
                            scannedCodesRef.current.add(code.data)
                            await handleDetected(code.data)
                            return
                        }
                    } catch {}
                }
            }
            animationIdRef.current = requestAnimationFrame(scan)
        }

        animationIdRef.current = requestAnimationFrame(scan)
        return () => {
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
        }
    }, [isScanning, scanStatus])

    const handleDetected = async (qrData: string) => {
        setIsScanning(false)
        setScanStatus('loading')

        try {
            const result = await onScan(qrData)

            if (result.status === 200) {
                setTicketInfo(result.data)
                setScanStatus('valid')
            } else if (result.status === 409) {
                setScanStatus('used')
            } else if (result.status === 404) {
                setScanStatus('invalid')
            } else {
                setScanStatus('error')
            }
        } catch {
            setScanStatus('error')
        }
    }

    const handleScanAgain = () => {
        scannedCodesRef.current.clear()
        setTicketInfo(undefined)
        setScanStatus('scanning')
        setIsScanning(true)
    }

    const handleClose = () => {
        setIsScanning(false)
        setScanStatus('idle')
        setTicketInfo(undefined)
        stopStream()
        onClose()
    }

    const isResult = ['valid', 'used', 'invalid', 'error'].includes(scanStatus)

    return (
        <>
            {/* Keyframe animations injected once */}
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.5); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes scanLine {
                    0%   { top: 8%; }
                    50%  { top: 82%; }
                    100% { top: 8%; }
                }
                .scan-line {
                    position: absolute;
                    left: 16%;
                    right: 16%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #22c55e, transparent);
                    animation: scanLine 2s ease-in-out infinite;
                    box-shadow: 0 0 8px #22c55e88;
                }
            `}</style>

            <Dialog isOpen={isOpen} onClose={handleClose} width={560}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scan Ticket</h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {scanStatus === 'scanning' ? 'Point camera at QR code' :
                                 scanStatus === 'loading'  ? 'Verifying ticket…' : 'Scan result'}
                            </p>
                        </div>
                      
                    </div>

                    {/* ── No permission ── */}
                    {hasPermission === null && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                            <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                            <p className="text-sm">Requesting camera permission…</p>
                        </div>
                    )}

                    {hasPermission === false && (
                        <div className="text-center py-12">
                            <p className="text-red-500 font-medium mb-2">{cameraError}</p>
                            <p className="text-sm text-gray-400 mb-6">Enable camera access in your browser settings.</p>
                            <Button variant="solid" onClick={() => window.location.reload()}>Try Again</Button>
                        </div>
                    )}

                    {/* ── Camera view ── */}
                    {hasPermission === true && !isResult && (
                        <div className="flex flex-col gap-4">
                            {/* Camera selector */}
                            {cameraDevices.length > 1 && (
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-500 shrink-0">Camera</label>
                                    <select
                                        className="flex-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-gray-700 dark:text-gray-200"
                                        value={selectedDeviceId || ''}
                                        onChange={(e) => setSelectedDeviceId(e.target.value || null)}
                                    >
                                        {cameraDevices.map((d) => (
                                            <option key={d.deviceId} value={d.deviceId}>
                                                {d.label || `Camera ${d.deviceId.substring(0, 8)}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Video frame */}
                            <div className="relative w-full bg-black rounded-2xl overflow-hidden aspect-[4/3]">
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    playsInline
                                />
                                <canvas ref={canvasRef} className="hidden" />

                                {/* Corner brackets */}
                                {scanStatus === 'scanning' && (
                                    <>
                                        <div className="absolute top-[10%] left-[14%] w-10 h-10 border-t-4 border-l-4 border-green-400 rounded-tl-md" />
                                        <div className="absolute top-[10%] right-[14%] w-10 h-10 border-t-4 border-r-4 border-green-400 rounded-tr-md" />
                                        <div className="absolute bottom-[10%] left-[14%] w-10 h-10 border-b-4 border-l-4 border-green-400 rounded-bl-md" />
                                        <div className="absolute bottom-[10%] right-[14%] w-10 h-10 border-b-4 border-r-4 border-green-400 rounded-br-md" />
                                        <div className="scan-line" />
                                    </>
                                )}

                                {/* Loading overlay */}
                                {scanStatus === 'loading' && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                                        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                        <p className="text-white text-sm font-medium">Verifying…</p>
                                    </div>
                                )}
                            </div>

                            <p className="text-xs text-center text-gray-400">
                                Position the QR code within the green frame
                            </p>
                        </div>
                    )}

                    {/* ── Result screens ── */}
                    {isResult && (
                        <ResultScreen
                            status={scanStatus as 'valid' | 'used' | 'invalid' | 'error'}
                            ticket={ticketInfo}
                            onScanAgain={handleScanAgain}
                            onClose={handleClose}
                        />
                    )}
                </div>
            </Dialog>
        </>
    )
}

export default QRScannerModal