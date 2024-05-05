const ADMIN_PATH='/admin'
const COURSE_PATH='/course'
const THESIS_PATH='/thesis'
const FILE_PATH='/file'
const CHAT_PATH = '/chat'

export const PATH = {
    index: '/',
    user: {
        // register: ADMIN_PATH + '/register',
        // deleteUser: ADMIN_PATH + '/delete',
        changePassword:  '/change-password',
        changeInformation:  '/change-information',
        forgetPassword: '/forget-password',
        updatePassCode: '/update-password-with-code'
    },
    course: {
        getCourseWithID: COURSE_PATH + '/:id',
        // createCourse: COURSE_PATH + '/create',
        // getAllCourse: COURSE_PATH + '/',
        // uploadFile: COURSE_PATH + '/upload',
        getFileWithId: COURSE_PATH + '/file/:id'
    },
    file:{
        getFileWithId: FILE_PATH + '/:id'
    },
    thesis: {
        openThesisWithId: THESIS_PATH + '/:id'
    },
    chat: {
        goToChat: CHAT_PATH
    },
    Page404: '/*',
}