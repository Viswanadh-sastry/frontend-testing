export type Rule = {
    id?: string
    name?: string
    status?: string
    sql?: string
    sink: SinkConfig[]
}

export type SinkConfig = {
    sinkType: string
    url?: string
    method?: string
    dataTemplate?: string
    headers?: any
    sendSingle?: boolean
}
