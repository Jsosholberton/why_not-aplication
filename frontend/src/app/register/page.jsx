"use client";
import React from "react";
import Register from "../pages/Register";

import { AuthProvider } from "../context/AuthProvider";

function LoginPage() {
  return (
    <AuthProvider>
      <Register />
    </AuthProvider>
  );
}
export default LoginPage;