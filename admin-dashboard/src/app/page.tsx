import LoginForm from "@/components/login/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/[auth]/route";
import React from "react";

export default async function Home() {
  const session = await getServerSession(authOptions);
  // const session = await getServerSession(authOptions);
// 
  if (session) redirect("/dashboard");

  return (
    <main>
      <LoginForm/>
    </main>
  );
}   
 