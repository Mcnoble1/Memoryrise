import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";

const providers = [
  CredentialsProvider({
    async authorize(credentials) {
      // console.log({ credentials });

      const payload = {
        username: credentials.email,
        password: credentials.password,
      };

      // if (credentials.isPhone) {
      //   user = await usersCollection.findOne({
      //     phone: credentials.phone,
      //   });
      // } else {
      //   user = await usersCollection.findOne({
      //     email: credentials.email,
      //   });
      // }
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(baseUrl + "/api/auth/signin", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const user = await response.json();
      // console.log({ user });

      if (!user || user.status == 401) {
        throw new Error("Either email or password is incorrect!");
      }

      // console.log(user);

      if (!user.active) {
        throw new Error("Your account has been locked! Please contact administrator!");
      }

      return user;
    },
  }),

  ///api/auth/callback/google
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // authorization: {
    //   params: {
    //     prompt: "consent",
    //     access_type: "offline",
    //     response_type: "code",
    //   },
    // },
  }),

  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  }),

  TwitterProvider({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    version: "2.0", // opt-in to Twitter OAuth 2.0
  }),
];

const callbacks = {
  // Getting the JWT token from API response
  async jwt({ token, user, account }) {
    if (user) {
      if (account.provider == "credentials") {
        token.userID = user.id.toString();
        token.roles = user.roles;
      } else {
        // console.log(user);
        token.userID = user.id.toString();
      }
    }

    return token;
  },

  async session({ session, token, user }) {
    // console.log("Sess", { session, token, user });

    if (token) {
      session.userID = token.userID;
      session.roles = token.roles;
    }

    return session;
  },
  async signIn({ account, profile }) {
    // if (account.provider === "google") {
    //   return profile.email_verified && profile.email.endsWith("@gmail.com");
    // }
    return true; // Do different verification for other providers that don't have `email_verified`
  },
};

const options = {
  providers,
  callbacks,
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  jwt: {
    encryption: true,
    secret: process.env.JWT_SECRET,
    signingKey: process.env.JWT_SIGNING_KEY,
    encryptionKey: process.env.JWT_ENCRYPTION_KEY,
    // https://github.com/nextauthjs/next-auth/issues/484#issuecomment-753894088
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    // maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.JWT_SECRET,
  // adapter: MongoDBAdapter(clientPromise),
};

export default (req, res) => NextAuth(req, res, options);
