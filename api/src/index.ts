require('source-map-support/register')
import { Sequelize } from 'sequelize-typescript'
import { RouterServer } from './RouterServer'
import * as models from './models'
import cluster from 'cluster'
import { cpus } from 'os'
import process from 'process'

const numCPUs = cpus().length

if (cluster.isMaster) {
  console.log(`Primary ${process.pid} is running`)
  ;(async () => {
    const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING, {
      dialect: 'postgres',
      logging: process.env.LOG === 'debug' ? console.log : false,
      models: Object.keys(models).map(k => models[k]),
    })

    await sequelize.sync({
      alter: true,
    })
  })()

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  console.log(`Fork started ${process.pid}`)
  new RouterServer().start(8080)
  new Sequelize(process.env.DATABASE_CONNECTION_STRING, {
    dialect: 'postgres',
    logging: process.env.LOG === 'debug' ? console.log : false,
    models: Object.keys(models).map(k => models[k]),
  })
}
