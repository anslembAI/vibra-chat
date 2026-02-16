import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
    // We are using the "email" field to store the username for simplicity with the Password provider
    providers: [Password({
        profile(params) {
            return {
                email: params.email as string,
                name: params.name as string,
                username: params.email as string, // Treat the input "email" as username
                role: "user",
            };
        },
    })],
});
