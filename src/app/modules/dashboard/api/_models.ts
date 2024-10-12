export type Dashboard = {
    id: string
    name: string
    description: string
    data?: string
    layout?: string
    created_by?: string
    created_at?: string
    updated_at?: string
}

export type Widget = {
    id: string
    name: string
    layout?: string
    devices?: string
    timeline?: number
    fromDate?: string
    toDate?: string
    interval?: string
}
