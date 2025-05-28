"use client"

import { signIn } from "next-auth/react"
import React from "react"

export default function LoginPage() {

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2>Sign in with GitHub</h2>
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>
    </div>
  )
}