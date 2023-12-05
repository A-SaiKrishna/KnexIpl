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
      .select("winner")
      .count("winner as no_of_times")
      .where("result", "=", "normal")
      .andWhere("winner", Knex.raw("??", ["toss_winner"]))
      .groupBy("winner");

    fs.writeFileSync(
      "/home/saikrishna/Documents/knexIPL/outputs/5_won_toss_win_match.json",
      JSON.stringify(result)
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
