import { useEffect } from "react";
import { useState } from "react"

/**
 * 
 * this hook use to control fetch data on the first time
 * @param {*} promise 
 * @param {*} dependencies 
 * @returns 
 * 
 */
export const useFetch = (promise, dependencies = []) => {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        fetchData()
    }, dependencies)

    const fetchData = async () => {
        try {
            setStatus('pending');
            const res = await promise();
            setData(res)
            setStatus('success')
        } catch (error) {
            setError(error)
            setStatus('error')
        } finally {
            setLoading(false)
        }
    }

    return { data, error, loading, status }
}