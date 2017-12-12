import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import styles from './ChatRoomContent.less'

export default class ChatRoomContent extends React.Component
{
    constructor() {
        super()
    }

    componentDidUpdate() {
        let msgBox = this.refs.msgBox
        const { scrollBottom } = this.props
        if (scrollBottom) {
            msgBox.scrollTop = msgBox.scrollHeight
        }
    }

    render() {
        const { message, pagination, messageLoading, onLoadMore } = this.props
        const { current, size, total } = pagination

        const msgList = message.map( (item, key) => <li key={key}>
            <div className={styles.sender}>{item.from} {item.send_time}:</div>
            <div className={styles.msg} dangerouslySetInnerHTML={{__html: item.message}} />
        </li>)

        return (
            <div className={styles.content}>
                <Spin spinning={messageLoading}>
                    <ul className={styles.msg_box} ref="msgBox">
                        {(current * size) < total &&
                            <li key="sysnotice">
                                <div className={styles.sysnotice} >
                                    <span onClick={onLoadMore}>点击查看更多消息</span>
                                </div>
                            </li>
                        }
                        {msgList}
                    </ul>
                </Spin>
            </div>
        )
    }
}

ChatRoomContent.proptypes = {
    message: PropTypes.array.isRequired,
}