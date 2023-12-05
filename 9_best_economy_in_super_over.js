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
    const result = await Knex.select("bowler")
      .select(
        Knex.raw(
          "ROUND(SUM(total_runs) / " +
            "(SUM(CASE WHEN delivery.noball_runs = 0 AND delivery.wide_runs = 0 THEN 1 ELSE 0 END) / 6 + (SUM(CASE WHEN delivery.noball_runs = 0 AND delivery.wide_runs = 0 THEN 1 ELSE 0 END) % 6)), 2) AS economy"
        )
      )
      .from("match")
      .rightJoin("delivery", "match.id", "delivery.match_id")
      .where({
        is_super_over: 1,
      })
      .groupBy("bowler")
      .orderBy("economy")
      .limit(1);

    fs.writeFileSync(
      "/home/saikrishna/Documents/knexIPL/outputs/9_best_bowler_in_super_over.json",
      JSON.stringify(result)
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
