const { Pool, Client } = require('pg')

const connectionString =process.env.DATABASE_URL || 'postgres://vkejukmmrwnjso:731b607700772429a7004ac8e686048522d8f0fe8cd628292f5f5cffda96df08@ec2-52-70-45-163.compute-1.amazonaws.com:5432/d8i96e988qthdl'

// const pool = new Pool({
//     connectionString
// })

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  idle_in_transaction_session_timeout: 30000,
  connectionTimeoutMillis:20000
})
client.connect()
module.exports = {
  query: (text, params) => client.query(text, params),
}
