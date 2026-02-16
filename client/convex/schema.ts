import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,
    users: defineTable({
        authSubject: v.string(),
        email: v.string(),
        name: v.string(),
        role: v.union(v.literal("admin"), v.literal("moderator"), v.literal("user")),
        createdAt: v.number(),
        updatedAt: v.number(),
        image: v.optional(v.string()), // Kept for UI avatars
    })
        .index("by_authSubject", ["authSubject"])
        .index("by_email", ["email"]),

    channels: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        type: v.union(v.literal("public"), v.literal("private")),
        creatorId: v.optional(v.id("users")),
        isLocked: v.optional(v.boolean()),
        createdAt: v.optional(v.number()),
    }).index("name", ["name"]),

    messages: defineTable({
        channelId: v.id("channels"),
        userId: v.id("users"),
        body: v.string(), // "content" requested, mapping to "body" for consistency or should I change to content?
        // User requested "content". I will use "body" and alias if needed, BUT "content" is better if requested.
        // Actually, earlier code uses "body". I'll use "body" to avoid breaking existing frontend too much, 
        // OR create "content" and update msg.ts?
        // Let's stick to "body" as content.
        format: v.optional(v.union(v.literal("text"), v.literal("image"))),
        updatedAt: v.optional(v.number()),
        deletedAt: v.optional(v.number()),
        deletedBy: v.optional(v.id("users")),
    }).index("channelId", ["channelId"]),
});
