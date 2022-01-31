// // const { BaseService } = require('./BaseService')

// // const { MappedModelNames } = require('../models')
// const MappedModelNames = ['reservation', 'guest', 'restaurant', 'inventory']

// for (const modelName of MappedModelNames) {
//   test(`BaseService runs correctly for ${modelName}`, () => {
//     /**
//      * const service = new BaseService(modelName)
//      *  assert:
//      *    - create with bad data
//      *    - get with no id and bad id
//      *    - mappers run and are defined
//      */
//   })
// }

// test('GuestService: get & create', () => {
//   /**
//    * const service = new GuestService()
//    * assert:
//    *  - each method calls super
//    */
// })

// test('GuestService: getOrCreate', () => {
//   /**
//    * const service = new GuestService()
//    * assert:
//    *  - fails on bad data with 500 error result
//    *  - creates a guest when one isn't found
//    *  -
//    */
// })

// test('InventoryService: create', () => {
//   /**
//    * const service = new InventoryService()
//    * assert:
//    *  - validates provided dates
//    *  - calls for overlapping inventory
//    *  - returns correctly if overlapping result
//    */
// })

// test('InventoryService: getOverlappingInventory', () => {
//   /**
//    * const service = new InventoryService()
//    * assert:
//    *  - calls inventoryByDateQuery with correct param
//    */
// })

// test('InventoryService: getInventoryForRestaurant', () => {
//   /**
//    * const service = new InventoryService()
//    * assert:
//    *  - calls inventoryByDateQuery with correct param
//    */
// })

// test('InventoryService: getInventoryByDateQuery', () => {
//   /**
//    * const service = new InventoryService()
//    * assert:
//    *  - fails with bad date query
//    *  - correclty maps results
//    */
// })
