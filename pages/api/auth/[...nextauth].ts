import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import InstagramProvider from "next-auth/providers/instagram";
import FacebookProvider from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";

import { dbUsers } from "../../../database";


export default NextAuth({

  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: {label: 'Correo', type: 'email', placeholder: 'correo@google.com'},
        password: {label: 'Contraseña:', type: 'label', placeholder: 'Contraseña'},
      },
      async authorize(credentials) {

        console.log(credentials);

        //Validar con la base de datos
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // TwitterProvider({
    //   clientId: "process.env.TWITTER_CONSUMER_KEY",
    //   clientSecret: "process.env.TWITTER_CONSUMER_SECRET",
    //   version: "2.0"
    // }),
    // InstagramProvider({
    //   clientId: process.env.INSTAGRAM_CONSUMER_KEY,
    //   clientSecret: process.env.INSTAGRAM_CONSUMER_SECRET,
    // }),
    // FacebookProvider({
    //   clientId: 'process.env.INSTAGRAM_CONSUMER_KEY',
    //   clientSecret: 'process.env.INSTAGRAM_CONSUMER_SECRET',
    // }),
  ],
  //Custom Pages:
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  session: {
    maxAge: 2592000, //cada 30d
    strategy: 'jwt',
    updateAge: 86400, // cada dia
  },

  //Callbacks
  callbacks: {

    async jwt({token, account, user}) {
      // console.log({token, account, user});

      if(account) {
        token.accessToken = account.access_token;

        switch(account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
          break;

          case 'credentials':
            token.user = user;
          break;
        }
      }

      return token;
    },

    async session({session, token}) {
      // console.log({session, token, user});
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
  }
});


