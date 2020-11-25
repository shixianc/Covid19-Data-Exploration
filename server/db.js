// Import postgres connector.
const Pool = require("pg").Pool;

// Establish connection to postgres DB server.
const pool = new Pool({
    user: "postgres",
    password: "mYsic8669",
    host: "localhost",
    port: 5432,
    database: "covid-project"
})

module.exports = pool;