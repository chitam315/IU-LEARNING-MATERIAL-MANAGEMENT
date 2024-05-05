import { api, THESIS_API } from "../config/api"

export const thesisService = {
    getAllThesis(){
        return api.get(`${THESIS_API}`)
    },
    createThesis(data){
        console.log(data);
        return api.post(`${THESIS_API}`,data)
    },
    deleteThesis(data){
        return api.delete(`${THESIS_API}/${data._id}`)
    },
    updateThesis(data){
        return api.put(`${THESIS_API}/update`,data)
    },
    getThesisById(data){
        return api.get(`${THESIS_API}/${data.id}`)
    }
}