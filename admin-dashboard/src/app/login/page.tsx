
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
// import { authOptions } from "../api/auth/[...nextauth]/route";
import LoginForm from "@/components/login/LoginForm";
import { authOptions } from "@/api/[auth]/route";
import React from "react";

export default async function Register() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");
   console.log("session............",session)

  return <LoginForm/>;
}
