import dotenv from "dotenv";
import process from "process";
import path from "path";

/*************  ✨ Codeium Command ⭐  *************/
/******  70353955-9652-4e80-9b6a-889acfd3e0df  *******/
export const loadConfig = () => {
    const env = process.env.NODE_ENV ?? "development";
    const filepath = path.join(process.cwd(), `.env.${env}`);
    dotenv.config({ path: filepath });
};
