"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, morgan_1.default)("combined", {
    stream: fs_1.default.createWriteStream(path_1.default.join(__dirname + "/../src/log", "file.log"), {
        flags: "a",
    }),
}));
app.use(express_1.default.json());
app.use(routes_1.default);
app.all("*", (req, res) => {
    res.status(404).json({ error: "404 Not Found" });
});
// Error handling middleware
app.use(errorHandler_1.errorHandler);
exports.default = app;
