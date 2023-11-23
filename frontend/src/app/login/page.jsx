"use client";
import React from "react";
import Login from "../pages/Login";

import { AuthProvider } from "../context/AuthProvider";

function LoginPage() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
}
export default LoginPage;