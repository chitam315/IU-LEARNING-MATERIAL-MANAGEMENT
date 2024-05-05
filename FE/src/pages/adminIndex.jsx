import React, { useRef, useState } from "react";
import { courseService } from "../services/course.service";

import TableAnnounce from '../components/TableAnnouncement/TableAnnouncement';
import TableUser from "../components/TableUser/TableUser";
import TableCourse from "../components/TableCourse/TableCourse";
import TableThesis from "../components/TableThesis/TableThesis";
import TableWishList from "../components/TableWishList/TableWishList";
import ModalCrerateAnnounce from "../components/ModalCrerateAnnounce/ModalCrerateAnnounce";
import { Button, Layout, Menu, theme, Modal, Form, Input, Select, message, Checkbox, Upload, FloatButton } from 'antd'
import { FaRegUser, FaFileArchive } from 'react-icons/fa'
import { HiDocumentText } from "react-icons/hi2";
import { AiOutlineMenuFold, AiOutlineMenuUnfold, AiOutlineNotification } from "react-icons/ai";
import { MdOutlineNotificationAdd } from "react-icons/md";
import { TbListCheck } from "react-icons/tb";
import { CommentOutlined, FileAddOutlined, UploadOutlined, UserAddOutlined } from '@ant-design/icons'
import { useAsync } from "../hooks/useAsync";
import { authService } from "../services/auth.service";
import { useReload } from "../hooks/useReload";
import { thesisService } from "../services/thesis.service";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { PATH } from "../config/PATH";
// import ModalCrerateAnnounce from "../components/ModalCrerateAnnounce/ModalCrerateAnnounce";

