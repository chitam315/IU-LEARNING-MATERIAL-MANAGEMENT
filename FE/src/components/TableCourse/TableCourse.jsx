import React, { useState } from 'react'
import { Table, Tag, Flex, Button, Modal, message, Drawer, Space, Form, Input, Select, Checkbox, Upload, Popover } from 'antd'
import { useFetch } from '../../hooks/useFetch';
import { courseService } from '../../services/course.service';
import { useAsync } from '../../hooks/useAsync';
import { useReload } from '../../hooks/useReload'
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { authService } from '../../services/auth.service';
import { generatePath, useNavigate } from 'react-router-dom';
import { PATH } from '../../config/PATH';

const TableCourse = ({ user }) => {
    const { reload: reloadTableCourse, ForceReload: ForceReloadTableCourse } = useReload()
    const navigate = useNavigate()
    // var [courseSelecting, setCourseSelecting] = useState({})
    const [courseIdSelecting, setCourseIdSelecting] = useState(null)

    var { data: resDel, loading: loadingDel, execute: deleteCourse, status: statusDel } = useAsync(courseService.deleteCourseById)
    const { loading: loadingUpdateCourse, status: statusUpdateCourse, execute: updateCourse, error: errorUpdateCourse } = useAsync(courseService.updateCourse)
    const { loading: loadingUpdateTeacher, status: statusUpdateTeacher, execute: updateTeacher, error: errorUpdateTeacher } = useAsync(courseService.updateTeacher)

    var { data: courses, loading, status: statusLoadCourse } = useFetch(() => {
        console.log('call fetch courses');
        return courseService.getAllCourses()
    }, [reloadTableCourse]);

    if (user.role == 'admin') {
        var { data: resAllTeachers, loading: loadAllTeacher, status: statusLoadTeacher } = useFetch(() => authService.getAllTeacher())
    }

    const [formEditCourse] = Form.useForm()
    const [openDrawer, setOpenDrawer] = useState(false)
    const handleOpenDrawer = (course) => {
        setCourseIdSelecting(course._id)
        course.referenceLinks = course.referenceLinks.map((item) => {
            return { title: item.title, link: item.link }
        })
        if (course.teacher) {
            course.teacher = course.teacher._id
        }
        formEditCourse.setFieldsValue(course)
        setOpenDrawer(true)
    }
    const handleUpdateCourse = async () => {
        const referenceLinks = formEditCourse.getFieldValue('referenceLinks')
            .map((item) => (item && item.link ? item : null))
            .filter((value) => value !== null);
        const data = {
            ...formEditCourse.getFieldsValue(),
            referenceLinks,
            _id: courseIdSelecting
        }
        console.log(data);
        formEditCourse.validateFields()
            .then(async () => {
                const resUpdateCourse = await updateCourse(data)
                if (user.role == 'admin') {
                    const resUpdateTeacher = await updateTeacher({ idCourse: data._id, idTeacher: data.teacher })
                }
                if (resUpdateCourse.success == true) {
                    ForceReloadTableCourse()
                    setOpenDrawer(false)
                    formEditCourse.resetFields()
                    message.success('Update course successfully !!!')
                }
                if (resUpdateTeacher == 'success') {
                    ForceReloadTableCourse()
                    setOpenDrawer(false)
                    formEditCourse.resetFields()
                    message.success('Update teacher successfully !!!')
                }
            })
            .catch((data) => {
                console.log(data);
                data.errorFields.map((errField) => {
                    message.warning(errField.errors[0])
                })
            })
    }
    const handleOkModalDelete = async (courseId) => {
        const res = await deleteCourse(courseId)
        if (res.success == true) {
            message.success('Delete course successfully !!!')
            ForceReloadTableCourse()
        } else {
            message.error(res?.response?.data?.message);
        }
    }
    const handleDeleteBtn = (courseId, name) => {
        Modal.confirm({
            title: 'Deleting course',
            content: `Please consider carefully. You are deleting ${name}. All document in this course will disappear`,
            onOk: () => { handleOkModalDelete(courseId) },
        })
        // setCourseIdSelecting(courseId)
    }
    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',

        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, course) => {
                if (user.role == 'admin' || user.role == 'teacher') {
                    return (
                        <Popover trigger={'hover'} content={<span>Click me to see more detail</span>}>
                            <Tag style={{ cursor: 'pointer' }} onClick={() => {navigate(generatePath(PATH.course.getCourseWithID,{id: course._id}))}} bordered={false} color={course.category == 'compulsory' ? 'volcano' : course.category == 'elective' ? 'green' : 'blue'}>{course.name}</Tag>
                        </Popover>
                    )
                } else {
                    return (<Tag  bordered={false} color={course.category == 'compulsory' ? 'volcano' : course.category == 'elective' ? 'green' : 'blue'}>{course.name}</Tag>)
                }
            },
            align: 'center'
        },
        {
            title: 'Major',
            dataIndex: 'major',
            key: 'major',
            render: (_, data) => {
                return data.major.map((ele) => (
                    <Tag key={`${data.code}_${ele}`} bordered={false} color={ele == 'CS' ? 'blue' : ele == 'CE' ? 'volcano' : 'green'}>{ele}</Tag>
                ))
            },
            filters: [
                { text: 'CS', value: 'CS' },
                { text: 'CE', value: 'CE' },
                { text: 'NE', value: 'NE' },
            ],
            onFilter: (value, record) => record.major.includes(value),
        },
        {
            title: 'Category',
            key: 'category',
            dataIndex: 'category',
            render: (category) => <Tag color={category == 'compulsory' ? '#f50' : category == 'elective' ? '#87d068' : '#2db7f5'}>{category.toUpperCase()}</Tag>,
            filters: [
                { text: 'Compulsory', value: 'compulsory' },
                { text: 'Elective', value: 'elective' },
                { text: 'General', value: 'general' },
            ],
            onFilter: (value, record) => record.category == value,
        },
        {
            title: 'Action',
            // align: 'center',
            key: 'action',
            render: (_, course) => {
                // console.log(course);
                return (
                    <Flex gap="small" wrap="wrap"  >
                        {
                            user.role == 'student' && <Button type='primary' ghost href={generatePath(PATH.course.getCourseWithID,{id: course._id})}>View</Button>
                        }
                        {
                            user.role == 'admin' && <Button onClick={() => { handleOpenDrawer(course) }}>Edit</Button>
                        }
                        {
                            user.role == 'teacher' && course?.teacher?.username == user.username && <Button onClick={() => { handleOpenDrawer(course) }}>Edit</Button>
                        }
                        {user.role == 'admin' && <Button type='dashed' onClick={() => { handleDeleteBtn(course._id, course.name) }} danger>Delete</Button>}
                    </Flex>

                )
            },
        },
    ];

    let dataSource = []

    if (!loading && statusLoadCourse == 'success') {
        dataSource = courses.map((course) => ({
            key: course._id,
            _id: course._id,
            code: course.code,
            name: course.name,
            major: course.major,
            category: course.category,
            referenceLinks: course.referenceLinks,
            teacher: course.teacher
        }))

    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 10 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
        },
    };

    // ------------------------------ Test reference links -----------------------

    // ------------------------------ End Test reference links -----------------------

    const { Option } = Select

    return (
        <div id='table-course'>
            <Table loading={loading} columns={columns} dataSource={dataSource} />
            <Drawer
                title={`Edit course`}
                closable={true}
                open={openDrawer}
                placement='right'
                onClose={() => { setOpenDrawer(false) }}
                extra={
                    <Space>
                        <Button onClick={() => { setOpenDrawer(false) }}>Cancel</Button>
                        <Button type="primary" onClick={handleUpdateCourse}>Update</Button>
                    </Space>
                }
            >
                <Form
                    name='Edit course form'
                    {...formItemLayout}
                    form={formEditCourse}

                    layout='vertical'
                >

                    <Tag className='mb-5' bordered={false} color={formEditCourse.getFieldValue("category") == 'compulsory' ? '#f50' : formEditCourse.getFieldValue("category") == 'elective' ? '#87d068' : '#2db7f5'}>{formEditCourse.getFieldValue('code')}</Tag>
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
                    <Form.Item name={"category"} label="Category" rules={[
                        { required: true, message: "Please choose category" }
                    ]}>
                        <Select >
                            <Option value='compulsory'>Compulsory</Option>
                            <Option value='elective'>Elective</Option>
                            <Option value='general'>General</Option>
                        </Select>
                    </Form.Item>
                    {
                        user.role == 'admin' && (
                            <Form.Item name={"teacher"} label="Teacher">
                                <Select loading={statusLoadTeacher != 'success'} >
                                    <Option value={null}>No one</Option>
                                    {
                                        statusLoadTeacher == 'success' && resAllTeachers.users.map((user) => <Option value={user._id}>{user.fullName}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        )
                    }

                    <Form.Item name={"major"} label="Major">
                        <Checkbox.Group options={['CS', 'CE', 'NE']} />
                    </Form.Item>
                    <Form.List name={'referenceLinks'}>
                        {(fields, { add, remove }) => {
                            return (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'title']}
                                                rules={[{ required: true, message: 'Missing value' }]}
                                            >
                                                <Input placeholder="Title" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'link']}
                                                rules={[{ required: true, message: 'Missing value' }]}
                                            >
                                                <Input placeholder="Reference link" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add reference link
                                        </Button>
                                    </Form.Item>
                                </>
                            )
                        }}
                    </Form.List>
                </Form>
            </Drawer>
        </div>
    )
}

export default TableCourse