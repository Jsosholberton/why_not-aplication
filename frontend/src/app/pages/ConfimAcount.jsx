"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Alerta from "../components/Alerta";
import { useParams } from "next/navigation";

const ConfirmAcount = () => {
  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  // Use the useRouter hook
  const { id } = useParams();

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/confirm/${id}`;
        const { data } = await axios(url);
        console.log(data);
        setAlerta({
          msg: data.msg,
          error: false,
        });
        setCuentaConfirmada(true);
      } catch (error) {
        console.log(error);
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
    confirmarCuenta();
  }, []);

  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        confirm your account and enjoy exclusive tournaments{" "}
      </h1>

      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg && <Alerta alerta={alerta} />}

        {cuentaConfirmada && (
          <a
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            href="/login"
          >
            Sign In
          </a>
        )}
      </div>
    </>
  );
};

export default ConfirmAcount;