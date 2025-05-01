export type Rule = {
    id?: string
    name?: string
    status?: string
    sql?: string
    sink: SinkConfig[]
    options?: {
        isEventTime: boolean
        sendMetaToSink: boolean
        sendError: boolean
        qos: number
        debug: boolean
        logFilename: string
        lateTolerance: number
        concurrency: number
        bufferLength: number
        checkpointInterval: number
        restartStrategy?: {
            attempts?: number
            delay?: number
            multiplier?: number
            maxDelay?: number
            jitter?: number
        }
        cron?: string
        duration?: string
        cronDatetimeRange?: any | null
    }
}

export type SinkConfig = {
    sinkType: string
    url?: string
    method?: string
    bodyType?: string
    dataTemplate?: string
    headers?: any
    timeout?: number
    debugResp?: boolean
    insecureSkipVerify?: boolean
    sendSingle?: boolean
    options?: {
        concurrency: number
        bufferLength: number
        retryInterval: number
        retryCount: number
        cacheLength: number
        cacheSaveInterval: number
        runAsync: boolean
        omitIfEmpty: boolean
    }
}
