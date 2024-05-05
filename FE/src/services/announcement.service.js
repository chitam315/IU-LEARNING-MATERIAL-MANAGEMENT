import { api, ANNOUNCEMENT_API } from "../config/api"

export const announcementService = {
    getAllAnnouncement(){
        return api.get(`${ANNOUNCEMENT_API}`)
    },
    createAnnouncement(data){
        console.log(data);
        return api.post(`${ANNOUNCEMENT_API}`,data)
    },
    deleteAnnouncement(id){
        return api.delete(`${ANNOUNCEMENT_API}/${id}`)
    },
}