import dotenv from "dotenv";
dotenv.config();

interface Config {
  port: number;
  isProduction: boolean;
  isDevelopment: boolean;
  nodeEnv: string;
}

const env = process.env;

const config: Config = {
  port: Number(env.PORT) || 7000,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",
  nodeEnv: env.NODE_ENV || "development",
};

export default config;
