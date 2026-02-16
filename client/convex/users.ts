import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

/**
 * Internal helper to find or create a user based on the current auth identity.
 */
async function findOrCreateUser(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // 1. Try to find user by authSubject
    const userBySubject = await ctx.db
        .query("users")
        .withIndex("by_authSubject", (q) => q.eq("authSubject", identity.subject))
        .first();

    if (userBySubject) return userBySubject;

    // 2. Try to find by email/username as fallback (identity.email is our username)
    if (identity.email) {
        const userByEmail = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", identity.email))
            .first();

        if (userByEmail) {
            // Link this user to the authSubject for future lookups
            const db = ctx.db as any;
            if (db.patch) {
                await db.patch(userByEmail._id, { authSubject: identity.subject });
            }
            return userByEmail;
        }
    }

    // 3. Create if missing (Only if in mutation context)
    const db = ctx.db as any;
    if (db.insert) {
        const username = identity.name || identity.email || `user_${Math.floor(Math.random() * 1000000)}`;
        const newUserId = await db.insert("users", {
            name: identity.name,
            username: username,
            email: identity.email,
            role: "user",
            authSubject: identity.subject,
            image: identity.pictureUrl,
            updatedAt: Date.now(),
        });
        return await ctx.db.get(newUserId);
    }

    return null;
}

/**
 * Public mutation to ensure the user exists after sign-in.
 */
export const ensureMe = mutation({
    args: {},
    handler: async (ctx) => {
        const user = await findOrCreateUser(ctx);
        if (!user) throw new Error("Unauthorized");
        return user;
    },
});

/**
 * Returns the current user's full profile document or null if not authenticated.
 */
export const current = query({
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

/**
 * Backend-only helper for mutations to get the current user.
 */
export async function getOrCreateUser(ctx: MutationCtx) {
    return await findOrCreateUser(ctx);
}
