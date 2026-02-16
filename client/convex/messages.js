"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.send = void 0;
const server_1 = require("./_generated/server");
const values_1 = require("convex/values");
exports.send = (0, server_1.mutation)({
    args: { author: values_1.v.string(), message: values_1.v.string(), room: values_1.v.string(), time: values_1.v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", args);
    },
});
exports.list = (0, server_1.query)({
    args: { room: values_1.v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .filter((q) => q.eq(q.field("room"), args.room))
            .collect();
    },
});
