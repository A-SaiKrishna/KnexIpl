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
      .select("season", "winner", Knex.raw("count(*) as matches_played"))
      .whereILike("result", "normal")
      .groupBy("season", "winner");
    fs.writeFileSync(
      "/home/saikrishna/Documents/knexIPL/outputs/2_matches_won_per_team_per_year.json",
      JSON.stringify(result)
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
