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
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Customer = {
    id: number | string
    name: string
    code: string
    description: string
    tenant: number
    start_date: string
    end_date: string
    status: string
    custom_data?: Record<string, any>
    img?: string
    participant_count?: number
    participants_count?: number
    participants?: any[]
}