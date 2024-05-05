import React, { useState } from "react";
import { studentService } from "../services/student.service";
import { required, minMax,reEnter, regexp } from "../utils/validate";
import { useAsync } from "../hooks/useAsync";
import { useForm } from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { PATH } from "../config/PATH";
import Input from "../components/Input";
import Button from "../components/Button";
import { message } from "antd";

function DeleteStudent() {
  const navigate = useNavigate()

  let rules = {
    username: [required(), minMax(6, 11, "Username has from 6 to 11 characters")],
    reID: [required(), reEnter("username", "Incorrect username")],
  };

  const { loading, execute: deleteService } = useAsync(studentService.delete);

  const form = useForm(rules)

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (form.validate()) {
        try {
            await deleteService({username: form.values.username})
                // setIsCreateSuccess(true)
                message.success('Delete student successfully')
                navigate(PATH.index)
        } catch (err) {
            if (err.response?.data?.message) {
                message.error(err.response.data.message)
            }
            // setIsCreateSuccess(false)
        }
        finally {
            // console.log(values);
        }
    }
}

  return (
    <main className="auth" id="main">
      <div className="wrap">
        {/* login-form */}
        <div className="ct_login">
          <h2 className="title">DELETE USER</h2>
          <Input placeholder="USERNAME" {...form.register("username")}></Input>
          <Input
            placeholder="ENTER USERNAME AGAIN"
            {...form.register("reID")}
          ></Input>
          <Button onClick={onSubmit} Loading={loading}>
            DELETE
          </Button>
        </div>
      </div>
    </main>
  );
}

export default DeleteStudent;
