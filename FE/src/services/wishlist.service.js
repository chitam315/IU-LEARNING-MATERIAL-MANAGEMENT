import { api, AUTHENTICATION_API } from "../config/api"

export const wishListService = {
    addFileToWishList (data) {
        return api.post(`${AUTHENTICATION_API}/add-to-wishlist`,data)
    },

    getWishList(){
        return api.get(`${AUTHENTICATION_API}/get-wishlist`)
    },

    removeFromWishList(id){
        return api.delete(`${AUTHENTICATION_API}/remove-from-wishlist/${id}`)
    }
}