import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Layout, Chat } from '../components'
import { classnames, config, menu } from '../utils'
import { Helmet } from 'react-helmet'
import { Row, Col, Radio } from 'antd'
import { Comments } from './dashboard/components'
import MessageCenter from './messageCenter'
import ChatModal from './components/ChatModal'
import '../themes/index.less'
import './app.less'
import NProgress from 'nprogress'
const { prefix } = config

const { Header, Bread, Footer, Sider, styles } = Layout
const { CommonChatRoom } = Chat
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
let lastHref

const App = ({ children, location, dispatch, app, chat, loading }) => {
  const { user, siderFold, notificationCount, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys } = app
  const { chatMessage, chatRoomVisible, currentChatKey, currentChat, onlineMembers } = chat
  const href = window.location.href

  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }

  const headerProps = {
    menu,
    user,
    siderFold,
    location,
    isNavbar,
    menuPopoverVisible,
    notificationCount,
    navOpenKeys,
    switchMenuPopover () {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout () {
      dispatch({ type: 'app/logout' })
    },
    switchSider () {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys (openKeys) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
    checkNotice () {
      dispatch({ type: 'app/triggerMsgCenter' })
      dispatch({ type: 'app/clearNoticeCount' })
    },
  }

  const siderProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeTheme () {
      dispatch({ type: 'app/switchTheme' })
    },
    changeOpenKeys (openKeys) {
      localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }

  const breadProps = {
    menu,
  }

  const chatRoomModalProps = {
    currentChat,
    onlineMembers,
    currentChatKey,
    currentMessage: chatMessage[currentChatKey] || [],
    visible: chatRoomVisible,
    maskCloseable: true,
    confirmLoading: loading.effects['chat/sendMessage'],
    title: chatRoomVisible ? currentChat : '',
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: 'chat/sendMessage',
        payload: data
      })
    },
    onCancel() {
      dispatch({
        type: 'chat/hideChatRoom',
      })
    }
  }

  if (config.openPages && config.openPages.indexOf(location.pathname) > -1) {
    return <div>{children}</div>
  }

  const { iconFontJS, iconFontCSS, logo } = config

  return (
    <div>
      <Helmet>
        <title>{config.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS}></script>}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>
      <div className={classnames(styles.layout, { [styles.fold]: isNavbar ? false : siderFold }, { [styles.withnavbar]: isNavbar })}>
        {!isNavbar ? <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
          <Sider {...siderProps} />
        </aside> : ''}
        <div className={styles.main}>
          <Header {...headerProps} />
          <div className={styles.page}>
            <Bread {...breadProps} location={location} />
            <div className={styles.container}>
              <div className={styles.content}>
                {children}
              </div>
            </div>
            <MessageCenter/>
            {chatRoomVisible && <ChatModal {...chatRoomModalProps} />}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ app, message, chat, loading }) => ({ app, message, chat, loading }))(App)
