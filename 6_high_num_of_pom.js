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
      db.select("season", "player_of_match")
        .count("player_of_match as no_of_times")
        .from("match")
        .groupBy("season", "player_of_match");
    })
      .with("table2", (db) => {
        db.select("season")
          .max("no_of_times as highest")
          .from("table1")
          .groupBy("season");
      })
      .select("table1.season", "table1.player_of_match", "table2.highest")
      .from("table1")
      .join("table2", (builder) => {
        builder
          .on("table1.season", "=", "table2.season")
          .andOn("table1.no_of_times", "=", "table2.highest");
      });

    fs.writeFileSync(
      "/home/saikrishna/Documents/knexIPL/outputs/6_high_num_of_pom.json",
      JSON.stringify(result)
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
