import IORedis from "ioredis";
import config from "../config/config";

const redis = new IORedis(config.redis.url, {
  maxRetriesPerRequest: null,
});

export default redis;
