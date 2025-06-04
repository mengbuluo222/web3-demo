"use client"

import { signIn } from "next-auth/react"
import React from "react"
import { useSession } from "next-auth/react";

export default function LoginPage() {
 const { data: session } = useSession();
  console.log("Session data:", session);
  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2>Sign in with GitHub</h2>
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>
    </div>
  )
}