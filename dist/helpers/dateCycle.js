"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextCycleDate = getNextCycleDate;
const dayjs_1 = __importDefault(require("../lib/dayjs"));
function getNextCycleDate(currentDate, frequency) {
    const d = (0, dayjs_1.default)(currentDate);
    if (frequency === "yearly")
        return d.add(1, "year").toDate();
    if (frequency === "weekly")
        return d.add(1, "week").toDate();
    return d.add(1, "month").toDate(); // default monthly
}
