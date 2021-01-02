/**
 * A Flight Carrier
 *
 */
export interface Carrier {
  readonly iata: string
  readonly name: string
}

export function carrierEquals(carrierA: Carrier, carrierB: Carrier): boolean {
  return carrierA.iata === carrierB.iata && carrierA.name === carrierB.name
}
