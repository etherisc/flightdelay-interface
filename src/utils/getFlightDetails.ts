import { Flight, isDefinedFlight } from '../entities/flight'

const flightStatsBaseURL = 'https://fs-api.etherisc.com/api/v1'
const flightRatingsEndpoint = '/ratings'
const flightScheduleEndpoint = '/schedule'
const flightQuoteEndpoint = '/quote'

export async function getFlightSchedule(flight: Flight) {
  if (!isDefinedFlight(flight)) {
    return {}
  }

  const { carrier, flightNumber, departureDate } = flight

  const yearMonthDay = departureDate ? departureDate.format('YYYY/MM/DD') : ''
  const apiURL = `${flightStatsBaseURL}${flightScheduleEndpoint}/${carrier.iata}/${flightNumber}/${yearMonthDay}`

  let response
  try {
    response = await fetch(apiURL)
  } catch (error) {
    throw new Error(`Failed to get flight Details ${apiURL}`)
  }

  if (!response.ok) throw new Error(`Failed to get flight Details ${apiURL}`)

  const json = await response.json()
  console.log(json)
  return json
}

export async function getFlightRatings(flight: Flight) {
  if (!isDefinedFlight(flight)) {
    return {}
  }

  const { carrier, flightNumber } = flight

  const apiURL = `${flightStatsBaseURL}${flightRatingsEndpoint}/${carrier.iata}/${flightNumber}`

  let response
  try {
    response = await fetch(apiURL)
  } catch (error) {
    throw new Error(`Failed to get flight ratings ${apiURL}`)
  }

  if (!response.ok) throw new Error(`Failed to get flight ratings ${apiURL}`)

  return await response.json()
}

export async function getFlightQuote(premium: string, flight: Flight) {
  if (!isDefinedFlight(flight)) {
    return {}
  }

  const premiumInCents = Number(premium) * 100
  const premiumAmount = Number(premiumInCents)
    .toFixed(0)
    .toString()

  const { carrier, flightNumber } = flight

  const apiURL = `${flightStatsBaseURL}${flightQuoteEndpoint}/${premiumAmount}/${carrier.iata}/${flightNumber}`

  let response
  try {
    response = await fetch(apiURL)
  } catch (error) {
    throw new Error(`Failed to get flight ratings ${apiURL}`)
  }

  if (!response.ok) throw new Error(`Failed to get flight ratings ${apiURL}`)

  return await response.json()
}
