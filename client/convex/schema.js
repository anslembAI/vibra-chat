"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.default = (0, server_1.defineSchema)({
    messages: (0, server_1.defineTable)({
        author: values_1.v.string(),
        message: values_1.v.string(),
        room: values_1.v.string(),
        time: values_1.v.string(),
    }),
});
