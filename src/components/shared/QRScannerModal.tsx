import { useEffect, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { HiXMark } from 'react-icons/hi2'

// Import jsQR for QR code decoding
import jsQR from 'jsqr'

interface QRScannerModalProps {
    isOpen: boolean
    onClose: () => void
    onScan: (qrCode: string) => void
    isLoading?: boolean
}

const QRScannerModal = ({
    isOpen,
    onClose,
    onScan,
    isLoading = false,
}: QRScannerModalProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([])
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const animationIdRef = useRef<number | null>(null)
    const scannedCodesRef = useRef<Set<string>>(new Set())

    // Request camera permissions
    useEffect(() => {
        if (!isOpen) return

        scannedCodesRef.current.clear()

        const requestPermissions = async () => {
            try {
                // Helper to stop existing stream
                const stopCurrentStream = () => {
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach((t) => t.stop())
                        streamRef.current = null
                    }
                }

                const startStream = async (constraints: MediaStreamConstraints) => {
                    stopCurrentStream()
                    const s = await navigator.mediaDevices.getUserMedia(constraints)
                    streamRef.current = s
                    if (videoRef.current) {
                        videoRef.current.srcObject = s
                        videoRef.current.muted = true
                        videoRef.current.onloadedmetadata = async () => {
                            try {
                                await videoRef.current?.play()
                            } catch (playErr) {
                                // ignore autoplay errors
                            }
                        }
                    }
                }

                // Try environment-facing first, fallback to default
                try {
                    await startStream({
                        video: {
                            facingMode: 'environment',
                            width: { ideal: 1280 },
                            height: { ideal: 720 },
                        },
                    })
                } catch (e) {
                    await startStream({ video: true })
                }

                // Enumerate devices (may require permission granted)
                try {
                    const devices = await navigator.mediaDevices.enumerateDevices()
                    const videoInputs = devices.filter(
                        (d) => d.kind === 'videoinput',
                    )
                    setCameraDevices(videoInputs)

                    // Try to set selected device based on current stream track settings
                    const currentTrack = streamRef.current?.getVideoTracks()[0]
                    const deviceId = (currentTrack as any)?.getSettings?.()?.deviceId
                    setSelectedDeviceId(deviceId || (videoInputs[0] && videoInputs[0].deviceId) || null)
                } catch (e) {
                    // ignore enumeration errors
                }

                setHasPermission(true)
                setIsScanning(true)
                setError(null)
            } catch (err) {
                setHasPermission(false)
                setError('Unable to access camera. Please check permissions.')
            }
        }

        requestPermissions()

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => {
                    track.stop()
                })
                streamRef.current = null
            }
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current)
            }
        }
    }, [isOpen])

    // Switch stream when selectedDeviceId changes
    useEffect(() => {
        if (!selectedDeviceId || !isOpen) return

        const switchToDevice = async () => {
            try {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((t) => t.stop())
                    streamRef.current = null
                }
                const s = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: selectedDeviceId } },
                })
                streamRef.current = s
                if (videoRef.current) {
                    videoRef.current.srcObject = s
                    videoRef.current.muted = true
                    try {
                        await videoRef.current.play()
                    } catch {}
                }
                setIsScanning(true)
                setError(null)
            } catch (e) {
                setError('Unable to switch camera')
            }
        }

        switchToDevice()

        return () => {}
    }, [selectedDeviceId, isOpen])

    // Scan QR code from video stream
    useEffect(() => {
        if (!isScanning || !videoRef.current || !canvasRef.current) return

        const scanQRCode = async () => {
            const video = videoRef.current
            const canvas = canvasRef.current

            if (
                !video ||
                !canvas ||
                !isOpen ||
                video.readyState !== video.HAVE_ENOUGH_DATA
            ) {
                if (isOpen && isScanning) {
                    animationIdRef.current = requestAnimationFrame(scanQRCode)
                }
                return
            }

            if (video.videoWidth && video.videoHeight) {
                const context = canvas.getContext('2d')
                if (!context) {
                    if (isOpen && isScanning) {
                        animationIdRef.current = requestAnimationFrame(scanQRCode)
                    }
                    return
                }

                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                // Draw video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height)

                try {
                    // Get image data and decode QR code using jsQR
                    const imageData = context.getImageData(
                        0,
                        0,
                        canvas.width,
                        canvas.height,
                    )

                    const code = jsQR(
                        imageData.data,
                        canvas.width,
                        canvas.height,
                    )

                    if (code && code.data) {
                        // Check if we've already scanned this code to avoid duplicates
                        if (
                            !scannedCodesRef.current.has(code.data)
                        ) {
                            scannedCodesRef.current.add(code.data)
                            handleQRCodeDetected(code.data)
                            return
                        }
                    }
                } catch (err) {
                    // Continue scanning
                }
            }

            // Continue scanning
            if (isOpen && isScanning) {
                animationIdRef.current = requestAnimationFrame(scanQRCode)
            }
        }

        if (isOpen && isScanning) {
            animationIdRef.current = requestAnimationFrame(scanQRCode)
        }

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current)
                animationIdRef.current = null
            }
        }
    }, [isScanning, isOpen])

    const handleQRCodeDetected = (data: string) => {
        setIsScanning(false)
        onScan(data)
    }

    const handleClose = () => {
        setIsScanning(false)
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                track.stop()
            })
            streamRef.current = null
        }
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current)
            animationIdRef.current = null
        }
        onClose()
    }

    const handleRetry = () => {
        scannedCodesRef.current.clear()
        setIsScanning(true)
        setError(null)
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={600}>
            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Scan QR Code</h2>
                    
                </div>

                {hasPermission === null && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">
                            Requesting camera permission...
                        </p>
                    </div>
                )}

                {hasPermission === false && (
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">
                            {error || 'Camera permission denied'}
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Please enable camera access in your browser settings
                            to scan QR codes.
                        </p>
                        <Button variant="solid" onClick={handleRetry}>
                            Try Again
                        </Button>
                    </div>
                )}

                {hasPermission === true && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-full flex items-center gap-3 mb-2">
                            <label className="text-sm text-gray-600">Camera:</label>
                            <select
                                    className="ml-0 sm:ml-2 p-2 rounded border w-full sm:w-auto"
                                value={selectedDeviceId || ''}
                                onChange={(e) => {
                                    const v = e.target.value || null
                                    setSelectedDeviceId(v)
                                }}
                                    aria-label="Select camera"
                                >
                                    {/* Allow a blank option to let browser choose */}
                                {cameraDevices.length === 0 && (
                                    <option value="">Default</option>
                                )}
                                {cameraDevices.map((d) => (
                                    <option key={d.deviceId} value={d.deviceId}>
                                        {d.label || `Camera ${d.deviceId}`}
                                    </option>
                                ))}
                            </select>
                            <button
                                    type="button"
                                    className="ml-0 sm:ml-3 px-3 py-2 border rounded text-sm w-full sm:w-auto"
                                onClick={async () => {
                                    // Toggle between user and environment if labels are not helpful
                                    try {
                                        if (streamRef.current) {
                                            streamRef.current.getTracks().forEach((t) => t.stop())
                                            streamRef.current = null
                                        }
                                        await navigator.mediaDevices.getUserMedia({
                                            video: {
                                                facingMode: 'user',
                                            },
                                        })
                                        // Re-enumerate devices after toggle
                                        const devices = await navigator.mediaDevices.enumerateDevices()
                                        const videoInputs = devices.filter((d) => d.kind === 'videoinput')
                                        setCameraDevices(videoInputs)
                                        setSelectedDeviceId(videoInputs[0]?.deviceId || null)
                                        setError(null)
                                    } catch (e) {
                                        setError('Unable to toggle camera')
                                    }
                                }}
                                    aria-label="Switch camera"
                                >
                                    Switch
                            </button>
                        </div>
                        <div className="relative w-full bg-black rounded-lg overflow-hidden">
                            <video
                                ref={videoRef}
                                className="w-full h-96 object-cover"
                                style={{ display: 'block' }}
                                playsInline
                            />
                            <canvas ref={canvasRef} className="hidden" />
                            {isScanning && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="border-4 border-green-500 rounded-lg w-64 h-64 animate-pulse" />
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            Position the QR code within the frame to scan
                        </p>
                    </div>
                )}

                <div className="mt-6 flex gap-3">
                    <Button
                        variant="plain"
                        className="w-full"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default QRScannerModal
