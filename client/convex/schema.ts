import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,
    users: defineTable({
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        email: v.optional(v.string()),
        role: v.optional(v.union(v.literal("user"), v.literal("admin"))),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
    }).index("email", ["email"]),
    messages: defineTable({
        author: v.string(),
        message: v.string(),
        room: v.string(),
        time: v.string(),
    }),
});
