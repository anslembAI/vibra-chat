import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { requireUser } from "./users";

export const list = query({
    args: { channelName: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const channelName = args.channelName || "General";
        const channel = await ctx.db
            .query("channels")
            .withIndex("by_name", (q) => q.eq("name", channelName))
            .unique();

        if (!channel) return [];

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_channelId", (q) => q.eq("channelId", channel._id))
            .collect();

        // Get unique user IDs
        const userIds = [...new Set(messages.map((msg) => msg.userId))];

        // Fetch users in parallel
        const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));
        const userMap = new Map(users.map((u) => [u?._id, u]));

        return messages.map((msg) => {
            const user = userMap.get(msg.userId);
            return {
                _id: msg._id,
                content: msg.content,
                userId: msg.userId,
                author: user?.name || user?.username || "Unknown",
                avatar: user?.imageUrl || "https://i.pravatar.cc/150?u=unknown",
                type: msg.type || "text",
                time: new Date(msg._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
        });
    },
});

export const send = mutation({
    args: {
        content: v.string(),
        channelName: v.string(), // Send by name for frontend convenience
        type: v.optional(v.union(v.literal("text"), v.literal("poll")))
    },
    handler: async (ctx, args) => {
        // 1. Get current user (strict guard)
        const user = await requireUser(ctx);
        const userId = user._id;

        // 2. Resolve or Create Channel
        let channel = await ctx.db
            .query("channels")
            .withIndex("by_name", (q) => q.eq("name", args.channelName))
            .first();

        if (!channel) {
            // Auto-create "General" or other public channels if they don't exist?
            // For now, auto-create.
            const channelId = await ctx.db.insert("channels", {
                name: args.channelName,
                type: "chat",
                description: "Auto-created channel",
                createdBy: userId,
                createdAt: Date.now(),
            });
            channel = (await ctx.db.get(channelId))!;
        }

        // 3. Insert Message
        await ctx.db.insert("messages", {
            userId: userId,
            content: args.content,
            channelId: channel!._id,
            type: args.type || "text",
            timestamp: Date.now(),
            edited: false,
        });
    },
});
