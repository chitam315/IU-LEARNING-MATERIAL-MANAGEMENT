import React, { } from "react";
import { useAsync } from "../hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { authService } from "../services/auth.service";
import { useAuth } from "../components/AuthContext";
import { Form, Input, Button } from "antd";
import { PATH } from "../config/PATH";


function ChangePassCode() {

  const navigate = useNavigate();

  const { execute: changePasswordWithCode, loading: loadingChangePasswordWithCode } = useAsync(authService.changePasswordWithCode);

  const [formUpdatePassCode] = Form.useForm()

  const onSubmit = async (ev) => {
    ev.preventDefault();
    console.log(formUpdatePassCode.getFieldsValue());
    formUpdatePassCode.validateFields()
    .then(async data => {
      const res = await changePasswordWithCode(data)
      if (res.success) {
        message.success('Change password successfully')
        navigate(PATH.index)
      }
    })
  };

  return (
    <main className="auth" id="main">
      <div className="wrap">
        <div className="ct_login">
          <h2 className="title">FORGET PASSWORD</h2>
          <Form form={formUpdatePassCode}>
            <Form.Item name="username" rules={[{required: true, message: "Please input username"}]} >
              <Input placeholder="Input your username" />
            </Form.Item>
            <Form.Item name="recoverCode" rules={[{required: true, message: "Please input code"}]}>
              <Input placeholder="Input your code" />
            </Form.Item>
            <Form.Item name="newPassword" rules={[{required: true, message: "Please input new password"}]}>
              <Input.Password bordered={false} style={{width: '100%'}} placeholder="Input your new password" />
            </Form.Item>
            <Button loading={loadingChangePasswordWithCode} block style={{ paddingTop: '10px', paddingBottom: '30px', borderWidth: 3 }} onClick={onSubmit} >Submit</Button>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default ChangePassCode;
