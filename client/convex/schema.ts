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
        status: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
    }).index("email", ["email"]),

    channels: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        type: v.union(v.literal("public"), v.literal("private")),
        creatorId: v.optional(v.id("users")), // Optional if created by system
    }).index("name", ["name"]),

    messages: defineTable({
        userId: v.id("users"),
        body: v.string(),
        channelId: v.id("channels"),
        format: v.optional(v.union(v.literal("text"), v.literal("image"))),
        updatedAt: v.optional(v.number()),
    }).index("channelId", ["channelId"]),
});
