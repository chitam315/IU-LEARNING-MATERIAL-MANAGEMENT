import { api, FILE_API } from "../config/api"

export const fileService = {
    getFileById(id){
        return api.get(`${FILE_API}/${id}`)
    },
    addFile(data){
        console.log(data);
        return api.post(`${FILE_API}/create-file`,data)
    },
    deleteFile(id){
        return api.delete(`${FILE_API}/${id}`)
    },
    getAllFiles(){
        return api.get(`${FILE_API}/all`)
    }
}