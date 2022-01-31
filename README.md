## Wisely Web Test

See specification document [here](https://docs.google.com/document/d/1_TnxJx21MLbQOrlJ5C1lZJP8Zw70QfLICTn7YSmyoYM/edit?usp=sharing)

# Steps

- run `docker-compose up`

# Benchmarking

- run `node ./api/test/index.mjs`

# API Definiton (For relevant routes):

createRestaurant: POST `/restaurant`
createInventory: POST `/inventory`
Sample body:

```json
{
  "restaurantId": 41,
  "maxReservations": 3,
  "reservationGuests": 3,
  "startDate": "2022-01-30T04:00:00.000Z",
  "endDate": "2022-01-30T16:00:00.000Z"
}
```

createReservation: POST `/reservation`
Sample body:

```json
{
  "restaurantId": 41,
  "name": "Michael",
  "email": "sportnak@",
  "guestCount": 3,
  "time": "2022-01-30T16:15:00.000Z"
}
```

getAvailability: GET `/reservation/{restaurantId}/availability?start={ISO8601}&end={ISO8601}`
