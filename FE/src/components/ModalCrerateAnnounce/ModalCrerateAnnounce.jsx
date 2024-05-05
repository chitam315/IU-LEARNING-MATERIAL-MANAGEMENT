import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";

import { Modal, Form, Input,message, TreeSelect } from 'antd'

import { useAsync } from "../../hooks/useAsync";
import { authService } from "../../services/auth.service";
import { announcementService } from "../../services/announcement.service";

const ModalCrerateAnnounce = ({openModalAnnouncement,setOpenModalAnnouncement,ForceReloadAnnouncement}) => {
    // const [openModalAnnouncement, setOpenModalAnnouncement] = useState(false)
    const { loading: loadingUserAnnounce, data: resLoadingUserAnnounce } = useFetch(authService.getAllUserId, [])
    const { execute: createAnnouncement } = useAsync(announcementService.createAnnouncement)
    const [formAnnouncement] = Form.useForm()
    
    let treeData = []
  
    if (!loadingUserAnnounce) {
      treeData = [
        {
          label: 'All teachers',
          value: 'All teachers',
          // value: `${resLoadingUserAnnounce.allUser.filter(user => user.role == 'teacher').map(user => user._id)}`,
          // key: resLoadingUserAnnounce.allUser.filter(user => user.role == 'teacher').map(user => user._id),
          children: resLoadingUserAnnounce.allUser.filter(user => user.role == 'teacher').map(user => ({
            label: user.fullName,
            value: user._id,
            key: user._id
          }))
        },
        {
          label: 'All students',
          value: 'All students',
          // value: `${resLoadingUserAnnounce.allUser.filter(user => user.role == 'student').map(user => user._id)}`,
          children: resLoadingUserAnnounce.allUser.filter(user => user.role == 'student').map(user => ({
            label: user.fullName,
            value: user._id,
            key: user._id
          }))
        }
      ]
    }

    const handleCreateAnnouncement = () => {
      formAnnouncement.validateFields()
        .then(async () => {
          // ------------------------------------------ handle select ------------------------------------------
          const specificUserId = formAnnouncement.getFieldValue('userIdArr').filter(arrId => !arrId.includes('All'))
          const allTeacher = formAnnouncement.getFieldValue('userIdArr').filter(arrId => arrId.includes('teacher'))
          const allStudent = formAnnouncement.getFieldValue('userIdArr').filter(arrId => arrId.includes('student'))
          const isAll = allTeacher.length > 0 && allStudent.length > 0 ? 'user' : allStudent.length > 0 ? 'student' : allTeacher.length > 0 ? 'teacher' : 'none'
          let finalArrId = []
          switch (isAll) {
            case 'user':
              resLoadingUserAnnounce.allUser.map(user => { finalArrId.push(user._id) })
              break;
            case 'student':
              resLoadingUserAnnounce.allUser.map(user => user.role == 'student' && finalArrId.push(user._id))
              break;
            case 'teacher':
              resLoadingUserAnnounce.allUser.map(user => user.role == 'teacher' && finalArrId.push(user._id))
              break;
          }
          finalArrId = finalArrId.concat(specificUserId)
          console.log('finalArrId is : ', finalArrId);
          // ------------------------------------------ end handle select ------------------------------------------
  
          const res = await createAnnouncement({
            ...formAnnouncement.getFieldsValue(),
            userIdArr: finalArrId,
            isAll
          })
          if (res.success == true) {
            ForceReloadAnnouncement()
            setOpenModalAnnouncement(false)
            formAnnouncement.resetFields()
            message.success('Send announcement successfully !!!')
          }
        })
        .catch((data) => {
        })
    }


  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

    return (
        <Modal
            title="Create announcement"
            centered
            open={openModalAnnouncement}
            onOk={handleCreateAnnouncement}
            onCancel={() => setOpenModalAnnouncement(false)}
            width={1000}
        >
            <Form
                name='Create announcement form'
                {...formItemLayout}
                form={formAnnouncement}
                initialValues={{
                    title: '',
                    shortDescription: '',
                    link: ''
                }}
                layout='horizontal'
            >
                <Form.Item name={"title"} label="Title" rules={[
                    { required: true, message: 'Title is required' },
                ]}>
                    <Input placeholder={'Title of announcement'} />
                </Form.Item>
                <Form.Item name={"shortDescription"} label="Short message" rules={[
                    { required: true, message: 'Code of course is required' },
                ]}>
                    <Input placeholder={'Short message for users'} />
                </Form.Item>
                <Form.Item name={"link"} label="Link" >
                    <Input placeholder={'Link to edusoftweb.hcmiu.edu.vn post'} />
                </Form.Item>
                <Form.Item rules={[{ required: true, message: 'Please choose at least one user' }]} name={'userIdArr'} label="Choose users">
                    <TreeSelect
                        style={{ width: '100%' }}
                        // value={userPickedAnnounce}
                        treeCheckable
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={treeData}
                        placeholder="Users will receive this notification"
                        // treeDefaultExpandAll
                        showCheckedStrategy={TreeSelect.SHOW_PARENT}
                    // onChange={value => setUserPickedAnnounce({value})}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalCrerateAnnounce
// export {setOpenModalAnnouncement}