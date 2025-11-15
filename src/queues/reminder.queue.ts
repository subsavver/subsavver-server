import redis from "../lib/redis";
import { Queue } from "bullmq";

export const reminderQueue = new Queue("reminders", {
  connection: redis,
});
