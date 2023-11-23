import { Outlet } from "react-router-dom";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import Admin from "../pages/Admin";

const RutaProtegida = () => {
  const { auth, cargando } = useAuth();

  const router = useRouter();

  if (cargando) return "Cargando...";

  return (
    <>
      {auth.role === "admin" ? (
        <div className="bg-dark-gray min-h-screen">
          <Header />
          <div className="md:flex">
            {/* <Sidebar /> */}
            <main className="p-10 flex-1">
              <Admin />
            </main>
          </div>
        </div>
      ) : (
        router.push("/login")
      )}
    </>
  );
};

export default RutaProtegida;
