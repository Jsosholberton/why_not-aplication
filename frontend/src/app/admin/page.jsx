"use client";
import React from "react";
import { AuthProvider } from "../context/AuthProvider";
import RutaProtegida from "../layouts/RutaProtegida";
import Admin from "../pages/Admin";

function Page() {
  return (
    <AuthProvider>
      <RutaProtegida />
    </AuthProvider>
  );
}
export default Page;
