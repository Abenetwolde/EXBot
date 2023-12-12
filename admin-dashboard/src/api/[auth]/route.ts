
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
 debug: true, // Enable debugging
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},

            async authorize(credentials) {
                const { email, password } = credentials;
console.log("loginnnnnnnnnnnnnnnnnnnnn")
                try {

                    const response = await axios.post("localhost:5000/api/admin", { email, password });
                    if (response.data.token) {
                        // Extract the token from the API response
                        const token = response.data.token;
                  
                        // Create a user object using the extracted token
                        const user = {
                          email: email,
                          // You can include additional user information if needed
                        };
                  
                        return Promise.resolve(user);
                      } else {
                        return Promise.resolve(null);
                      }
                } catch (error) {
                    console.log("Error: ", error);
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET||"sjsfesdfeds",
    pages: {
        signIn: "/",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
