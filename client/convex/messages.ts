import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
    args: { author: v.string(), message: v.string(), room: v.string(), time: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", args);
    },
});

export const list = query({
    args: { room: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .filter((q) => q.eq(q.field("room"), args.room))
            .collect();
    },
});
