import React from "react";
import { courseService } from "../services/course.service";
import { useFetch } from "../hooks/useFetch.js";
import Skeleton from "../components/Skeleton";
import { Link, generatePath } from "react-router-dom";
import { PATH } from "../config/PATH";

export const StudentIndex = ({ user }) => {
  // var { data, loading } = useFetch(() => {
  //   return courseService.getAllCourses();
  // });

  // var pathArray = [];

  // if (!loading) {
  //   var courses = data.data;
  //   courses.forEach(course => {
  //     // pathArray.push(generatePath(PATH.course.getCourseWithID, { filename: course.filename }))
  //     pathArray.push("http://localhost:8080/file/" + course.filename)
  //   });

  //   console.log(pathArray);

  //   return (
  //     // <div id="adminIndex">
  //     //   <div className="flex-box">
  //     //     <div className="title">Hello {user.username}. Welcome to IU.</div>
  //     //     <div className="flex-box-mini">
  //     //       {courses.map((course, i) => (
  //     //         <a target="_blank" href={pathArray[i]} key={i}>
  //     //           {course.title}
  //     //         </a>
  //     //       ))}
  //     //     </div>
  //     //   </div>
  //     // </div>
  //     <h1>Hello student</h1>
  //   );
  // }

  return <h1>HELLO STUDENT</h1>;
};
