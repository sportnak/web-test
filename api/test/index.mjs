import fetch from 'node-fetch'
import faker from 'faker'
import autocannon from 'autocannon'

const startRange = '2022-01-30T15:30:00.000Z'
const endRange = '2022-03-31T15:30:00.000Z'
const stuffToCheck = []
const validIntervals = {}
const MAX_PARTY_RANGE = 20

// one second * 60 = 1 minute * 15
const FIFTEEN_MINUTES = 1000 * 60 * 15
function setTimeIntervals(restaurantId, start, end, max) {
  if (!start || !end || isNaN(start.getTime?.()) || isNaN(end.getTime?.())) {
    return []
  }

  let baseTime = start.getTime()
  if (end < start) {
    return []
  }
  if (!validIntervals[restaurantId]) {
    validIntervals[restaurantId] = {}
  }

  while (baseTime <= end.getTime()) {
    const time = new Date(baseTime)
    validIntervals[restaurantId][time.toISOString()] = max
    baseTime += FIFTEEN_MINUTES
  }
}

function isInvaildTimeIntervals(restaurantId, start, end) {
  if (validIntervals[restaurantId] == null) {
    return false
  }

  let baseTime = start.getTime()
  while (baseTime <= end.getTime()) {
    const time = new Date(baseTime)
    if (validIntervals[restaurantId]?.[time.toISOString()] != null) {
      return true
    }
    baseTime += FIFTEEN_MINUTES
  }

  return false
}

const args = process.argv.slice(2)
let REST_COUNT = 1
let I_COUNT = 1
for (const arg of args) {
  const restaurants = arg.match(/--restaurants=(\d+)/)
  if (restaurants?.[1]) {
    REST_COUNT = parseInt(restaurants[1])
    continue
  }

  const inventories = arg.match(/--inventory=(\d+)/)
  if (inventories?.[1]) {
    I_COUNT = parseInt(inventories[1])
  }
}

const results = []
async function bandwithTest() {
  const restaurants = await Promise.all(
    new Array(REST_COUNT).fill(1).map(async _ => {
      return await createRestaurant()
    })
  )

  for (const restaurantId of restaurants) {
    console.log(`Creating ${I_COUNT} inventory for ${restaurantId}`)
    for (let i = 0; i < I_COUNT; i++) {
      await createInventory(restaurantId)
    }
  }

  console.log(`Creating reservations for`)
  const cannon = autocannon({
    url: 'http://localhost:9090/reservation',
    connections: 20, //default
    pipelining: 1, // default
    duration: 10, // default
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    requests: [
      {
        setupRequest: context => {
          context.body = JSON.stringify(generateReservation(restaurants))
          return context
        },
        onResponse: statusCode => {
          results.push(statusCode)
        },
      },
    ],
  })
  autocannon.track(cannon, { renderProgressBar: true })

  return
}
export async function createRestaurant() {
  const res = await fetch('http://localhost:9090/restaurant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: faker.company.companyName(),
    }),
  })

  const response = await res.json()
  return response.value.id
}

async function createInventory(restaurantId) {
  const startInventory = new Date(faker.date.between(startRange, endRange))
  startInventory.setMinutes(0)
  startInventory.setSeconds(0)
  startInventory.setMilliseconds(0)
  const startHours = startInventory.getHours()
  const endInventory = new Date(startInventory.toISOString())
  endInventory.setHours(startHours + faker.datatype.number(12) + 1)
  const maxReservations = faker.datatype.number(20)
  const res = await fetch('http://localhost:9090/inventory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      restaurantId: restaurantId,
      maxReservations,
      reservationGuests: faker.datatype.number(MAX_PARTY_RANGE),
      startDate: startInventory.toISOString(),
      endDate: endInventory.toISOString(),
    }),
  })

  const response = await res.json()
  if (response.error) {
    if (isInvaildTimeIntervals(restaurantId, startInventory, endInventory)) {
      console.log('properly caught inventory collision')
    } else {
      console.log('funny business: ', response)
      stuffToCheck.push({ restaurantId, startInventory, endInventory })
    }
  } else {
    if (isInvaildTimeIntervals(restaurantId, startInventory, endInventory)) {
      console.log('failed to catch inventory collision')
      stuffToCheck.push({
        validInterval: validIntervals[restaurantId],
        restaurantId,
        startInventory,
        endInventory,
        response: JSON.stringify(response.value),
      })
    } else {
      setTimeIntervals(restaurantId, startInventory, endInventory, maxReservations)
    }
  }
}

function generateReservation(restaurantIds) {
  const randomIndex2 = Math.max(0, faker.datatype.number(restaurantIds.length) - 1)
  const restaurantId = restaurantIds[randomIndex2]
  const times = Object.keys(validIntervals[restaurantId])
  const randomIndex = Math.max(0, faker.datatype.number(times.length) - 1)
  const time = times[randomIndex]
  const hasRoom = validIntervals[restaurantId][time] !== 0
  const body = {
    restaurantId,
    name: faker.name.findName(),
    email: `${faker.lorem.word()}@gmail.com`,
    guestCount: faker.datatype.number(MAX_PARTY_RANGE),
    time,
  }

  return body
}

let dropped = 0
async function createReservation(restaurantId) {
  const times = Object.keys(validIntervals[restaurantId])
  const randomIndex = Math.max(0, faker.datatype.number(times.length) - 1)
  const time = times[randomIndex]
  const hasRoom = validIntervals[restaurantId][time] !== 0
  const body = generateReservation(restaurantId)

  // const startDate = new Date()
  // console.time(body.name)
  fetch('http://localhost:9090/reservation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(res => {
      // console.timeEnd(body.name)
      console.log(res.status)
      return res.json()
    })
    .catch(() => {
      console.log('DropCount: ', ++dropped)
    })
  // .then(response => {
  //   if (response.error) {
  //     if (!hasRoom) {
  //       console.log('properly identified full reservation: ', response.error)
  //     } else if (isInvaildTimeIntervals(restaurantId, new Date(time), new Date(time))) {
  //       console.log('properly caught inventory collision', response.error)
  //     } else {
  //       console.log('Error', time, randomIndex)
  //       stuffToCheck.push({ response: JSON.stringify(response.error), restaurantId, time })
  //     }
  //   } else {
  //     if (!hasRoom) {
  //       console.log('Failed to catch full reservation')
  //     }
  //     validIntervals[restaurantId][time] -= 1
  //     // console.log('successful reservation made: ', body)
  //   }
  // })
}

// import cluster from 'cluster'
// import { cpus } from 'os'
// import process from 'process'
// import { request } from 'http'

// const numCPUs = cpus().length

// if (cluster.isMaster) {
//   console.log(`Primary ${process.pid} is running`)

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork()
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`)
//   })
// } else {
bandwithTest()
