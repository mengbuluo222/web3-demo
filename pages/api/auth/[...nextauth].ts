import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { connection } from 'next/server'

// 确保环境变量存在，否则抛出错误或合理处理
const githubId = process.env.GITHUB_ID
const githubSecret = process.env.GITHUB_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET

console.log("GitHub ID:", githubId);


export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: githubId,
      clientSecret: githubSecret,
      authorization: {
        params: {
          redirect_uri: `http://localhost:3000/api/auth/callback/github`,
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
})