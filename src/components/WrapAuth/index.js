import { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Menu } from 'antd'
import { getAuth } from '../../utils'

const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu

let wrapAuth = ComposedComponent => class WrapComponent extends Component {
    // 构造
    constructor(props) {
        super(props)
    }

    static propTypes = {
        auth: PropTypes.string.isRequired,
        userAuth: PropTypes.array.isRequired,
        unAuthType: PropTypes.string,
        alertText: PropTypes.string,
    };

    render() {
        if (getAuth(this.props.auth, this.props.userAuth)) {
            return <ComposedComponent  { ...this.props} />
        } else {
            switch (this.props.unAuthType) {
                case 'alert':
                    return <ComposedComponent onClick={() => alert(this.props.alertText ? this.props.alertText : "权限不足，请找管理员申请")} { ...this.props} />
                case 'disabled':
                    return <ComposedComponent disabled={true}  { ...this.props} />
                case 'null':
                default:
                    return null
            }
        }
    }
}

export const AuthButton = wrapAuth(Button)

export const AuthMenuItem = wrapAuth(MenuItem)

export const AuthSubMenu = wrapAuth(SubMenu)
