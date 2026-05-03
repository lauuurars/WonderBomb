import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../consts/api"
import { useAuth } from "../../contexts/AuthProvider"

export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleLogin = async () => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            }, 
            body: JSON.stringify({email, password})
        })

        const result = await response.json()
        login({ accessToken: result.accessToken })
        if (result.accessToken) navigate("/game")
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
            <button onClick={handleLogin}>Ingresar</button>
            <p>No tienes cuenta? <a href="/signup">Registrate</a></p>
        </section>
    )
}
