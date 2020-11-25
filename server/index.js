const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors());
app.use(express.json());

// APIRoutes
// get single date data
app.get("/cases/:date", async (req, res) => {
    try {
        const { date } = req.params;
        const data = await pool.query("SELECT c.perc_inc, c.death_perc, c.fips, m.state, m.county, c.confirmed_case, c.confirmed_death, m.retail_recreation_index, m.grocery_and_pharmacy_index, m.parks_index, m.transit_station_index, m.workplace_index, m.residential_index\
        FROM covidcase AS c\
        JOIN mobility AS m\
        ON c.fips = m.fips\
        WHERE c.date = $1 AND m.date = $2", [date, date]);
        res.json(data.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// get single county data based on FIPS
app.get("/county/:fips", async (req, res) => {
    try {
        const { fips } = req.params;
        const data = await pool.query("SELECT c.perc_inc, c.death_perc, c.fips, c.date, c.confirmed_case, c.confirmed_death, m.retail_recreation_index, m.grocery_and_pharmacy_index, m.parks_index, m.transit_station_index, m.workplace_index, m.residential_index\
        FROM covidcase AS c\
        LEFT OUTER JOIN mobility AS m\
        ON c.fips = m.fips AND c.date = m.date\
        WHERE c.fips = $1 ORDER BY date", [fips]);
        res.json(data.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// get aggregate data from range date
app.get("/totalcases/:startdate&:enddate", async (req, res) => {
    try {
        const { startdate, enddate } = req.params;
        const data = await pool.query("SELECT sd.fips, sd.state, sd.county, ABS(e_sum-s_sum) AS confirmed_case FROM\
        (SELECT fips, state, county, SUM(confirmed_case) as s_sum\
        FROM covidcase\
        WHERE date = $1\
        GROUP BY state, county, fips) AS sd\
        JOIN\
        (SELECT fips, state, county, SUM(confirmed_case) as e_sum\
        FROM covidcase\
        WHERE date = $2\
        GROUP BY state, county, fips) AS ed\
        ON sd.fips = ed.fips", [startdate, enddate]);
        res.json(data.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// Search Title based on keywork. Case insensitive.
app.get("/research/:keyword", async (req, res) => {
    try {
        let { keyword } = req.params;
        keyword = "%" + keyword + "%";
        const data = await pool.query("SELECT * FROM research\
        WHERE LOWER(title) LIKE LOWER($1) AND LENGTH(publish_time) > 8", [keyword]);
        res.json(data.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// Search Author based on keywork. Case insensitive.
app.get("/author/:keyword", async (req, res) => {
    try {
        let { keyword } = req.params;
        keyword = "%" + keyword + "%";
        const data = await pool.query("SELECT * FROM research\
        WHERE LOWER(authors) LIKE LOWER($1) AND LENGTH(publish_time) > 8", [keyword]);
        res.json(data.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// Set up listening port.
app.listen(5000, () => {
    console.log("Server has started on port 5000.")
})

