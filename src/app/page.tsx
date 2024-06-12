"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  const handleDebts = () => {
    router.push("/debts");
  };

  const handlePaymentPlan = () => {
    router.push("/payment-plan");
  }

  return (
    <div className='flex w-full justify-around'>
      <h1>Home</h1>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleDashboard}>Dashboard</button>
      <button onClick={handleDebts}>Debts</button>
      <button onClick={handlePaymentPlan}>Payment Plan</button>
    </div>
  );
}
