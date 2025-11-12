import dayjs from "../lib/dayjs";

function getNextCycleDate(currentDate: Date, frequency: "monthly" | "yearly" | "weekly") {
  const d = dayjs(currentDate);
  if (frequency === "yearly") return d.add(1, "year").toDate();
  if (frequency === "weekly") return d.add(1, "week").toDate();
  return d.add(1, "month").toDate(); // default monthly
}

export { getNextCycleDate };
