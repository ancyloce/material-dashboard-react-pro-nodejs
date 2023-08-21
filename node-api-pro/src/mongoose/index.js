import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const dbConnect = () => {
  mongoose.connection.once("open", () => console.log("DB connection"));
  mongoose.set("strictQuery", false);
  return mongoose.connect(
    `mongodb://${process.env.DB_LINK}?retryWrites=true&w=majority`,
    { keepAlive: true }
  ).then(() => console.log('DB connected')).catch((err) => console.log(err));
};
