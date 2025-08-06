import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    debug: process.env.NODE_ENV === "development",
    adapter: PrismaAdapter(db),
    logger: {
        error(code, ...message) {
            console.error(`[NextAuth Error] ${code}:`, ...message);
        },
        warn(code, ...message) {
            console.warn(`[NextAuth Warning] ${code}:`, ...message);
        },
        debug(code, ...message) {
            console.log(`[NextAuth Debug] ${code}:`, ...message);
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                }
            },
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await db.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user || !user.password) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                }
            }
        })
    ],
    session: {
        strategy: "database"
    },
    callbacks: {
        async session({ session, user }) {
            if (user) {
                session.user.id = user.id
                session.user.role = user.role as string
            }
            return session
        },
        async signIn({ user, account, profile }) {
            // Log sign-in attempts for debugging
            console.log(`[NextAuth] Sign-in attempt for user: ${user.email}`);
            console.log(`[NextAuth] Account type: ${account?.type}`);
            console.log(`[NextAuth] Provider: ${account?.provider}`);
            return true;
        },
        async jwt({ token, user, account }) {
            // Log JWT token creation for debugging
            if (user) {
                console.log(`[NextAuth] JWT token created for user: ${user.email}`);
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            console.log(`[NextAuth] Redirect called: ${url} -> ${baseUrl}`);
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },
    pages: {
        signIn: '/auth/signin',
        signUp: '/auth/signup',
    },
    secret: process.env.NEXTAUTH_SECRET
} 