export const AdminIndex = ({ user }) => {
  const navigate = useNavigate()
  // ---------------- setup layout antd ----------------
  const [collapsed, setCollapsed] = useState(false)
  const { Header, Sider } = Layout

  const { token: { colorWarningBorder } } = theme.useToken()

  const [tableData, setTableData] = useState(user.role == 'admin' ? 'user' : 'course')

  // ---------------- end setup layout antd ----------------

  const { reload: reloadUser, ForceReload: ForceReloadUser } = useReload()
  const { reload: reloadCourse, ForceReload: ForceReloadCourse } = useReload()
  const { reload: reloadThesis, ForceReload: ForceReloadThesis } = useReload()
  const { reload: reloadAnnouncement, ForceReload: ForceReloadAnnouncement } = useReload()


  // ---------------- setup modal create user ----------------
  const [openModalUser, setOpenModalUser] = useState(false)
  const { loading: loadingCreateUser, status: statusCreateUser, execute: createUser, error: errorCreateUser } = useAsync(authService.register)

  const [formUser] = Form.useForm()

  const handleCreateUser = async () => {
    formUser.validateFields()
      .then(async () => {
        console.log(formUser.getFieldsValue());
        const res = await createUser(formUser.getFieldsValue())
        if (res.success == true) {
          // ForceReload()
          ForceReloadUser()
          setOpenModalUser(false)
          formUser.resetFields()
          message.success('Create user successfully !!!')
        }
      })
      .catch((data) => {
        data.errorFields.map((errField) => {
          message.warning(errField.errors[0])
        })
      })
  }

  // ---------------- end setup modal create user ----------------

  // ---------------- setup modal create course ----------------
  const [openModalCourse, setOpenModalCourse] = useState(false)
  const { loading: loadingCreateCourse, status: statusCreateCourse, execute: createCourse, error: errorCreateCourse } = useAsync(courseService.createCourse)
  const [formCourse] = Form.useForm()

  const handleCreateCourse = () => {
    formCourse.validateFields()
      .then(async () => {
        console.log(formCourse.getFieldsValue());
        const res = await createCourse(formCourse.getFieldsValue())
        if (res.success == true) {
          // ForceReload()
          ForceReloadCourse()
          setOpenModalCourse(false)
          formCourse.resetFields()
          message.success('Create course successfully !!!')
        }
      })
      .catch((data) => {
        console.log(data);
        data.errorFields.map((errField) => {
          message.warning(errField.errors[0])
        })
      })
  }

  // ---------------- end setup modal create course ----------------

  // ---------------- setup modal create thesis ----------------
  const uploadRef = useRef()
  const [openModalThesis, setOpenModalThesis] = useState(false)
  const { loading: loadingCreateThesis, status: statusCreateThesis, execute: createThesis, error: errorCreateThesis } = useAsync(thesisService.createThesis)

  const [formCreateThesis] = Form.useForm()

  const [fileCreateThesis, setFileCreateThesis] = useState(null);

  const handleUpload = async () => {
    console.log(formCreateThesis.getFieldsValue());
    if (!fileCreateThesis) {
      // No file selected, handle accordingly
      message.error('Please select a file');
      return;
    }

    formCreateThesis.validateFields()
      .then(async (data) => {
        console.log(data);
        // Create a FormData object
        const formData = new FormData();

        // Append the file to the FormData object with a key 'file'
        formData.append('category', data.category);
        formData.append('name', data.name);
        formData.append('shortDescription', data.shortDescription)
        formData.append('file', fileCreateThesis);

        // Append other keys and their values to the FormData object
        // Make an API call using axios or any other HTTP library

        // const response = await axiosObj.post('http://localhost:8080/file/create-file/IT064IU', formData);

        const responseCreateThesis = await createThesis(formData)
        console.log(responseCreateThesis);
        message.success('Create successfully');
        setFileCreateThesis(null)
        formCreateThesis.resetFields()
        setOpenModalThesis(false)
        ForceReloadThesis()
        // Handle the API response as needed
        // Display a success message
        // if (responseCreateThesis.status == 'success') {
        //   message.success('Create successfully');
        //   setFileCreateThesis(null)
        //   uploadRef.current.clear()
        //   formCreateThesis.resetFields()
        //   setOpenModalThesis(false)
        //   ForceReloadThesis()
        // } else if (responseCreateThesis.status == 'error') {
        //   message.error('Create fail. Please help me try again');
        //   setFileCreateThesis(null)
        //   uploadRef.current.clear()
        //   formCreateThesis.resetFields()
        //   setOpenModalThesis(false)
        //   ForceReloadThesis()
        // }

      })

  };

  const handleChange = (info) => {
    console.log(info);
    setFileCreateThesis(info.file);
    if (info.file.status === 'removed') {
      // File is removed, clear it from the state
      setFileCreateThesis(null);
      console.log('removed');
    }
  };

  // ---------------- end setup modal create thesis ----------------

  // ---------------- setup modal create announcement ----------------



  const [openModalAnnouncement, setOpenModalAnnouncement] = useState(false)


  // ---------------- end setup modal create announcement ----------------

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

  const { Option } = Select

  const MenuAdmin = user.role == 'admin' ? ([
    {
      key: 'user',
      icon: <FaRegUser />,
      label: 'All users',
      onClick: () => setTableData('user')
    },
    {
      key: 'course',
      icon: <HiDocumentText />,
      label: 'All courses',
      onClick: () => setTableData('course')
    },
    {
      key: 'thesis',
      icon: <FaFileArchive />,
      label: 'All thesis',
      onClick: () => setTableData('thesis')
    },
    {
      key: 'wishList',
      icon: <TbListCheck/>,
      label: 'Wish list',
      onClick: () => setTableData('wishList')
    },
    {
      key: 'announcement',
      icon: <AiOutlineNotification />,
      label: 'Announcement',
      onClick: () => setTableData('announcement')
    }]) : ([
      {
        key: 'course',
        icon: <HiDocumentText />,
        label: 'All courses',
        onClick: () => setTableData('course')
      },
      {
        key: 'thesis',
        icon: <FaFileArchive />,
        label: 'All thesis',
        onClick: () => setTableData('thesis')
      },
      {
        key: 'wishList',
        icon: <TbListCheck/>,
        label: 'Wish list',
        onClick: () => setTableData('wishList')
      },
    ])

  return (
    <>
      {/* ---------------- setup layout antd ---------------- */}
      <Layout >
        <Sider style={{ height: 'calc(100vh - 70px)' }} trigger={null} breakpoint="lg" collapsible collapsed={collapsed} onBreakpoint={(broken) => {
          if (broken == true) {
            setCollapsed(true)
          } else {
            setCollapsed(false)
          }
        }}>
          <Menu
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'center',
              gap: '30px'
            }}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={(user.role == 'admin' ? ['user'] : ['course'])}
            items={MenuAdmin}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorWarningBorder, display: 'flex', justifyContent: 'space-between', verticalAlign: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            {
              tableData == 'user' && user.role == 'admin' ? (
                <Button
                  type="text"
                  icon={<UserAddOutlined />}
                  onClick={() => setOpenModalUser(true)}
                  style={{
                    fontSize: '16px',
                    width: 'min-content',
                    height: 64,
                  }}
                >Create user</Button>
              ) : tableData == 'course' && user.role == 'admin' ? (
                <Button
                  type="text"
                  icon={<FileAddOutlined />}
                  onClick={() => setOpenModalCourse(true)}
                  style={{
                    fontSize: '16px',
                    width: 'min-content',
                    height: 64,
                  }}
                >Create course</Button>
              ) : (
                user.role == 'admin' && tableData == 'thesis' ? (
                  <Button
                    type="text"
                    icon={<FileAddOutlined />}
                    onClick={() => setOpenModalThesis(true)}
                    style={{
                      fontSize: '16px',
                      width: 'min-content',
                      height: 64,
                    }}
                  >Create</Button>) : (user.role == 'admin' && tableData == 'announcement' && <Button
                    type="text"
                    icon={<MdOutlineNotificationAdd />}
                    onClick={() => setOpenModalAnnouncement(true)}
                    style={{
                      fontSize: '16px',
                      width: 'min-content',
                      height: 64,
                    }}
                  >Create announcement</Button>)
              )
            }

          </Header>
          {
            tableData == 'user' ? <TableUser key={reloadUser} /> : tableData == 'course' ? <TableCourse user={user} key={reloadCourse} /> : tableData == 'thesis' ? <TableThesis user={user} key={reloadThesis} /> : tableData == 'announcement' ? <TableAnnounce key={reloadAnnouncement} /> : <TableWishList/>
          }
        </Layout>
      </Layout>
      {/* ---------------- end setup layout antd ---------------- */}

      {/* ------------------------ Modal create user ------------------------ */}
      <Modal
        title="Create user"
        centered
        open={openModalUser}
        onOk={handleCreateUser}
        onCancel={() => setOpenModalUser(false)}
        width={1000}
      >
        <Form
          name='Create user form'
          {...formItemLayout}
          form={formUser}
          initialValues={{
            username: '',
            password: '',
            fullName: '',
            email: '',
            role: 'student',
          }}
          layout='horizontal'
        >
          <Form.Item name={"username"} label="username" rules={[
            { required: true, message: 'username is required' },
            { min: 6, message: 'username contains at least 6 characters' }
          ]}>
            <Input placeholder={'username'} />
          </Form.Item>
          <Form.Item name={"password"} label="Password" rules={[
            { required: true, message: 'password is required' },
            { min: 6, message: 'password contains at least 6 characters' }
          ]}>
            <Input.Password placeholder={'password'} />
          </Form.Item>
          <Form.Item name={"fullName"} label="Full name" rules={[
            { required: true, message: 'Full name is required' }
          ]}>
            <Input placeholder={'Full name of user'} />
          </Form.Item>
          <Form.Item name={"email"} label="Email" rules={[
            { required: true, message: 'Email is required' },
            { pattern: /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/, message: 'Email is not valid' }
          ]}>
            <Input placeholder={'Email'} />
          </Form.Item>
          <Form.Item name={"role"} label="Role">
            <Select >
              <Option value='student'>Student</Option>
              <Option value='teacher'>Teacher</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* ------------------------ End modal create user ------------------------ */}

      {/* ------------------------ Modal create course ------------------------ */}
      <Modal
        title="Create course"
        centered
        open={openModalCourse}
        onOk={handleCreateCourse}
        onCancel={() => setOpenModalCourse(false)}
        width={1000}
      >
        <Form
          name='Create course form'
          {...formItemLayout}
          form={formCourse}
          initialValues={{
            name: '',
            code: '',
            major: ['CS'],
            category: 'compulsory',
          }}
          layout='horizontal'
        >
          <Form.Item name={"name"} label="Name of course" rules={[
            { required: true, message: 'Name of course is required' },
            { min: 6, message: `Course's name contains at least 6 characters` }
          ]}>
            <Input placeholder={'Name of course'} />
          </Form.Item>
          <Form.Item name={"code"} label="Code of course" rules={[
            { required: true, message: 'Code of course is required' },
            { len: 7, message: 'Code contains 7 characters' }
          ]}>
            <Input placeholder={'Code of course'} />
          </Form.Item>
          <Form.Item name={"category"} label="Category">
            <Select >
              <Option value='compulsory'>Compulsory</Option>
              <Option value='elective'>Elective</Option>
              <Option value='general'>General</Option>
            </Select>
          </Form.Item>
          <Form.Item name={"major"} label="Major">
            <Checkbox.Group options={['CS', 'CE', 'NE']} />
          </Form.Item>
        </Form>
      </Modal>
      {/* ------------------------ End modal create course ------------------------ */}

      {/* ------------------------ Modal create thesis ------------------------ */}
      <Modal
        title="Create thesis"
        centered
        open={openModalThesis}
        onOk={handleUpload}
        confirmLoading={loadingCreateThesis}
        onCancel={() => setOpenModalThesis(false)}
        width={1000}
      >
        <Form
          name='Create thesis form'
          {...formItemLayout}
          form={formCreateThesis}
          initialValues={{
            name: '',
            shortDescription: '',
            category: 'thesis',
          }}
          layout='horizontal'
        >
          <Form.Item name={"name"} label="Name of thesis" rules={[
            { required: true, message: 'Name of thesis is required' },
            { min: 6, message: `Thesis's name contains at least 6 characters` }
          ]}>
            <Input placeholder={'Name of thesis'} />
          </Form.Item>
          <Form.Item name={"shortDescription"} label="Short description" rules={[
            { required: true, message: 'Short description is required' },
          ]}>
            <Input placeholder={'Short description about this file'} />
          </Form.Item>
          <Form.Item name={"category"} label="Category">
            <Select >
              <Option value='thesis'>Thesis</Option>
              <Option value='timeline'>Timeline</Option>
              <Option value='report form'>Report form</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Upload
              ref={uploadRef}
              accept="application/pdf"
              maxCount={1}
              fileList={fileCreateThesis == null ? [] : [fileCreateThesis]}
              // customRequest={() => false}  // Disable automatic uploading
              beforeUpload={() => false}
              onChange={handleChange}

            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      {/* ------------------------ End modal create thesis ------------------------ */}

      {/* ------------------------ Modal create announcement ------------------------ */}
      {user.role == 'admin' && <ModalCrerateAnnounce openModalAnnouncement={openModalAnnouncement} setOpenModalAnnouncement={setOpenModalAnnouncement} ForceReloadAnnouncement={ForceReloadAnnouncement}/>}
      {/* ------------------------ End modal create course ------------------------ */}

      <FloatButton onClick={() => navigate(PATH.chat.goToChat)} icon={<CommentOutlined />} tooltip={<p>{user.role != 'admin' ? 'Chat with admin' : 'Chat'}</p>}/>
    </>

    // ---------------- end setup layout antd ----------------
  );
};
