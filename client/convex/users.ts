import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

/**
 * Public mutation to ensure the user exists after sign-in.
 */
export const ensureMe = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const existing = await ctx.db
            .query("users")
            .withIndex("by_authSubject", (q) => q.eq("authSubject", identity.subject))
            .unique();

        if (existing) return existing;

        const userId = await ctx.db.insert("users", {
            authSubject: identity.subject,
            username: `user_${identity.subject.slice(0, 8)}`,
            role: "user",
            updatedAt: Date.now(),
            // name: identity.name, // Added for basic data sync
            // email: identity.email, // Added for basic data sync
        });

        const created = await ctx.db.get(userId);
        if (!created) throw new Error("Failed to create user profile");
        return created;
    },
});

/**
 * Returns the current authenticated user's profile.
 */
export const me = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        return await ctx.db
            .query("users")
            .withIndex("by_authSubject", (q) => q.eq("authSubject", identity.subject))
            .unique();
    },
});

/**
 * Strict guard for mutations: returns user or throws.
 */
export async function requireUser(ctx: MutationCtx | QueryCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
        .query("users")
        .withIndex("by_authSubject", (q) => q.eq("authSubject", identity.subject))
        .unique();

    if (!user) {
        throw new Error("User profile missing");
    }
    return user;
}

/**
 * Internal helper for other mutations to get the current user.
 */
export async function getOrCreateUser(ctx: MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const existing = await ctx.db
        .query("users")
        .withIndex("by_authSubject", (q) => q.eq("authSubject", identity.subject))
        .unique();

    if (existing) return existing;

    // Creation logic duplicated for standalone mutation safety
    const userId = await ctx.db.insert("users", {
        authSubject: identity.subject,
        username: `user_${identity.subject.slice(0, 8)}`,
        role: "user",
        updatedAt: Date.now(),
    });
    return await ctx.db.get(userId);
}
