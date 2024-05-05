import { api, MESSAGE_API } from "../config/api"

export const messageService = {
    getMessageWithId(id){
        return api.get(`${MESSAGE_API}/${id}`)
    },
}