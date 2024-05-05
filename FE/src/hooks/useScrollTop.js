import { useEffect } from "react"

export const useScrollTop = (dependences = []) => {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, dependences)
}