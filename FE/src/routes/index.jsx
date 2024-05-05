import MainLayout from "../layouts/MainLayout";
import Index from "../pages";
import AuthRouter from '../components/AuthRouter'
import { PATH } from "../config/PATH";
import Page404 from '../pages/404'
import ChangeInformation from "../pages/changeInformation";
import ThesisPage from '../pages/ThesisPage'
import CourseFilePage from '../pages/CourseFilePage'
import CourseDetail from "../pages/courseDetail";
import ForgetPassword from "../pages/forgetPassword"
import ChangePassCode from "../pages/changePassCode";
import ChangePassword from "../pages/changePassword";
import ChatPage from "../pages/chatPage";

export const routes = [
    {
        element: <MainLayout />,
        children: [
            {
                element: <Index />,
                index: true
            },
            {
                element: <AuthRouter redirect={PATH.index} />,
                children: [
                    {
                        element: <ChatPage/>,
                        path: PATH.chat.goToChat
                    },
                    {
                        element: <ChangeInformation />,
                        path: PATH.user.changeInformation
                    },
                    {
                        element: <ThesisPage />,
                        path: PATH.thesis.openThesisWithId
                    },
                    {
                        element: <CourseDetail/>,
                        path: PATH.course.getCourseWithID
                    },
                    {
                        element: <CourseFilePage/>,
                        path: PATH.file.getFileWithId
                    },
                    {
                        element: <ChangePassword/>,
                        path: PATH.user.changePassword
                    }
                ]
            },
            {
                element: <ForgetPassword/>,
                path: PATH.user.forgetPassword
            },
            {
                element: <ChangePassCode/>,
                path: PATH.user.updatePassCode
            },

            {
                element: <Page404 />,
                path: PATH.Page404
            }
        ]
    }
]