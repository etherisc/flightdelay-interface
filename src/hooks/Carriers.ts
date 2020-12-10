import { useMemo } from 'react'
import { Carrier } from '../entities/carrier'

export function useAllCarriers(): { [iata: string]: Carrier } {
  return useMemo(() => {
    return {
      LH: { iata: 'LH', name: 'Lufthansa' } as Carrier,
      AF: { iata: 'AF', name: 'Air France' } as Carrier,
      UA: { iata: 'UA', name: 'United Airlines' } as Carrier,
      KLM: { iata: 'KLM', name: 'KLM' } as Carrier
    }
  }, [])
}
