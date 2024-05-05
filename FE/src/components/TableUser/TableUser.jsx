import React, { useState } from 'react'
import { Table, Tag, Flex, Button, Drawer, Space, Form, Input, Select, message, Modal } from 'antd'
import { useFetch } from '../../hooks/useFetch';
import { authService } from '../../services/auth.service';

import { useAsync } from '../../hooks/useAsync';
import { handleError } from '../../utils/handleError';


const TableUser = () => {
    var [reload, setReload] = useState(false)
    const ForceReload = () => {
        setReload(!reload)
    }
    const [userSelecting, setUserSelecting] = useState({})
    const [formEditUser] = Form.useForm()
    var { data, loading, status: statusLoadUser } = useFetch(() => {
        console.log('call fetch users');
        return authService.getAllUser()
    }, [reload]);

    const { loading: loadingUpdateUser, status: statusUpdateUser, execute: updateUser, error: errorUpdateUser } = useAsync(authService.updateUserInformation)
    const { loading: loadingDeleteUser, status: statusDeleteUser, execute: deleteUser, error: errorDelete } = useAsync(authService.deleteUser)

    const [openDrawer, setOpenDrawer] = useState(false)

    const handleOpenDrawer = (user) => {
        setUserSelecting(user)
        setOpenDrawer(true)
        formEditUser.setFieldsValue({
            fullName: user.fullName,
            email: user.email,
            role: user.role
        })
    }

    const handleDeleteUser = async (user) => {
        Modal.confirm({
            title: 'Deleting user',
            content: `Please consider carefully. You are deleting ${user.username}. All data related him/her will disappear`,
            onOk: async () => {
                const res = await deleteUser({username: user.username})
                if (res.success == true) {
                    ForceReload()
                    message.success('Delete user successfully')
                }
            },
        })
    }

    const columns = [
        {
            title: 'Full name',
            dataIndex: 'fullName',
            key: 'fullName',
            //   render: (text) => <a>{text}</a>,
        },
        {
            title: 'username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            render: (role) => <Tag bordered={false} color={role == 'student' ? 'processing' : 'success'}>{role.toUpperCase()}</Tag>,
            filters: [
                {text: 'Student', value: 'student'},
                {text: 'Teacher', value: 'teacher'}
            ],
            onFilter: (value, record) => record.role == value,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, user) => (
                <Flex gap="small" wrap="wrap">
                    <Button onClick={() => { handleOpenDrawer(user) }}>Edit</Button>
                    <Button disabled={loadingDeleteUser} loading={loadingDeleteUser} onClick={() => { 
                        handleDeleteUser(user)
                     }} type='dashed' danger>Delete</Button>
                </Flex>
            ),
        },
    ];

    let dataSource = []

    if (!loading && statusLoadUser == 'success') {
        dataSource = data.users.map((user, index) => ({
            key: index + 1,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role
        }))
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

    const handleUpdateUser = async () => {
        const FieldsError = formEditUser.getFieldsError()
        const checkError = FieldsError.filter(FieldErr => {
            if (FieldErr.errors.length > 0) {
                message.warning(FieldErr.errors[0])
                return true; // Array is empty, continue checking the next one
            } else {
                return false; // Array is not empty, stop checking and return false
            }
        });

        // call API if there is no err
        if (checkError.length == 0) {
            const res = await updateUser({
                ...formEditUser.getFieldsValue(),
                username: userSelecting.username
            })
            if (res.success == true) {
                ForceReload()
                setOpenDrawer(false)
                message.success('Update user successfully')
            }
        }

    }
    const { Option } = Select
    return (
        <div style={{height: '100%'}} id='table-user'>
            <Table style={{height: '100%'}} scroll={'x'} loading={loading} columns={columns} dataSource={dataSource}  />
            <Drawer
                title={`Edit user`}
                closable={true}
                open={openDrawer}
                placement='right'
                onClose={() => { setOpenDrawer(false) }}
                extra={
                    <Space>
                        <Button onClick={() => { setOpenDrawer(false) }}>Cancel</Button>
                        <Button type="primary" onClick={handleUpdateUser}>Update</Button>
                    </Space>
                }
            >
                <Form
                    name='Edit user form'
                    {...formItemLayout}
                    form={formEditUser}
                    layout='horizontal'
                >
                    <Tag className='mb-5' bordered={false} color={userSelecting?.role == 'student' ? 'processing' : 'success'}>{userSelecting.username}</Tag>
                    <Form.Item name={"fullName"} label="Full name" rules={[
                        { required: true, message: 'Full name is required' }
                    ]}>
                        <Input placeholder={userSelecting?.fullName} />
                    </Form.Item>
                    <Form.Item name={"email"} label="Email" rules={[
                        { required: true, message: 'Email is required' },
                        { pattern: /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/, message: 'Email is not valid' }
                    ]}>
                        <Input placeholder={userSelecting?.email} />
                    </Form.Item>
                    <Form.Item name={"role"} label="Role">
                        <Select >
                            <Option value='student'>Student</Option>
                            <Option value='teacher'>Teacher</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    )
}

export default TableUser