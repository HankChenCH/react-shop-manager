import React from 'react'
import PropTypes from 'prop-types'

export default class ChatRoomHeader extends React.Component
{
    constructor() {
        super()
    }

    render() {
        const { title } = this.props
        return (
            <div>
                <h2>{title}</h2>
                {
                    this.props.onlineCount > 0 &&
                    <div style={{ textAlign: 'right' }}>在线 {this.props.onlineCount} 人</div>
                }
            </div>
        )
    }
}

ChatRoomHeader.proptypes = {
    title: PropTypes.string,
    onlineCount: PropTypes.number,
}