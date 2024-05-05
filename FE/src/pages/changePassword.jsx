import React, { } from "react";
import { useAsync } from "../hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { authService } from "../services/auth.service";
import { useAuth } from "../components/AuthContext";
import { Form, Input, Button } from "antd";
import { PATH } from "../config/PATH";


function ChangePassword() {

  const navigate = useNavigate();

  const { execute: changePassword, loading: loadingChangePassword, status: statusChangePassword } = useAsync(authService.changePassword);

  const [formChangePass] = Form.useForm()

  const onSubmit = async (ev) => {
    ev.preventDefault();
    console.log(formChangePass.getFieldsValue());
    formChangePass.validateFields()
      .then(async (data) => {
        const res = await changePassword({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        })
        console.log(res);
        if (res.success ) {
          message.success('Change password successfully')
          navigate(PATH.index)
        }
      })
      .catch(() => {})
  };


  return (
    <main className="auth" id="main">
      <div className="wrap">
        <div className="ct_login">
          <h2 className="title">FORGET PASSWORD</h2>
          <Form form={formChangePass}>
            <Form.Item name="oldPassword" rules={[{ required: true, message: "Please input old password" }]}>
              <Input.Password bordered={false} style={{ width: '100%' }} placeholder="Input your old password" />
            </Form.Item>
            <Form.Item name="newPassword" rules={[{ required: true, message: "Please input new password" }]}>
              <Input.Password bordered={false} style={{ width: '100%' }} placeholder="Input your new password" />
            </Form.Item>
            <Form.Item name="confirmPassword" 
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new password that you entered do not match!'));
                },
              }),
            ]}
            >
              <Input.Password bordered={false} style={{ width: '100%' }} placeholder="Confirm your new password" />
            </Form.Item>
            <Button loading={loadingChangePassword} block style={{ paddingTop: '10px', paddingBottom: '30px', borderWidth: 3 }} onClick={onSubmit} >Submit</Button>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default ChangePassword;
