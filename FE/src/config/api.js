import axios from "axios";
import { getToken, setToken, clearToken, clearUser } from "../utils/token.js";
import { authService } from "../services/auth.service.js";
import { handleError } from '../utils/handleError.js'
import { message } from "antd";

const AUTHENTICATION_API = import.meta.env.VITE_AUTHENTICATION_API;
const COURSE_API = import.meta.env.VITE_COURSE_API;
const ADMIN_API = import.meta.env.VITE_ADMIN_API;
const THESIS_API = import.meta.env.VITE_THESIS_API;
const FILE_API = import.meta.env.VITE_FILE_API
const ANNOUNCEMENT_API = import.meta.env.VITE_ANNOUNCEMENT_API
const MESSAGE_API = import.meta.env.VITE_MESSAGE_API
const CHAT_SERVER = import.meta.env.VITE_CHAT_SERVER

const api = axios.create()

api.interceptors.response.use((res) => {
    return res.data
}, async (err) => {
    if (err.response.status === 403 & err.response.data.message === "Token is expired!") {
        try {
            const curRefreshToken = getToken().refreshToken
            const resToken = await authService.getNewAccessToken({
                refreshToken: curRefreshToken
            })
            setToken({
                accessToken: resToken.data.accessToken,
                refreshToken: curRefreshToken
            })
            return api(err.config)
        } catch (error) {
            message.error('Your login session is expired .You will be logged out after  2 seconds')
            clearToken()
            clearUser()
            setTimeout(() => {
                window.location.reload('/')
            }, 2000)
        }
    } else {
        handleError(err)
        throw err
    }
})

api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers['Authorization'] = `Bearer ${token.accessToken}`
    }
    return config
})

export { api, COURSE_API, AUTHENTICATION_API, ADMIN_API, THESIS_API, FILE_API, ANNOUNCEMENT_API, MESSAGE_API, CHAT_SERVER }
