import React, { useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Select } from "../components/Select";
import Field from "../components/Field";
// import { Link } from "react-router-dom";
import {Button as BtnAnt} from 'antd'
import { PATH } from "../config/PATH";
import { useNavigate } from "react-router-dom";

export const Login = ({ form, onLogin, loading }) => {

  const handleEnter = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      onLogin(event)
    }
  }
  const navigate = useNavigate()
  return (
    <main className="auth" id="main">
      <div className="wrap">
        {/* login-form */}
        <div className="ct_login">
          <h2 className="title">LOG IN</h2>
          <Input placeholder="USERNAME" {...form.register("username")}
            handleKeyDown={(e) => { handleEnter(e) }}
          ></Input>
          <Input
            type="password"
            placeholder="PASSWORD"
            {...form.register("password")}
            handleKeyDown={(e) => { handleEnter(e) }}
          ></Input>
          <Button onClick={onLogin} Loading={loading}>Login</Button>
          <BtnAnt style={{padding: '0px', marginTop: '30px'}} type="link" onClick={() => {navigate(PATH.user.forgetPassword)}}>Forget password ? Do not worry, please click me.</BtnAnt>
        </div>
      </div>
    </main>
  );
}
