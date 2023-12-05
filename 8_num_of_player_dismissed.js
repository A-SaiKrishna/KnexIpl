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
    const result = await Knex.with("table1", (db) => {
      db.select("player_dismissed")
        .select(
          Knex.raw(
            "CASE WHEN dismissal_kind LIKE ? THEN fielder ELSE bowler END AS wicket_taker",
            ["%run out%"]
          )
        )
        .select(
          Knex.raw(
            "COUNT(CASE WHEN dismissal_kind LIKE ? THEN fielder ELSE bowler END) AS times",
            ["%run out%"]
          )
        )
        .from("delivery")
        .whereNot("player_dismissed", "")
        .andWhereNot("dismissal_kind", "retired hurt")
        .groupBy("player_dismissed", "wicket_taker");
    })
      .with("table2", (db) => {
        db.select("player_dismissed")
          .max("times as maxtimes")
          .from("table1")
          .groupBy("player_dismissed");
      })
      .select(
        "table1.player_dismissed",
        "table1.wicket_taker",
        "table2.maxtimes"
      )
      .from("table1")
      .join("table2", (builder) => {
        builder
          .on("table1.player_dismissed", "=", "table2.player_dismissed")
          .andOn("table1.times", "=", "table2.maxtimes");
      });

    fs.writeFileSync(
      "/home/saikrishna/Documents/knexIPL/outputs/8_num_of_player_dismissed.json",
      JSON.stringify(result)
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
