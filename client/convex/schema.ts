import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,
    messages: defineTable({
        author: v.string(),
        message: v.string(),
        room: v.string(),
        time: v.string(),
    }),
});
