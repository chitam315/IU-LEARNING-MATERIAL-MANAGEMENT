import { useState } from "react"

/**
 * this hook use to control posting data
 * @param {*} fn 
 * @returns data, error, loading, status ,execute
 */
export const useAsync = (fn) => {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle');

    const execute = async (data) => {
        try {
            setLoading(true)
            setStatus('pending');
            const res = await fn(data);
            setData(res)
            setStatus('success')
            return res;
        } catch (error) {
            setError(error)
            setStatus('error')
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { data, error, loading, status, execute }
}