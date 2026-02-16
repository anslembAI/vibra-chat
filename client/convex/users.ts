
// This file can contain additional user helpers
import { query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

/**
 * Returns the current user's full profile document or null if not authenticated.
 */
export const current = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (userId === null) {
            return null;
        }
        return await ctx.db.get(userId);
    },
});

/**
 * Helper to get user by auth subject if needed (this is essentially getUserId wrapper if subject is ID)
 * If authSubject is external ID, we would query.
 */
export const getByAuthSubject = query({
    args: { subject: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_authSubject", (q) => q.eq("authSubject", args.subject))
            .first();
    },
});
