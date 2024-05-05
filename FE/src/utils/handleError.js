import { message } from 'antd'

export const handleError = (error) => {
    if (error.response?.data?.message) {
        message.error(error.response.data.message)
    }
}
