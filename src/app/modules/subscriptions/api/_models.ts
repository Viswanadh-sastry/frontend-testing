export type Subscription = {
    id?: string
    name?: string
    description?: string
    categories?: string
    labels?: string
    receiver?: string
    channels?: any[]
    resendInterval?: string
    resendLimit?: number
    adminState?: string
    created_at: string
}
