import React from 'react'
import PropTypes from 'prop-types'
import WrapUnAuth from './WrapUnAuth'
import { getAuth } from '../../utils'

const WrapAuth = ComposedComponent => class WrapComponent extends React.Component {

    constructor(props) {
        super(props)
    }

    static propTypes = {
        auth: PropTypes.string.isRequired,
        userAuth: PropTypes.array.isRequired,
        unAuthType: PropTypes.string,
        alertText: PropTypes.string,
    }

    render() {
        const { auth, userAuth, unAuthType, alertText, app, ...props } = this.props

        const unAuthProps = {
            unAuthType, 
            alertText, 
            ...props
        }
        if (getAuth(auth, userAuth)) {
            return <ComposedComponent  { ...props } />
        } else {
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
}

export default WrapAuth