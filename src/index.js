import "dotenv/config";
import { start } from "./core/server";
import { connect } from "./core/database";

const { EXPRESS_PORT } = process.env;

(async function main() {
  // eslint-disable-next-line no-console
  console.log(new Date(), "Initializing...");
  try {
    await connect();
    await start(EXPRESS_PORT);
    // eslint-disable-next-line no-console
    console.log(new Date(), `Server up at port ${EXPRESS_PORT}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start application", error);
  }
})();
