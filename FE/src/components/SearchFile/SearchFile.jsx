import React, { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { fileService } from '../../services/file.service'
import { Table, Input, Popover, Button } from 'antd'
import { Link, generatePath, useNavigate } from 'react-router-dom'
import { PATH } from '../../config/PATH'
import { DownloadOutlined } from '@ant-design/icons'

const SearchFile = () => {
    const { data: resLoadAllFiles, loading: loadAllFiles } = useFetch(fileService.getAllFiles)
    const [searchedText, setSearchedText] = useState('')
    let dataSource = []
    if (!loadAllFiles) {
        dataSource = resLoadAllFiles.allFiles.map(file => ({
            key: file._id,
            path: file.path,
            fileName: file.title,
            courseName: file.course.name,
            views: file.views
        }))
    }

    const navigate = useNavigate()

    const content = (
        <div style={{ maxWidth: 350, maxHeight: 400, zIndex: 100 }} >
            <Table scroll={{ x: true, y: 250 }} columns={[
                {
                    title: 'File name',
                    dataIndex: 'fileName',
                    key: 'fileName',
                    filteredValue: [searchedText],
                    onFilter: (value, file) => {
                        return String(file.fileName).toLowerCase().includes(searchedText.toLowerCase()) || String(file.courseName).toLowerCase().includes(searchedText.toLowerCase())
                    },
                    render: (value, file) =>
                        <div className='flex justify-between'>
                            <Link to={generatePath(PATH.file.getFileWithId, { id: file.key })}>
                                {value}
                                <Popover trigger={'hover'} content={'Views'}>
                                    <Button style={{ marginLeft: 10 }} shape='circle' size='small'>{file.views}</Button>
                                </Popover>
                            </Link>
                            <Button type='link' href={file.path} icon={<DownloadOutlined />}></Button>
                        </div>
                }
            ]} dataSource={dataSource} />
        </div>
    )
    return (
        <div className='relative'>
            <Popover trigger='click' content={content} >
                <Input.Search onSearch={() => { console.log('click search'); }} style={{ width: '100%' }} height={50} onChange={e => setSearchedText(e.target.value)} />
            </Popover>
        </div>
    )
}

export default SearchFile





