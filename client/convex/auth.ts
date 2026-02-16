import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
    providers: [
        Password({
            // Keep it simple: guarantee strings, never undefined.
            profile(params) {
                const email = String(params.email ?? "").trim().toLowerCase();
                const name = (params.name ? String(params.name) : email.split("@")[0]) || "User";

                return {
                    email,
                    name,
                    role: "user",
                };
            },
        }),
    ],
});
