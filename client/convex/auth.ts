import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
    providers: [
        Password({
            // We use the Password provider's "email" field as our username.
            // So everywhere in the client, send { email: username, password }.
            profile(params) {
                const username = String(params.email ?? "").trim();

                // IMPORTANT: never return null/undefined here
                return {
                    email: username,       // stored value (acts as username)
                    name: username,        // set to username (since you don't collect a name)
                    username,              // optional extra field for your app
                    role: "user",
                };
            },
        }),
    ],
});
