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
    const result = await Knex.select("batting_team")
      .sum("extra_runs as extra_runs")
      .from("match")
      .rightJoin("delivery", "match.id", "delivery.match_id")
      .where({
        season: 2016,
      })
      .groupBy("batting_team");
    fs.writeFileSync(
      "/home/saikrishna/Documents/knexIPL/outputs/3_extra_runs_conceded.json",
      JSON.stringify(result)
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
