import React from 'react'
import PropTypes from 'prop-types'
import styles from './ChatRoomContent.less'

export default class ChatRoomContent extends React.Component
{
    constructor() {
        super()
    }

    componentDidUpdate() {
        let msgBox = this.refs.msgBox
        msgBox.scrollTop = msgBox.scrollHeight
    }

    render() {
        const { message } = this.props

        const msgList = message.map( (item, key) => <li key={key}>
            <div className={styles.sender}>{item.from}:</div>
            <div className={styles.msg} dangerouslySetInnerHTML={{__html: item.data}} />
        </li>)

        return (
            <div className={styles.content}>
                <ul className={styles.msg_box} ref="msgBox">
                    {msgList}
                </ul>
            </div>
        )
    }
}

ChatRoomContent.proptypes = {
    message: PropTypes.array.isRequired,
}