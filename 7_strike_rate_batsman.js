const mysql = require("mysql2");
const knex = require("knex");
const fs = require("fs");

const Knex = knex({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "ipl",
  },
});

async function main() {
  try {
    const result = await Knex.select("season", "batsman")
      .select(
        Knex.raw(
          "ROUND(SUM(batsman_runs) * 100 /SUM(CASE WHEN noball_runs =0 AND wide_runs =0 THEN 1 ELSE 0 END),2) AS strike_rate"
        )
      )
      .from("match")
      .join("delivery", "match.id", "delivery.match_id")
      .groupBy("season", "batsman");
    fs.writeFileSync(
      "/home/saikrishna/Documents/knexIPL/outputs/7_strike_rate_batsman.json",
      JSON.stringify(result)
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
