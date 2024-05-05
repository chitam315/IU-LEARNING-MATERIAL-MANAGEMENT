import { api, COURSE_API } from "../config/api"

export const courseService = {
    getAllCourses() {
        return api.get(`${COURSE_API}/`)
    },
    getCourseById(id){
        return api.get(`${COURSE_API}/${id}`)
    },
    deleteCourseById(id){
        console.log(id);
        return api.delete(`${COURSE_API}/${id}/delete`)
    },
    createCourse(data) {
        return api.post(`${COURSE_API}/create-course`,data)
    },
    updateCourse(data){
        return api.put(`${COURSE_API}/${data._id}/update`,data)
    },
    updateTeacher(data){
        return api.put(`${COURSE_API}/${data.idCourse}/change-teacher`,{idTeacher: data.idTeacher})
    }
}