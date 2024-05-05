import { Button, Card, Col, Row, Space, Spin, Tag, Modal, message} from 'antd'
import React from 'react'
import { useFetch } from '../../hooks/useFetch'
import { announcementService } from '../../services/announcement.service'
import { useReload } from '../../hooks/useReload'
import { useAsync } from '../../hooks/useAsync'
import { handleError } from '../../utils/handleError'

const TableAnnouncement = () => {
    const { reload: reloadAnnounce, ForceReload: ForceReloadAnnounce} = useReload()
    const { loading: loadingTableAnnounce, data: resLoadingTableAnnounce } = useFetch(announcementService.getAllAnnouncement,[reloadAnnounce])
    
    // -------------------------- set up delete thesis -----------------------------
    const { execute: deleteAnnounce } = useAsync(announcementService.deleteAnnouncement)
    const handleDeleteAnnounce = (announce) => {
        Modal.confirm({
            title: 'Delete announcement',
            content: `Please consider carefully. You are deleting announcement '${announce.title}'. All data related it will disappear`,
            onOk: async () => {
                const res = await deleteAnnounce(announce._id)
                if (res?.success == true) {
                    ForceReloadAnnounce()
                    message.success('Delete announce successfully')
                } else {
                    // handleError(res)
                }

            }
        })
    }
    if (loadingTableAnnounce) {
        return <Spin fullscreen size='large' />
    } 
    // -------------------------- end set up delete thesis -----------------------------
    return (
        <>
            <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Row gutter={[12, 12]}>
                    {
                        resLoadingTableAnnounce.allAnnounce.map(announce => (
                            <Col span={12}>
                                <Card style={{height: '100%'}} title={announce.title} bordered={false} extra={
                                    <Space>
                                        <Button type='dashed' danger target='_blank' onClick={() => handleDeleteAnnounce(announce)}>Delete</Button>
                                        <Button type='link' href={announce.link} target='_blank'>View more</Button>
                                    </Space>
                                }>
                                    <div>{announce.shortDescription}</div>
                                    <br />
                                    {announce.isAll != 'none' && <Tag bordered={false} color={announce.isAll == 'user' ? 'processing' : announce.isAll == 'student' ? 'success' : 'pink'}>{`All ${announce.isAll}`}</Tag>}
                                    {announce.isAll == 'none' && announce.users.map(user => <Tag>{user.username}</Tag>)}
                                </Card>
                            </Col>

                        ))
                    }
                </Row>
            </div>
        </>
    )
}

export default TableAnnouncement