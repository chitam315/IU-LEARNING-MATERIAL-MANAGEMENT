import React, { } from "react";
import { useAsync } from "../hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { authService } from "../services/auth.service";
import { Form, Input, Button } from "antd";
import { PATH } from "../config/PATH";


function ForgetPassword() {
  const navigate = useNavigate();

  const { execute: sendEmail, loading: loadingSendEmail } = useAsync(authService.forgetPassword);

  const [formForgetPassword] = Form.useForm()

  const onSubmit = async (ev) => {
    ev.preventDefault();
    console.log(formForgetPassword.getFieldValue('username'));
    const res = await sendEmail({username: formForgetPassword.getFieldValue('username')})
    if(res.success){
      message.success(`Please help me check email ${res.email}`)
      navigate(PATH.user.updatePassCode)
    }
  };

  return (
    <main className="auth" id="main">
      <div className="wrap">
        <div className="ct_login">
          <h2 className="title">FORGET PASSWORD</h2>
          <Form form={formForgetPassword}>
            <Form.Item name="username" >
              <Input placeholder="Input your username" />
            </Form.Item>
            <Button loading={loadingSendEmail} block style={{ paddingTop: '10px', paddingBottom: '30px', borderWidth: 3 }} onClick={onSubmit} >Submit</Button>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default ForgetPassword;
