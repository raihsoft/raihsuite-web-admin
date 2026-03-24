import { useState } from 'react'
import { apiScanTicket } from '@/services/CustomersService'

interface ScanTicketRequest {
    token: string
}

interface ScanTicketResponse {
    status?: string
    message?: string
    ticket_id?: string
    [key: string]: any
}

export default function useScanTicket() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [scanResult, setScanResult] = useState<ScanTicketResponse | null>(null)

    const scanTicket = async (token: string) => {
        setIsLoading(true)
        setError(null)
        setScanResult(null)

        try {
            const response = await apiScanTicket<ScanTicketResponse>({
                token,
            })

            setScanResult(response)
            return response
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to scan ticket'
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const reset = () => {
        setError(null)
        setScanResult(null)
    }

    return {
        scanTicket,
        isLoading,
        error,
        scanResult,
        reset,
    }
}
