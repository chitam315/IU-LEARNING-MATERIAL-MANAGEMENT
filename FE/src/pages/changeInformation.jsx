import React, { } from "react";
import { useAsync } from "../hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { authService } from "../services/auth.service";
import { useAuth } from "../components/AuthContext";
import { Popover, Form, Input, Button } from "antd";
import { PATH } from "../config/PATH";

function ChangeInformation() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate();

  const { execute: updatePersonalInformation } = useAsync(authService.updatePersonalInformation);

  const [formUpdate] = Form.useForm()

  const onSubmit = async (ev) => {
    ev.preventDefault();
    console.log(formUpdate.getFieldValue('fullName'));
    if (formUpdate.getFieldValue('fullName') || formUpdate.getFieldValue('email')) {
      formUpdate.validateFields()
        .then(async data => {
          const finalData = {
            fullName: data.fullName || user.fullName,
            email: data.email || user.email
          }
          console.log(finalData);
          await updatePersonalInformation(finalData)
          message.success('Update successfully')
          setUser({
            ...user,
            fullName: finalData.fullName,
            email: finalData.email
          })
          navigate(PATH.index)
        })
    } else {
      message.error('Please input at least one field')
    }

  };

  return (
    <main className="auth" id="main">
      <div className="wrap">
        <div className="ct_login">
          <h2 className="title">UPDATE YOU INFORMATION</h2>
          <Form form={formUpdate}>
            <Popover trigger='hover' content={<p>{`Your current name is : ${user.fullName}`}</p>}>
              <Form.Item name="fullName" >
                <Input placeholder="Input your new full name" />
              </Form.Item>
            </Popover>
            <Popover trigger='hover' content={<p>{`Your current email is : ${user.email}`}</p>}>
              <Form.Item name={'email'} rules={[{ pattern: /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/, message: 'Email is not valid' }]}>
                <Input placeholder="Input your new email" />
              </Form.Item>
            </Popover>
            <Button block style={{ paddingTop: '10px', paddingBottom: '30px', borderWidth: 3 }} onClick={onSubmit} >Submit</Button>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default ChangeInformation;
