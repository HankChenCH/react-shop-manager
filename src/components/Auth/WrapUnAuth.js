import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'

const warning = (title, content) => {
    Modal.warning({
        title,
        content,
    })
}

const WrapUnAuth = ComposedComponent => class WrapComponent extends React.Component {

    constructor(props) {
        super(props)
    }

    static propTypes = {
        unAuthType: PropTypes.string,
        alertText: PropTypes.string,
    }

    render() {
        const { unAuthType, alertText, ...props } = this.props

        switch (unAuthType) {
            case 'alert':
                const warningText = alertText ? alertText : '权限不足，请找管理员申请'
                return <ComposedComponent { ...props } onClick={() => warning('权限被拒绝', warningText)} />
            case 'disabled':
                return <ComposedComponent { ...props } disabled={true} />
            case 'null':
            default:
                return null
        }
    }
}

export default WrapUnAuth