import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

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

export const ensureMe = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const authSubject = identity.subject;

        const existing = await ctx.db
            .query("users")
            .withIndex("by_authSubject", (q) => q.eq("authSubject", authSubject))
            .unique();

        if (existing) return existing;

        const email = String(identity.email ?? "").trim().toLowerCase();
        const name = String(identity.name ?? email.split("@")[0] ?? "User");

        const userId = await ctx.db.insert("users", {
            authSubject,
            email,
            name,
            role: "user",
            isAdmin: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return await ctx.db.get(userId);
    },
});

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
