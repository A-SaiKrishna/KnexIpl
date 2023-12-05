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
    const result = await Knex("match")
      .select("season", Knex.raw("count(*) as matches_played"))
      .groupBy("season");
    fs.writeFileSync(
      "/home/saikrishna/Documents/knexIPL/outputs/1_matches_per_season.json",
      JSON.stringify(result)
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
