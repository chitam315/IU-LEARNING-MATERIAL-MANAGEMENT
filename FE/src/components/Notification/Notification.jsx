import { Button, Card, Col, Flex, Popover, Row, Divider } from 'antd';
import React from 'react'
import { useFetch } from '../../hooks/useFetch';
import { announcementService } from '../../services/announcement.service';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useAuth } from '../AuthContext';
import TimeDifference from '../TimeDifference/TimeDifference'

const Notification = () => {
    const { user } = useAuth()
    const { loading: loadingAnnouncement, data: resGetAnnouncement } = useFetch(() => { return announcementService.getAllAnnouncement() }, [])
    let contentNoti = (<div></div>)
    if (!loadingAnnouncement && resGetAnnouncement.allAnnounce.length > 0) {
        contentNoti = (<div style={{ width: 350, maxHeight: 400, overflow: 'auto' }}>
            {resGetAnnouncement.allAnnounce.map(noti => (
                <Card key={noti._id} bodyStyle={{ padding: '10px 20px' }} headStyle={{ padding: '0px 10px' }} style={{ marginBottom: 5 }} title={noti.title} extra={<Button type='link' href={noti.link}>See more</Button>}>
                    <div style={{position: 'relative'}}>
                        <p>{noti.shortDescription}</p>
                        <TimeDifference createdAt={noti.createdAt}/>
                    </div>
                </Card>
            ))}
        </div>)
    } else if (!loadingAnnouncement && resGetAnnouncement.allAnnounce.length == 0) {
        contentNoti = <div style={{ maxWidth: 350, maxHeight: 400, overflow: 'auto' }}>You have no notification</div>
    }



    return (
        <Popover overlayInnerStyle={{ background: '#ECECEC' }} trigger='hover' overlayStyle={{}} content={contentNoti} placement="bottom">
            <Button size="large" shape="circle" style={{ fontSize: '15px', padding: 5, display: 'flex', gap: 10, fontWeight: 'bolder', marginRight: 10 }} color={user.role == 'student' ? 'processing' : 'success'} icon={<IoMdNotificationsOutline size={28} />} />
        </Popover>
    )
}

export default Notification