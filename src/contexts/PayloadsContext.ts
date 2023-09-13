import { createContext } from 'react';

interface PresencePayload {
  type: string
  payload: {
    presenceDetected: boolean
    presenceTargetType: number
    roomPresenceIndication: number
    timestamp: number
    eventId: string
    timestampStr: string
    deviceId: string
    extra: string
    timestampMillis: number
    trackerTargets: []
    presenceRegionMap: object
  }
}

interface FallPayload {
  type: number
  payload: {
    timestamp: number
    statusUpdateTimestamp: boolean
    status: 'fall_detected' | 'fall_exit'
    type: string
    deviceId: string
    endTimestamp: number
    isSimulated: boolean
    exitReason: string
    isLearning: boolean
    extra: string
    isSilent: boolean
    fallLocX_cm: number
    fallLocY_cm: number
    fallLocZ_cm: number
    tarHeightEst: number
    idOfTrigger: string
  }
}

interface Payloads {
  [key: string]: PresencePayload | FallPayload
}

export const PayloadsContext = createContext<Payloads | undefined>(undefined)