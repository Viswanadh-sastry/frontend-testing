export type Application = {
    id?: string
    tenantId?: string
    name?: string
    description?: string
    tags?: any
}

export type Device = {
    devEui?: string
    applicationId?: string
    name?: string
    description?: string
    deviceProfileId?: string
    deviceProfileName?: string
    deviceStatus?: any
    skipFcntCheck?: boolean
    isDisabled?: boolean
    joinEui?: string
    variables?: any
    tags?: any
    createdAt?: string
    updatedAt?: string
    lastSeenAt?: string
    nwkKey?: string
}

export type Integration = {
    id?: string
    applicationId?: string
    kind?: string
    encoding?: string
    eventEndpointUrl?: string
    headers?: any
}
