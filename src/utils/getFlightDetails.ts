import { Flight, isDefinedFlight } from '../entities/flight'

export async function getFlightSchedule(flight: Flight) {
  if (!isDefinedFlight(flight)) {
    return {}
  }

  const flightStatsBaseURL = 'https://fs-api.etherisc.com'
  const flightScheduleEndpoint = '/schedule'
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

  return json
}

export async function getFlightRatings(flight: Flight) {
  if (!isDefinedFlight(flight)) {
    return {}
  }

  const flightStatsBaseURL = 'https://fs-api.etherisc.com'
  const flightRatingsEndpoint = '/ratings'
  const { carrier, flightNumber } = flight

  const apiURL = `${flightStatsBaseURL}${flightRatingsEndpoint}/${carrier.iata}/${flightNumber}`

  let response
  try {
    response = await fetch(apiURL)
  } catch (error) {
    throw new Error(`Failed to get flight ratings ${apiURL}`)
  }

  if (!response.ok) throw new Error(`Failed to get flight ratings ${apiURL}`)

  const json = await response.json()

  return json
}
/*
{
 "request": {
  "carrier": {
   "requestedCode": "LH",
   "fsCode": "LH"
  },
  "flightNumber": {
   "requested": "117",
   "interpreted": "117"
  },
  "departing": true,
  "url": "https://api.flightstats.com/flex/schedules/rest/v1/json/flight/LH/117/departing/2020/12/30",
  "date": {
   "year": "2020",
   "month": "12",
   "day": "30",
   "interpreted": "2020-12-30"
  }
 },
 "scheduledFlights": [
  {
   "carrierFsCode": "LH",
   "flightNumber": "117",
   "departureAirportFsCode": "MUC",
   "arrivalAirportFsCode": "FRA",
   "departureTime": "2020-12-30T18:05:00.000",
   "arrivalTime": "2020-12-30T19:05:00.000",
   "stops": 0,
   "departureTerminal": "2",
   "arrivalTerminal": "1",
   "flightEquipmentIataCode": "32N",
   "isCodeshare": false,
   "isWetlease": false,
   "serviceType": "J",
   "serviceClasses": [
    "F",
    "J",
    "Y"
   ],
   "trafficRestrictions": [],
   "codeshares": [
    {
     "carrierFsCode": "AI",
     "flightNumber": "8806",
     "serviceType": "J",
     "serviceClasses": [
      "Y"
     ],
     "trafficRestrictions": [
      "Q"
     ],
     "referenceCode": 10602352
    },
    {
     "carrierFsCode": "CA",
     "flightNumber": "6100",
     "serviceType": "J",
     "serviceClasses": [
      "R",
      "J",
      "Y"
     ],
     "trafficRestrictions": [
      "G"
     ],
     "referenceCode": 10602351
    },
    {
     "carrierFsCode": "ET",
     "flightNumber": "1591",
     "serviceType": "J",
     "serviceClasses": [
      "F",
      "J",
      "Y"
     ],
     "trafficRestrictions": [
      "G"
     ],
     "referenceCode": 10602349
    },
    {
     "carrierFsCode": "LA",
     "flightNumber": "8667",
     "serviceType": "J",
     "serviceClasses": [
      "F",
      "Y"
     ],
     "trafficRestrictions": [
      "G"
     ],
     "referenceCode": 10602347
    }
   ],
   "referenceCode": "1455-1489522--"
  }
 ],
 "appendix": {
  "airlines": [
   {
    "fs": "LA",
    "iata": "LA",
    "icao": "LAN",
    "name": "LATAM Airlines",
    "active": true
   },
   {
    "fs": "AI",
    "iata": "AI",
    "icao": "AIC",
    "name": "Air India",
    "active": true
   },
   {
    "fs": "LH",
    "iata": "LH",
    "icao": "DLH",
    "name": "Lufthansa",
    "active": true
   },
   {
    "fs": "CA",
    "iata": "CA",
    "icao": "CCA",
    "name": "Air China LTD",
    "active": true
   },
   {
    "fs": "ET",
    "iata": "ET",
    "icao": "ETH",
    "name": "Ethiopian Airlines",
    "active": true
   }
  ],
  "airports": [
   {
    "fs": "FRA",
    "iata": "FRA",
    "icao": "EDDF",
    "faa": "",
    "name": "Frankfurt Airport",
    "city": "Frankfurt",
    "cityCode": "FRA",
    "countryCode": "DE",
    "countryName": "Germany",
    "regionName": "Europe",
    "timeZoneRegionName": "Europe/Berlin",
    "weatherZone": "",
    "localTime": "2020-12-27T09:58:42.142",
    "utcOffsetHours": 1,
    "latitude": 50.048952,
    "longitude": 8.573678,
    "elevationFeet": 381,
    "classification": 1,
    "active": true
   },
   {
    "fs": "MUC",
    "iata": "MUC",
    "icao": "EDDM",
    "faa": "",
    "name": "Franz Josef Strauss Airport",
    "city": "Munich",
    "cityCode": "MUC",
    "countryCode": "DE",
    "countryName": "Germany",
    "regionName": "Europe",
    "timeZoneRegionName": "Europe/Berlin",
    "weatherZone": "",
    "localTime": "2020-12-27T09:58:42.142",
    "utcOffsetHours": 1,
    "latitude": 48.353005,
    "longitude": 11.790143,
    "elevationFeet": 1486,
    "classification": 1,
    "active": true
   }
  ],
  "equipments": [
   {
    "iata": "32N",
    "name": "Airbus A320neo",
    "turboProp": false,
    "jet": true,
    "widebody": false,
    "regional": false
   }
  ]
 }
}
 */
