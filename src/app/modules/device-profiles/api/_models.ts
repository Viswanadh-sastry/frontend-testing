export type DeviceProfile = {
    id?: string
    tenantId?: string
    name?: string
    description?: string
    region?: string
    macVersion?: string
    regParamsRevision?: string
    adrAlgorithmId?: string
    payloadCodecRuntime?: string
    payloadCodecScript?: string
    flushQueueOnActivate?: boolean
    uplinkInterval?: number
    deviceStatusReqInterval?: number
    supportsOtaa?: boolean
    tags?: any
}
