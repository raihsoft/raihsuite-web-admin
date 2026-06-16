type PersonalInfo = {
    location: string
    title: string
    birthday: string
    phoneNumber: string
    dialCode: string
    address: string
    postcode: string
    city: string
    country: string
    facebook: string
    twitter: string
    pinterest: string
    linkedIn: string
}

type OrderHistory = {
    id: string
    item: string
    status: string
    amount: number
    date: number
}

type PaymentMethod = {
    cardHolderName: string
    cardType: string
    expMonth: string
    expYear: string
    last4Number: string
    primary: boolean
}

type Subscription = {
    plan: string
    status: string
    billing: string
    nextPaymentDate: number
    amount: number
}

export type GetCustomersListResponse = {
    list?: Customer[]
    count: number
    results: any[]
    total?: number
    total_count?: number
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Customer = {
    id: string | number
    program_name: string
    first_name: string
    last_name: string
    participant_name: string
    email: string
    phone: string
    place: string
    custom_data: Record<string, unknown>
    created_at: string
    status: string
    img?: string
    name?: string
}
