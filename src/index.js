import "dotenv/config";
import { start } from "./core/server";
import { connect } from "./core/database";

const { EXPRESS_PORT } = process.env;

(async function main() {
  console.log(new Date(), "Initializing...");
  try {
    await connect();
    await start(EXPRESS_PORT);
    console.log(new Date(), `Server up at port ${EXPRESS_PORT}`);
  } catch (error) {
    console.error("Failed to start application", error);
  }
})();
