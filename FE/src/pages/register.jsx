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
import { authService } from "../services/auth.service";
import { useAuth } from "../components/AuthContext";

function CreateStudent() {
  // const [isCreateSuccess, setIsCreateSuccess] = useState(false);
  const navigate = useNavigate()
  const { logout } = useAuth()

  let rules = {
    username: [required(), minMax(6)],
    password: [required(), minMax(6, 21)],
    rePassword: [required(), reEnter("password", "Incorrect password")],
    email: [required(), regexp('email')],
    role: [required()]
  };

  const { loading, execute: signUpService } = useAsync(authService.register);

  const form = useForm(rules)

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (form.validate()) {
      try {
        await signUpService(form.values)
        // setIsCreateSuccess(true)
        message.success('Register successfully')
        navigate(PATH.index)
      } catch (err) {
        console.log(err);
        if (err.response?.data?.message === "Access denied") {
          logout()
          message.error("Please log in again")
          // navigate(PATH.index)
        } else if(err.response?.data?.message === "Refresh token expired") {
          logout()
          message.error("Login session is expired")
          // navigate(PATH.index)
        } else {
          message.error(err.response?.data?.message)
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
          <h2 className="title">REGISTER</h2>
          <Input placeholder="USERNAME" {...form.register("username")}></Input>
          <Input
            type="password"
            placeholder="PASSWORD"
            {...form.register("password")}
          ></Input>
          <Input
            type="password"
            placeholder="ENTER PASSWORD AGAIN"
            {...form.register("rePassword")}
          ></Input>
          <Input
            placeholder="EMAIL"
            {...form.register("email")}
          ></Input>
          <Field
            label="Your role:"
            {...form.register("role")}
            renderInput={(error, props) => (
              <Select
                {...props}
                error={error}
                placeholder={"Your role"}
                option={[
                  { value: "admin", label: "ADMIN" },
                  {
                    value: "student",
                    label: "STUDENT",
                  },
                ]}
              />
            )}
          />
          <Button onClick={onSubmit} Loading={loading}>
            CREATE
          </Button>
        </div>
      </div>
    </main>
  );
}

export default CreateStudent;
