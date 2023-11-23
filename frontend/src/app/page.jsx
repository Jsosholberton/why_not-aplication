"use client";
import React from "react";
import TournamentCard from "./components/TournamentCard";
import Header from "./components/Header";

import { AuthProvider } from "./context/AuthProvider";

function HomePage() {
  return (
    <AuthProvider>
      <Header />
      <TournamentCard />
    </AuthProvider>
  );
}

export default HomePage;