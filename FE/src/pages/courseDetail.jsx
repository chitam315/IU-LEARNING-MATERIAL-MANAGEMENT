import React, { useRef, useState } from 'react'
import { generatePath, useParams } from 'react-router-dom'
import { Card, Spin, Divider, Button, Modal, Form, Input, Select, Upload, message, Row, Col, Flex, Popover } from 'antd'
import { useFetch } from '../hooks/useFetch';
import { courseService } from '../services/course.service';
import { AiTwotoneFolderAdd } from "react-icons/ai";
import { useReload } from '../hooks/useReload';
import { useAsync } from '../hooks/useAsync';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { MdOutlineBookmarkAdd, MdOutlineBookmarkAdded } from "react-icons/md";
import { PATH } from '../config/PATH';
import { fileService } from '../services/file.service';
import { wishListService } from '../services/wishlist.service';

import { useAuth } from "../components/AuthContext";

export default function CourseDetail() {
    const { user } = useAuth();
    const { id } = useParams()
    const { reload: reloadCourseDetail, ForceReload: ForceReloadCourseDetail } = useReload()
    const { reload: reloadWishList, ForceReload: ForceReloadWishList } = useReload()

    let permission = user.role != 'student'

    const { data: resGetCourseById, loading: loadingGetCourseById } = useFetch(() => courseService.getCourseById(id), [reloadCourseDetail])
    const { data: resGetWishList, loading: loadingWishList } = useFetch(() => wishListService.getWishList(), [reloadWishList])
    let wishList = []
    if (!loadingWishList) {
        wishList = resGetWishList.wishList
        console.log(wishList);
    }
    let courseDetail = {}
    if (!loadingGetCourseById) {
        courseDetail = resGetCourseById.course
        if (user.role == 'teacher' && courseDetail?.teacher?.username != user.username) {
            permission = false
        }
    }

    const gridStyle = {
        width: '25%',
        textAlign: 'center',
    };

    // ---------------- setup modal add file ----------------
    const uploadRef = useRef()
    const [openModalAddFile, setOpenModalAddFile] = useState(false)
    const { loading: loadingAddFile, status: statusAddFile, execute: addFileToCourse, error: errorAddFile } = useAsync(fileService.addFile)

    const [formAddFile] = Form.useForm()

    const [fileAddToCourse, setFileAddToCourse] = useState(null);

    const handleUpload = async () => {
        if (!fileAddToCourse) {
            // No file selected, handle accordingly
            message.error('Please select a file');
            return;
        }

        formAddFile.validateFields()
            .then(async (data) => {
                // Create a FormData object
                const formData = new FormData();

                // Append the file to the FormData object with a key 'file'
                formData.append('id', id)
                formData.append('file', fileAddToCourse);

                // Append other keys and their values to the FormData object
                formData.append('group', data.group);
                formData.append('title', data.title);
                formData.append('shortDescription', data.shortDescription)
                // Make an API call using axios or any other HTTP library

                // const response = await axiosObj.post('http://localhost:8080/file/create-file/IT064IU', formData);

                const responseAddFile = await addFileToCourse(formData)
                console.log(responseAddFile);
                message.success('Add file successfully');
                setFileAddToCourse(null)
                formAddFile.resetFields()
                setOpenModalAddFile(false)
                ForceReloadCourseDetail()
            })

    };

    const handleChange = (info) => {
        setFileAddToCourse(info.file);
        if (info.file.status === 'removed') {
            // File is removed, clear it from the state
            setFileAddToCourse(null);
        }
    };

    // ---------------- end setup modal add file ----------------

    // ---------------- setup modal delete file ----------------

    const handleDeleteBtn = (file) => {
        Modal.confirm({
            title: 'You are deleting file',
            content: `Please consider carefully. You are deleting ${file.title}. All data in this file will disappear`,
            onOk: () => { handleOkModalDelete(file._id) },
        })
    }

    var { data: resDel, loading: loadingDel, execute: deleteFile, status: statusDel } = useAsync(fileService.deleteFile)

    const handleOkModalDelete = async (fileId) => {
        const res = await deleteFile(fileId)
        if (res.success == true) {
            message.success('Delete course successfully !!!')
            ForceReloadCourseDetail()
        }
    }
    // ---------------- end setup modal delete file ----------------

    // ---------------- setup modal add file to wish list ----------------

    var { data: resAddWishList, loading: loadAddWishList, execute: addWishList } = useAsync(wishListService.addFileToWishList)
    const handleAddToWishList = (file) => {
        Modal.confirm({
            title: `Add ${file.title} to your wishlist`,
            onOk: async () => {
                const res = await addWishList({ fileId: file._id })
                if (res.success == true) {
                    message.success('Add wish list successfully')
                    ForceReloadWishList()
                }
            }
        })
    }
    // ---------------- end setup modal add file to wish list ----------------


    // ---------------- setup modal remove file to wish list ----------------
    const { execute: removeFromWishList } = useAsync(wishListService.removeFromWishList)
    const handleRemoveFromWishList = (file) => {
        Modal.confirm({
            title: `Delete ${file.title} from wish list`,
            onOk: async () => {
                const res = await removeFromWishList(file._id)
                if (res?.success == true) {
                    message.success('Delete file from wish list successfully')
                    ForceReloadWishList()
                } else {
                    // handleError(res)
                }

            }
        })
    }

    // ---------------- end setup modal remove file to wish list ----------------

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

    if (loadingGetCourseById) {
        return <Spin size='large' fullscreen />
    }

    return (
        <>
            <Card bodyStyle={{ backgroundImage: 'linear-gradient(-45deg, #b6f6af, #addff5)' }} headStyle={{ backgroundImage: 'linear-gradient(45deg, #85df7b, #58a8ca)' }} bordered={true} style={{ margin: '20px 20px' }} title={courseDetail.name} extra={permission && <Button onClick={() => setOpenModalAddFile(true)} icon={<AiTwotoneFolderAdd />}>Add file to this course</Button>}>
                <Divider orientation='left'>Reference links</Divider>
                <Row gutter={[16, 16]}>
                    {
                        courseDetail.referenceLinks.map((link) => (
                            <Col key={link._id} span={8}>
                                <Flex justify='space-between' align='center' style={{ border: 'thick double #234e18', padding: '10px 20px' }}>
                                    <p style={{ fontWeight: 'bolder' }}>{link.title}</p>
                                    <Button size='middle' target='_blank' href={link.link}>Visit</Button>
                                </Flex>
                            </Col>
                        ))
                    }

                </Row>

                <Divider orientation='left'>Files in this course</Divider>


                <Row gutter={[16, 16]}>
                    {
                        courseDetail.files.map((file) => (
                            <Col key={file._id} span={24}>
                                <Card style={{ height: '100%' }}
                                    title={
                                        <>
                                            <span className='mr-3'>
                                                <Popover trigger={'hover'} content={'Views'}>
                                                    <Button style={{ marginRight: 10 }} shape='circle' size='small'>{file.views}</Button>
                                                </Popover>
                                                {file.title}
                                            </span>
                                            {
                                                (() => {
                                                    if (!loadingWishList) {
                                                        if (wishList.some(item => item._id == file._id)) {
                                                            return (<Button style={{ backgroundColor: 'yellow' }} icon={<MdOutlineBookmarkAdded />} onClick={() => handleRemoveFromWishList(file)} />)
                                                        } else {
                                                            return (<Button icon={<MdOutlineBookmarkAdd />} onClick={() => handleAddToWishList(file)} />)
                                                        }
                                                    } else {
                                                        return (<h1>test</h1>)
                                                    }
                                                })()
                                            }
                                        </>
                                    }
                                    bordered={true} extra={
                                        <Flex gap={10}>
                                            <Button target='_blank' type='link' href={file.path} icon={<DownloadOutlined />}>Download</Button>
                                            {user.role == 'admin' && <Button onClick={() => handleDeleteBtn(file)} type='dashed' danger>Delete</Button>}
                                            <Button target='_blank' href={generatePath(PATH.file.getFileWithId, { id: file._id })} >View detail</Button>
                                        </Flex>
                                    }>
                                    {file.shortDescription}
                                </Card>
                            </Col>
                        ))
                    }

                </Row>
            </Card >

            {/* ------------------------ Modal create thesis ------------------------ */}
            < Modal
                title="Add file"
                centered
                open={openModalAddFile}
                onOk={handleUpload}
                confirmLoading={loadingAddFile}
                onCancel={() => setOpenModalAddFile(false)
                }
                width={1000}
            >
                <Form
                    name='Add file to course'
                    {...formItemLayout}
                    form={formAddFile}
                    initialValues={{
                        title: '',
                        shortDescription: '',
                        group: 'lesson'
                    }}
                    layout='horizontal'
                >
                    <Form.Item name={"title"} label="Title" rules={[
                        { required: true, message: 'Title is required' },
                        // { min: 6, message: `Thesis's name contains at least 6 characters` }
                    ]}>
                        <Input placeholder={'Title of this file'} />
                    </Form.Item>
                    <Form.Item name={"shortDescription"} label="Short description" rules={[
                        { required: true, message: 'Short description is required' },
                    ]}>
                        <Input placeholder={'Short description about this file'} />
                    </Form.Item>
                    <Form.Item name={"group"} label="Type">
                        <Select >
                            <Option value='syllabus'>Syllabus</Option>
                            <Option value='lesson'>Lesson</Option>
                            <Option value='reference'>Reference</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Upload
                            ref={uploadRef}
                            accept="application/pdf"
                            maxCount={1}
                            fileList={fileAddToCourse == null ? [] : [fileAddToCourse]}
                            // customRequest={() => false}  // Disable automatic uploading
                            beforeUpload={() => false}
                            onChange={handleChange}

                        >
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </ Modal>
            {/* ------------------------ End modal create thesis ------------------------ */}
        </>
    )
}
