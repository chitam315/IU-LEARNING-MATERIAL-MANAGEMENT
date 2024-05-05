import { message } from 'antd'
import { createContext, useContext, useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { PATH } from '../../config/PATH'
import jwt_decode from "jwt-decode";
import { authService } from '../../services/auth.service'
import { clearToken, clearUser, getUser, setToken, setUser } from '../../utils/token'
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../config/PATH';

const AuthContext = createContext({})


/**
 * this useContext is use to control user,login,logout
 * @returns user, login, logout, setUser
 */
const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
    const [user, _setUser] = useState(getUser)
    const navigate = useNavigate()

    useEffect(() => {
        setUser(user || null)
    }, [user])

    const login = async (data) => {
        try {
            const res = await authService.login(data)
            if (res.accessToken) {
                setToken(res)
                const decoded = await jwt_decode(res.accessToken)
                _setUser({ username: decoded.username, role: decoded.role, fullName: decoded.fullName, email: decoded.email,id: decoded.id })
                message.success('Log in successfully')
            }
        } catch (error) {
            // handleError(error)
        }
    }

    const logout = () => {
        clearToken()
        clearUser()
        _setUser(null)
        navigate(PATH.index)
        message.success('Log out successfully')
    }

    return <AuthContext.Provider value={{ user, login, logout, setUser: _setUser }}>{children}</AuthContext.Provider>
}

export { useAuth, AuthProvider, AuthContext }