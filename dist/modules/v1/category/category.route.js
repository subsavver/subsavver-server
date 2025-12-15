"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleMiddleware_1 = require("../../../middlewares/roleMiddleware");
const category_controller_1 = __importDefault(require("./category.controller"));
const validation_1 = require("../../../middlewares/validation");
const category_validation_1 = require("./category.validation");
const authenticate_1 = __importDefault(require("../../../middlewares/authenticate"));
const router = (0, express_1.Router)();
router.use(authenticate_1.default);
router.get("/", category_controller_1.default.getCategories);
router.post("/", (0, roleMiddleware_1.authorize)(["ADMIN"]), (0, validation_1.validateBody)(category_validation_1.createCategorySchema), category_controller_1.default.createCategory);
router.get("/:id", (0, roleMiddleware_1.authorize)(["ADMIN"]), category_controller_1.default.getCategoryById);
router.patch("/:id", (0, roleMiddleware_1.authorize)(["ADMIN"]), (0, validation_1.validateBody)(category_validation_1.createCategorySchema), category_controller_1.default.updateCategory);
router.delete("/:id", (0, roleMiddleware_1.authorize)(["ADMIN"]), category_controller_1.default.deleteCategory);
exports.default = router;
