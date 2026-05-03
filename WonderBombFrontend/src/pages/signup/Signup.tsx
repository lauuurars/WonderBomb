import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../consts/api"
import { useAuth } from "../../contexts/AuthProvider"

export const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSignup = async () => {
        const response = await fetch(`${BASE_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        const result = await response.json()

        if (result?.accessToken) {
            login({ accessToken: result.accessToken })
            navigate("/game")
            return
        }

        navigate("/login")
    }

    return (
        <section>
            <h1>💣 WonderBomb</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Registrarse</button>
            <p>Ya tienes cuenta? <a href="/login">Ingresar</a></p>
        </section>
    )
}
