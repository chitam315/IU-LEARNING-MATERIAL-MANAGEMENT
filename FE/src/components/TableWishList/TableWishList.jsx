import { Button, Card, Col, Row, Space, Spin, Modal, message, Table} from 'antd'
import React from 'react'
import { useFetch } from '../../hooks/useFetch'
import { wishListService } from '../../services/wishlist.service'
import { useReload } from '../../hooks/useReload'
import { useAsync } from '../../hooks/useAsync'
import { handleError } from '../../utils/handleError'
import { DownloadOutlined } from '@ant-design/icons'
import { generatePath } from 'react-router-dom'
import { PATH } from '../../config/PATH'
import { CiBookmarkRemove } from "react-icons/ci";


const TableWishList = () => {
    const { reload: reloadWishList, ForceReload: ForceReloadWishList} = useReload()
    const { loading: loadingTableWishList, data: resLoadingTableWishList } = useFetch(wishListService.getWishList,[reloadWishList])
    
    // -------------------------- set up delete thesis -----------------------------
    const { execute: removeFromWishList } = useAsync(wishListService.removeFromWishList)
    const handleRemoveFromWishList = (file) => {
        Modal.confirm({
            title: `Delete ${file.title} from wish list`,
            onOk: async () => {
                const res = await removeFromWishList(file._id)
                if (res?.success == true) {
                    ForceReloadWishList()
                    message.success('Delete file from wish list successfully')
                } else {
                    // handleError(res)
                }

            }
        })
    }
    if (!loadingTableWishList) {
        console.log('wish list is : ', resLoadingTableWishList.wishList);
    }
    if (loadingTableWishList) {
        return <Spin fullscreen size='large' />
    }
    if (!loadingTableWishList && resLoadingTableWishList.wishList.length == 0) {
        message.info('You do not have any file in wish list')
        return <div className='flex w-full h-full items-center justify-center'>
             <Table dataSource={[]}></Table>
        </div>
    }
    // -------------------------- end set up delete thesis -----------------------------
    return (
        <>
            <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Row gutter={[12, 12]}>
                    {
                        resLoadingTableWishList.wishList.map(file => (
                            <Col span={24}>
                                <Card style={{height: '100%'}} title={file.title} bordered={false} extra={
                                    <Space>
                                        <Button  type='dashed' danger target='_blank' icon={<CiBookmarkRemove/>} onClick={() => handleRemoveFromWishList(file)}>Remove</Button>
                                        <Button target='_blank' type='link' href={file.path} icon={<DownloadOutlined />}>Download</Button>
                                        <Button target='_blank' href={generatePath(PATH.file.getFileWithId, { id: file._id })} >View detail</Button>
                                    </Space>
                                }>
                                    <div>{file.shortDescription}</div>
                                </Card>
                            </Col>

                        ))
                    }
                </Row>
            </div>
        </>
    )
}

export default TableWishList