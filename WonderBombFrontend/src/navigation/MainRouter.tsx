import { Navigate, Route, Routes } from "react-router-dom"
import { Login } from "../pages/login/Login"
import { Signup } from "../pages/signup/Signup"
import { Game } from "../pages/game/Game"
import { useAuth } from "../contexts/AuthProvider"

export const MainRouter = () => {
    const auth = useAuth()
    const accessToken = auth?.accessToken

    return (
        <Routes>
            <Route path="/login"  element={accessToken ? <Navigate to= "/game"/> : <Login />} />
            <Route path="/signup" element={accessToken ? <Navigate to= "/game"/> : <Signup />} />
            <Route path="/game"   element={accessToken ? <Game /> : <Navigate to= "/login" />} />
            <Route path="*"       element={<Navigate to="/login" />} />
        </Routes>
    )
}
