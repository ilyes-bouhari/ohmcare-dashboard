import { PayloadState } from "./enums";

export function payloadState(
  payloads: Payloads | undefined,
  device: Device
): PayloadState {
  const unknownState =
    !payloads ||
    !payloads[device._id] ||
    !isAValidPayload(payloads[device._id]);
  const state = unknownState
    ? PayloadState.UNKNOWN
    : isAPresencePayload(payloads[device._id]) &&
      actualPresence(payloads[device._id] as PresencePayload)
      ? PayloadState.PRESENCE
      : PayloadState.FALL;

  return state;
}

function actualPresence({
  payload: { presenceDetected, roomPresenceIndication, trackerTargets },
}: PresencePayload): boolean {
  return (
    presenceDetected && roomPresenceIndication > 0 && trackerTargets.length > 0
  );
}

function isAPresencePayload(obj: object): obj is PresencePayload {
  return "type" in obj && obj.type === PayloadState.PRESENCE;
}

function isAFallPayload(obj: object): obj is FallPayload {
  return "type" in obj && obj.type === PayloadState.FALL;
}

function isAValidPayload(obj: object) {
  return isAPresencePayload(obj) || isAFallPayload(obj);
}
