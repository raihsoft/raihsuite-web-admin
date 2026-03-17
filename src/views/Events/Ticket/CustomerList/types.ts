export type Ticket = {
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
}

export type GetTicketsListResponse = {
    list: Ticket[]
    total: number
    results: Ticket[]
}

export type TicketFilter = {
    status?: string[]
    event_id?: string
}
