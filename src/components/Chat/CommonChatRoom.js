import React from 'react'
import PropTypes from 'prop-types'
import { classnames } from '../../utils'
import ChatRoomHeader from './ChatRoomHeader'
import ChatRoomContent from './ChatRoomContent'
import ChatRoomSendBox from './ChatRoomSendBox'
import styles from './ChatRoom.less'

export default class CommonChatRoom extends React.Component
{
    constructor() {
        super()
    }

    render() {
        const { className, title, onlineCount, message, onSend } = this.props

        const headerProps = {
            title,
            onlineCount,
        }

        const mainProps = {
            message, 
        }

        const sendBoxProps = {
            onSend,
        }

        return (
            <div className={classnames(className, styles.chatroom_container)}>
                <ChatRoomHeader {...headerProps}/>
                <ChatRoomContent {...mainProps}/>
                <ChatRoomSendBox {...sendBoxProps}/>
            </div>
        )
    }
}

CommonChatRoom.proptypes = {
    message: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onSend: PropTypes.func.isRequired,
}