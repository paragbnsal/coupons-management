import dotenv from "dotenv";
import server from "./server.js";
import connectDB from "./utils/dbUtils.js";

dotenv.config();
const PORT = process.env.API_PORT || 5001;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`App server listening on ${PORT}`);
    console.log("--------------------------------------");
  });
});
