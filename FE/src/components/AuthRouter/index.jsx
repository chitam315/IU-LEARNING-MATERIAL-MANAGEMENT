import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { message } from 'antd'

export default function AuthRouter({ redirect = '/' }) {
    const { user } = useAuth()

    if (!user) {
        message.warning('YOU HAVE TO LOG IN')
        return <Navigate to={redirect} />
    }

    return <Outlet />
}
