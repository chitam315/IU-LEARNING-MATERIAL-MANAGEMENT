import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { message } from 'antd'

export default function AdminRouter({ redirect = '/' }) {
    const { user } = useAuth()

    if (user.role != 'admin') {
        message.warning('YOU ARE NOT ADMIN')
        return <Navigate to={redirect} />
    }

    return <Outlet />
}
