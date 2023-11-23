"use client";
import React from "react";
import ConfirmAcount from "../../pages/ConfimAcount";

import { AuthProvider } from "../../context/AuthProvider";

function LoginPage() {
  return (
    <AuthProvider>
      <ConfirmAcount />
    </AuthProvider>
  );
}
export default LoginPage;