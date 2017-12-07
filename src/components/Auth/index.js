import { Button, Menu, Icon, Switch } from 'antd'
import DropOption from '../DropOption'
import WrapAuth from './WrapAuth'
import WrapUnAuth from "./WrapUnAuth"

const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu

export const AuthButton = WrapAuth(Button)

export const AuthSwtich = WrapAuth(Switch)

export const AuthMenuItem = WrapAuth(MenuItem)

export const AuthSubMenu = WrapAuth(SubMenu)

export const UnAuthButton = WrapUnAuth(Button)

export const UnAuthMenuItem = WrapUnAuth(MenuItem)

export const UnAuthSubMenu = WrapUnAuth(SubMenu)

export const AuthDropOption = ({ onMenuClick, menuOptions, unAuthType, alertText, ...dropProps }) => {
    return (
        menuOptions.length > 0 ?
            <DropOption onMenuClick={onMenuClick} menuOptions={menuOptions} {...dropProps} style={{ border: 'none' }} /> : 
            <UnAuthButton unAuthType={unAuthType ? unAuthType : "alert"} alertText={alertText} {...dropProps} style={{ border: 'none' }} >
                <Icon style={{ marginRight: 2 }} type="bars" />
                <Icon type="down" />
            </UnAuthButton>
    )
}