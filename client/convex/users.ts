import { query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

/**
 * Helper to ensure user exists. 
 * Note: With @convex-dev/auth, getUserId() usually returns the ID of a 'users' doc.
 * However, if we need to robustly map identity to user for external auth, we use strict checks.
 * Here we follow the requested logic using getUserIdentity.
 */
export async function getOrCreateUser(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // 1. Try to find user by authSubject (if populated)
    // Note: identity.subject is usually the unique ID from the provider.
    const userBySubject = await ctx.db
        .query("users")
        .withIndex("by_authSubject", (q) => q.eq("authSubject", identity.subject))
        .first();

    if (userBySubject) return userBySubject;

    // 2. Fallback: If using convex-dev/auth, identity.subject MIGHT be the user ID if configured that way,
    // but usually it is the PROVIDER's subject. 
    // If we are here, and using Password auth, maybe we rely on getUserId?
    const userId = await auth.getUserId(ctx);
    if (userId) {
        const user = await ctx.db.get(userId);
        if (user) {
            // Optional: Backfill authSubject if missing?
            // await ctx.db.patch(userId, { authSubject: identity.subject });
            return user;
        }
    }

    // 3. Create if missing (Only valid in Mutation)
    // Check if we are in a mutation context by checking for 'insert'
    const db = ctx.db as any;
    if (db.insert && identity) {
        // We are in a mutation, we can create the user
        // Ensure username is set
        const username = identity.name || identity.email || `user_${Date.now()}`;

        // Check if username is taken? If so, we might fail or append
        // But let's assume unique for now or let db throw
        const newUserId = await db.insert("users", {
            name: identity.name,
            username: username, // Use name as username? Or email? Identity from Password provider has name=username.
            email: identity.email,
            role: "user",
            authSubject: identity.subject,
            image: identity.pictureUrl,
            // createdAt: Date.now(), // Convex handles _creationTime
        });
        return await ctx.db.get(newUserId);
    }

    return null;
}

/**
 * Returns the current user's full profile document or null if not authenticated.
 */
export const current = query({
    args: {},
    handler: async (ctx) => {
        return await getOrCreateUser(ctx);
    },
});

/**
 * Helper to get user by auth subject if needed
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
