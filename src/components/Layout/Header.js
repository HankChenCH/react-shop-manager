import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Menu, Icon, Popover, Badge } from 'antd'
import { classnames } from '../../utils'
import styles from './Header.less'
import Menus from './Menu'

const SubMenu = Menu.SubMenu

const Header = ({ user, logout, notificationCount, switchSider, siderFold, isNavbar, menuPopoverVisible, location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu, checkNotice }) => {
  const handleClickMenu = e => e.key === 'logout' && logout()
  const handleClickNotification = e => checkNotice()
  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  return (
    <div className={styles.header}>
      {isNavbar
        ? <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...menusProps} />}>
          <div className={styles.button}>
            <Icon type="bars" />
          </div>
        </Popover>
        : <div className={classnames(styles.button, { [styles.center]: true })} onClick={switchSider}>
          <Icon type={siderFold ? 'menu-unfold' : 'menu-fold'} />
        </div>}
      <div className={styles.rightWarpper}>
        <div className={classnames(styles.button, { [styles.center]: true })} onClick={handleClickNotification}>
          <Badge count={notificationCount}>
            <Icon type="message" style={{ fontSize: 14 }}/>
          </Badge>
        </div>
        <Menu mode="horizontal" onClick={handleClickMenu}>
          <SubMenu className={styles.center} style={{
            float: 'right',
            zIndex: 100,
          }} title={< span > <Icon type="user" />
            {user.username} < /span>}
          >
            <Menu.Item key="personal">
              <Link to="/setting/personal">个人中心</Link>
            </Menu.Item>
            <Menu.Item key="logout">
              登    出
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </div>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  notificationCount: PropTypes.number,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
