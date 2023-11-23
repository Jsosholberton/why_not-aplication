"use client";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const { auth } = useAuth();

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      <header className="px-4 py-5 bg-dark-gray text-center">
        <div className="md:flex md:justify-between items-center">
          <h2 className="text-green-600 font-black text-4xl capitalize">
            WhyNot tenis tournaments
          </h2>

          <div className="flex items-center gap-4">
            {auth.role === "admin" && (
              <button
                className="text-white text-sm bg-black-950 p-3 mx-auto my-5
                      rounded-xl uppercase font-sans font-medium cursor-pointer hover:bg-teal-600 active:bg-cyan-500 transition-colors"
                onClick={() => router.push("/admin")}
              >
                Admin
              </button>
            )}
            {auth._id ? (
              <button
                href="/login"
                className="text-white text-sm bg-black-950 p-3 mx-auto my-5
                                    rounded-xl uppercase font-sans font-medium cursor-pointer hover:bg-teal-600 active:bg-cyan-500 transition-colors"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            ) : (
              <button
                href="/login"
                className="text-white text-sm bg-black-950 p-3 mx-auto my-5
                        rounded-xl uppercase font-sans font-medium cursor-pointer hover:bg-teal-600 active:bg-cyan-500 transition-colors"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
