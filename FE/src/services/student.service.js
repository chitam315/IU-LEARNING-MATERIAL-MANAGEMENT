import { api, ADMIN_API } from '../config/api'

export const studentService = {
    create(data) {
        const user = {
            username: data.username,
            password: data.password,
            email: data.email
        }
        return api.post(`${ADMIN_API}/create-student`,user)
    },

    /**
     * data: {
     *  role: "student" || "admin"
     * }
     */
    delete(data){
        return api.delete(`${ADMIN_API}/delete-user/${data.username}`)
    },

    update(data){
        // return api.patch(`${}`)
    }
}