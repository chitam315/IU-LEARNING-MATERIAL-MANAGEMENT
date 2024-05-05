import React, { useState } from "react";
import { studentService } from "../services/student.service";
import { required, minMax, reEnter, regexp } from "../utils/validate";
import { useAsync } from "../hooks/useAsync";
import { useForm } from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { PATH } from "../config/PATH";
import Input from "../components/Input";
import Button from "../components/Button";
import { message } from "antd";
import Field from "../components/Field";
import { Select } from "../components/Select";
import { courseService } from "../services/course.service";
import axios from "axios";

function CreateCourse() {
  // const [isCreateSuccess, setIsCreateSuccess] = useState(false);
  const navigate = useNavigate()

  let rules = {
    title: [required(), minMax(6)],
    // file: [required()]
  };

  const { loading, execute: createCourseService } = useAsync(courseService.createCourse);

  const form = useForm(rules)

  const formData = new FormData()

  let tempFile
  
  const handleChange = (e) => {
    // e.preventDefault()
    console.log(e.target.files[0]);
    tempFile = e.target.files[0]
    // formData.append("file",e.target.files[0])
  }
  
  const onSubmit = async (ev) => {
    ev.preventDefault()
    console.log(form.values);
    // console.log(formData.values);
    if (form.validate()) {
      console.log('validate successfully');
      form.setValuesForm({
        title: form.values.title,
        file: tempFile
      })
      // formData.append('title',form.values.title)
      // console.log(formData);

      try {
        // axios.post("http://localhost:8080/course/create-course",form.values)
        createCourseService(form.values)
        .then((res) => {
          console.log(res);
          message.success('create course successfully', 4000)
        })
        // setIsCreateSuccess(true)
        navigate(PATH.index)
      } catch (err) {
        if (err.response?.data?.message) {
          message.error(err.response.data.message)
        }
        // setIsCreateSuccess(false)
      }
      finally {
        console.log("Done");
      }
    }
  }

  return (
    <main className="auth" id="main">
      <div className="wrap">
        {/* login-form */}
        <div className="ct_login">
          <h2 className="title">CREATE COURSE</h2>
            <Input placeholder="COURSE NAME" {...form.register("title")}></Input>
            <Input
              placeholder="FILE"
              type="file"
              // {...form.register("file")}
              onChange = {(e) => handleChange(e)}
            ></Input>
            
            <Button onClick={onSubmit} Loading={loading}>
              CREATE
            </Button>

        </div>
      </div>
    </main>
  );
}

export default CreateCourse;
