"use client";
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Alerta from '../components/Alerta'

const Nuevopassword = () => {

  const [password, setPassword] = useState('')
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta, setAlerta] = useState({})
  const [passwordModificado, setPasswordModificado] = useState(false)

  const params = useParams()
  const { token } = params

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await axios(`http://johnatanortiz.tech:4000/api/users/lost-password/${token}`)
        setTokenValido(true)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault();
    if (password.length < 6) {
      setAlerta({
        msg: 'Password must be a minimum of 6 characters',
        error: true
      })
      return
    }

    try {
      const url = `http://johnatanortiz.tech:4000/api/users/lost-password/${token}`

      const { data } = await axios.post(url, { password })
      setAlerta({
        msg: data.msg,
        error: false
      })
      setPasswordModificado(true)
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const { msg } = alerta

  return (
    <>
      <h1 className="text-green-600 font-black text-6xl capitalize">Restaurar cuenta
      </h1>

      {msg && <Alerta alerta={alerta} />}

      {tokenValido && (
        <form
          className="my-10 bg-white shadow rounded-lg p-10 "
          onSubmit={handleSubmit}
        >
          <div className="my-5">
            <label
              className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password"
            >Pon una nueva contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Nueva contraseña"
              className="w-full mt-3 p-3 border rounded-xl bg bg-gray-50  "
              value={password}
              onChange={e => setPassword(e.target.value)}

            />
          </div>

          <input
            type="submit"
            value="Actualizar"
            className="bg-sky-700 mb-5 w-full py-3 text-white text-sm uppercase font-bold
                          rounded hover:cursor-pointer hover:bg-sky-800 transition colors"
          />
        </form>
      )}

      {passwordModificado && (
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >Iniciar sesión</Link>
      )}

    </>
  )
}

export default Nuevopassword