import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Layout, Chat } from '../components'
import { classnames, config, menu } from '../utils'
import { Helmet } from 'react-helmet'
import { Row, Col, Radio } from 'antd'
import { Comments } from './dashboard/components'
import '../themes/index.less'
import './app.less'
import NProgress from 'nprogress'
const { prefix } = config

const { Header, Bread, Footer, Sider, styles } = Layout
const { CommonChatRoom } = Chat
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
let lastHref

const App = ({ children, location, dispatch, app, message, loading }) => {
  const { user, siderFold, notificationCount, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys } = app
  const { msgCenterShow, msgNotice,chatMessage, contentValue } = message
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
      dispatch({ type: 'message/triggerMsgCenter' })
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

  const chatRoomProps = {
    message: chatMessage,
    onlineCount: 0,
    onSend (data) {
      dispatch({ type: 'message/sendMessage', payload: data })
    },
  }

  const msgCenterRadios = [
    { key: '1', value: '消息通知' },
    { key: '2', value: '讨论区' }
  ]

  const handleMsgRadioChange = (e) => {
    dispatch({
      type: 'message/showContent',
      payload: e.target.value
    })
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
            {
              /*消息中心*/
              <aside className={classnames(styles.chatsider, { [styles.chatshow]: msgCenterShow })}>
                <Row>
                  <Col span={24} style={{ textAlign: 'center', marginTop: 30 }}>
                    <RadioGroup defaultValue={contentValue} onChange={handleMsgRadioChange}>
                      {msgCenterRadios.map((item) => <RadioButton value={item.key}>{item.value}</RadioButton>)}
                    </RadioGroup>
                  </Col>
                </Row>
                <section
                  className={styles.msg_content} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    flexWrap: 'no-warp', 
                    overflow: 'hidden', 
                    position: 'relative', 
                    top: 30, 
                    left: isNavbar ? -100 * (contentValue - 1) + 'vw' : -400 * (contentValue - 1) + 'px' , 
                    width: isNavbar ? 100 * msgCenterRadios.length + 'vw' : 400 * msgCenterRadios.length + 'px'
                  }}
                >
                  <Comments className={styles.chatshow} dataSource={msgNotice} columns={[{title: '消息', dataIndex: 'msg'}]}/>
                  <CommonChatRoom className={styles.chatshow} {...chatRoomProps}/>
                </section>
              </aside>
            }
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

export default connect(({ app, message, loading }) => ({ app, message, loading }))(App)
