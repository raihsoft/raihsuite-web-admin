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
    list: Customer[]
    count: number
    results: Customer[]
}

export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
    order_number: number
    delivery_place: string

}

export type Customer = {
    id: string
    order_by_name: string
    mobile: number
    quantity: number
    delivery_place: string
    zone_id: string
    order_type: string
    is_paid?: boolean
    order_type_display: string
    club_name: string
    order_number: number
    payment_note: string
    status: string
    
}
