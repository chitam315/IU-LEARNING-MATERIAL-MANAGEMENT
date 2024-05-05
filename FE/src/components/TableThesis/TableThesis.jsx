import { Button, Drawer, Flex, Form, Input, Modal, Popover, Select, Space, Table, Tag, message } from 'antd'
import React, { useState } from 'react'
import { thesisService } from '../../services/thesis.service';
import { useReload } from '../../hooks/useReload';
import { useFetch } from '../../hooks/useFetch';
import { useAsync } from '../../hooks/useAsync';
import { handleError } from '../../utils/handleError';
import { DownloadOutlined } from '@ant-design/icons';
import { generatePath, useNavigate } from 'react-router-dom';
import { PATH } from '../../config/PATH';

const TableThesis = ({user}) => {
    const navigate = useNavigate()

    const { reload: reloadTableThesis, ForceReload: ForceReloadTableThesis } = useReload()

    var { data: resAllThesis, loading: loadingAllThesis, status: statusLoadAllThesis } = useFetch(() => {
        console.log('call fetch thesis');
        return thesisService.getAllThesis()
    }, [reloadTableThesis]);

    const columns = [
        {
            title: 'Topic',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            render: (_, thesis) => {
                if (user.role == 'admin') {
                    return (
                        <Popover trigger={'hover'} content={<span>Click me to see more detail</span>}>
                            <Tag style={{cursor: 'pointer'}} onClick={() => window.open(`/thesis/${thesis._id}`,'_blank')} bordered={false} color={thesis.category == 'report form' ? 'volcano' : thesis.category == 'timeline' ? 'green' : 'blue'}>{thesis.name}</Tag>
                        </Popover>
                    )
                } else {
                    return <Tag bordered={false} color={thesis.category == 'report form' ? 'volcano' : thesis.category == 'timeline' ? 'green' : 'blue'}>{thesis.name}</Tag>
                }
            },
        },
        {
            title: 'Description',
            dataIndex: 'shortDescription',
            key: 'shortDescription',
            align: 'center',
            render: (text) => (<span style={{overflowWrap: 'anywhere', maxWidth: '100px'}}>{text}</span>)
        },
        {
            title: 'Category',
            key: 'category',
            dataIndex: 'category',
            render: (category) => <Tag color={category == 'report form' ? '#f50' : category == 'timeline' ? '#87d068' : '#2db7f5'}>{category.toUpperCase()}</Tag>,
            align: 'center',
            filters: [
                { text: 'Report form', value: 'report form' },
                { text: 'Timeline', value: 'timeline' },
                { text: 'Thesis', value: 'thesis' },
            ],
            onFilter: (value, record) => record.category == value,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, thesis) => {
                // console.log(course);
                if (user.role == 'admin') {
                    return (
                        <Flex gap="large" wrap="wrap" justify='center' >
                            <Button onClick={() => { handleOpenDrawer(thesis) }}>Edit</Button>
                            <Button type='dashed' onClick={() => { handleDeleteThesis(thesis) }} danger>Delete</Button>
                            <Button target='_blank' type='link' href={thesis.path} icon={<DownloadOutlined />}>Download</Button>
                        </Flex>
                    )
                } else {
                    return (
                        <Flex gap="large" wrap="wrap" justify='center' >
                            <Button href={generatePath(PATH.thesis.openThesisWithId,{id: thesis._id})}>View</Button>
                            <Button target='_blank' type='link' href={thesis.path} icon={<DownloadOutlined />}>Download</Button>
                        </Flex>
                    )
                }
            },
            align: 'center',
            fixed: 'right',
        },
    ];
    let dataSource = []
    if (!loadingAllThesis && statusLoadAllThesis == 'success') {
        dataSource = resAllThesis.thesisArr.map((thesis) => ({
            key: thesis._id,
            _id: thesis._id,
            name: thesis.name,
            category: thesis.category,
            path: thesis.path,
            shortDescription: thesis.shortDescription
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

    const { Option } = Select
    // -------------------------- set up delete thesis -----------------------------
    const { execute: deleteThesis } = useAsync(thesisService.deleteThesis)
    const handleDeleteThesis = (thesis) => {
        Modal.confirm({
            title: 'Delete thesis',
            content: `Please consider carefully. You are deleting ${thesis.name}. All data related it will disappear`,
            onOk: async () => {
                const res = await deleteThesis(thesis)
                if (res?.success == true) {
                    ForceReloadTableThesis()
                    message.success('Delete thesis successfully')
                } else {
                }

            }
        })
    }
    // -------------------------- end set up delete thesis -----------------------------

    // -------------------------- set up drawer update thesis -----------------------------
    const [openDrawer, setOpenDrawer] = useState(false)
    const [thesisSelecting, setThesisSelecting] = useState({})
    const [formEditThesis] = Form.useForm()
    const { execute: updateThesis } = useAsync(thesisService.updateThesis)

    const handleOpenDrawer = (thesis) => {
        setThesisSelecting(thesis)
        setOpenDrawer(true)
        formEditThesis.setFieldsValue({
            name: thesis.name,
            category: thesis.category,
            shortDescription: thesis.shortDescription
        })
    }

    const handleUpdateThesis = async () => {
        const FieldsError = formEditThesis.getFieldsError()
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
            const res = await updateThesis({
                ...formEditThesis.getFieldsValue(),
                _id: thesisSelecting._id
            })
            if (res.success == true) {
                ForceReloadTableThesis()
                setOpenDrawer(false)
                message.success('Update thesis successfully')
            }
        }

    }
    // -------------------------- end set up drawer update thesis -----------------------------
    return (
        <div id="table-thesis" style={{maxWidth: '100%'}}>
            <Table loading={loadingAllThesis} style={{maxWidth: '100%'}} columns={columns} dataSource={dataSource} />
            <Drawer
                title={`Edit thesis file`}
                closable={true}
                open={openDrawer}
                placement='top'
                onClose={() => { setOpenDrawer(false) }}
                extra={
                    <Space>
                        <Button onClick={() => { setOpenDrawer(false) }}>Cancel</Button>
                        <Button type="primary" onClick={handleUpdateThesis}>Update</Button>
                    </Space>
                }
            >
                <Form
                    name='Edit user form'
                    {...formItemLayout}
                    form={formEditThesis}
                // layout='horizontal'
                >
                    <Tag className='mb-5' bordered={false} color={thesisSelecting?.category == 'report form' ? '#f50' : thesisSelecting?.category == 'timeline' ? '#87d068' : '#2db7f5'}>{thesisSelecting.name}</Tag>
                    <Form.Item name={"name"} label="Thesis's name" rules={[
                        { required: true, message: 'Name of thesis is required' }
                    ]}>
                        <Input placeholder={thesisSelecting?.name} />
                    </Form.Item>
                    <Form.Item name={"shortDescription"} label="Thesis's name" rules={[
                        { required: true, message: 'Description of thesis is required' }
                    ]}>
                        <Input placeholder={thesisSelecting?.shortDescription} />
                    </Form.Item>
                    <Form.Item name={"category"} label="Category">
                        <Select >
                            <Option value='thesis'>Thesis</Option>
                            <Option value='timeline'>Timeline</Option>
                            <Option value='report form'>Report form</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    )
}

export default TableThesis