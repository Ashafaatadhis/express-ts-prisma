"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = require("../../middleware/Auth");
const router = (0, express_1.Router)();
router.get("/user", Auth_1.passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({ tes: "tes" });
});
router.post("/user", (req, res) => {
    res.json({ tes: "tes" });
});
exports.default = router;
