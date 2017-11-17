import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Radio, Badge } from 'antd'
import { classnames } from '../../utils'
import { Layout, Chat } from '../../components'
import { NoticeList, OnlineList } from './components'

const { styles } = Layout
const { CommonChatRoom } = Chat
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const MessageCenter = ({ dispatch, app, message }) => {
    const { isNavbar, msgCenterRadios, msgCenterShow, contentValue } = app
    const { msgNotice } = message

    const noticeWidth = 350

    const handleMsgRadioChange = (e) => {
        dispatch({
            type: 'app/showMsgContent',
            payload: e.target.value
        })
    }

    const noticeListProps = {
        onRemoveNotice(key) {
            dispatch({
                type: 'message/removeNotice',
                payload: key
            })
        }
    }

    return (
        <aside className={classnames(styles.chatsider, { [styles.chatshow]: msgCenterShow })}>
            <Row>
                <Col span={24} style={{ textAlign: 'center', marginTop: 30 }}>
                    <RadioGroup defaultValue={contentValue} onChange={handleMsgRadioChange}>
                        {msgCenterRadios.map((item) => <RadioButton key={item.key} value={item.key}><Badge key={`badge-${item.key}`} count={item.count}>{item.value}</Badge></RadioButton>)}
                    </RadioGroup>
                </Col>
            </Row>
            <section
                className={styles.msg_content} 
                style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    flexWrap: 'no-warp', 
                    overflow: 'hidden', 
                    position: 'relative', 
                    top: 30, 
                    left: isNavbar ? -100 * (contentValue - 1) + 'vw' : -noticeWidth * (contentValue - 1) + 'px' , 
                    width: isNavbar ? 100 * msgCenterRadios.length + 'vw' : noticeWidth * msgCenterRadios.length + 'px'
                }}
            >
                <NoticeList className={styles.chatshow} dataSource={msgNotice} {...noticeListProps} />
                <OnlineList className={styles.chatshow}/>
            </section>
        </aside>
    )
}

MessageCenter.proptypes = {

}

export default connect(({ app, message }) => ({ app, message }))(MessageCenter)