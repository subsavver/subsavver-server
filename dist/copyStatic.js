"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const src = path_1.default.join(__dirname, "../src/templates"); // source templates
const dest = path_1.default.join(__dirname, "templates"); // copy to dist/templates
if (!fs_1.default.existsSync(src)) {
    console.error("❌ Source templates folder does not exist:", src);
    process.exit(1);
}
fs_1.default.mkdirSync(dest, { recursive: true });
fs_1.default.cpSync(src, dest, { recursive: true });
console.log("✅ Templates copied from src → dist");
