export type History = {
    id?: string
    subtopic?: string
    publisher?: string
    protocol?: any
    name: string
    unit: string
    value: string
    string_value: string
    bool_value: boolean
    data_value: any
    sum: number
    sentAt: string
    time: string
}

export type Channels = {
    id?: string
    name?: string
    description?: string
    parent_id?: string
    metadata?: any
    created_at: string
    status: string
    checkbox: boolean
}

export type Thing = {
    id?: string
    name?: string
    tags?: string[]
    metadata?: any
    credentials: {
        identity: string
        secret: string
    }
    created_at: string
    updated_at: string
    isConnected: boolean
    status: string
    checkbox: boolean
}

export type Group = {
    id?: string
    name?: string
    description?: string
    metadata?: any
    created_at: string
    status: string
    updated_at: string
    children: Group[]
    tree: boolean
    checkbox: boolean
}
