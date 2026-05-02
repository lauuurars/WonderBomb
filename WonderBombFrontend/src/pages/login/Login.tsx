import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async () => {
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
