import { useState } from "react"

export const useReload = () => {

    var [reload, setReload] = useState(false)

    const ForceReload = () => {
        setReload(!reload)
    }

    return {reload,ForceReload}
}