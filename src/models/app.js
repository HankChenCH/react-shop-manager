import modelExtend from 'dva-model-extend'
import { Base64 } from 'js-base64'
import { query, queryProductAll, logout, reToken } from '../services/app'
import { queryMy } from '../services/resource'
import * as ws from '../services/ws'
import { model } from './common'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { config, Enum } from '../utils'
import { message, notification, Icon } from 'antd'
const { prefix } = config
const { EnumAdminStatus, EnumResourceType } = Enum


export default modelExtend(model, {
  namespace: 'app',
  state: {
    user: {},
    userAuth: [],
    productAll: [],
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    notificationCount: 0,
    msgCenterRadios: [
      { key: '1', value: '消息通知', count: 0 },
      { key: '2', value: '讨论区', count: 0 }
    ],
    msgCenterShow: false,
    contentValue: localStorage.getItem(`${prefix}msgContentValue`) || '1',
  },
  subscriptions: {

    setup ({ dispatch, history }) {
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }

      
      history.listen(location => {
        if (location.pathname !== '/login') {
          dispatch({ type: 'checkUserInfo' })
          dispatch({ type: 'queryProduct' })
        }
      })

      document.onkeydown = function(e) {
        let keyCode = e.keyCode || e.which || e.charCode,
        ctrlKey = e.ctrlKey || e.metaKey, 
        altKey = e.altKey,
        shiftKey = e.shiftKey

        if(altKey && keyCode == 76) {
            dispatch({ type: 'lock' })
        }
      }
    },
  },
  effects: {
    *messageSuccess ({ payload }) {
      message.success(payload)
    },

    *messageError ({ payload }) {
      if (typeof payload === 'string'){
        message.error(payload)
      } else if (payload instanceof Object) {
        payload.msg && message.error(payload.msg)
      }
    },

    *globalNotice ({ payload }, { select }) {
      const { notificationOn } = yield select(({ websocket }) => websocket)
      if (notificationOn) {
        notification.open({
          message: payload.from,
          description: payload.data,
          icon: <Icon type="smile-circle" style={{ color: '#292929' }} />,
        });
      }
    },

    *queryProduct ({ payload }, { call, put, select }) {
        const { productAll } = yield select(({ app }) => app)
        if (productAll.length === 0 || payload.reload) {
          const res = yield call(queryProductAll, payload)
          if (res.success) {
            let productAll = res.data.map((item) => {return { key: item.id.toString(), title: item.name, main_img_url: item.main_img_url }})
            yield put({ type: 'updateState', payload: { productAll: productAll }})
          } else {
            throw res
          }
        }
    },

    *checkUserInfo({ payload }, { put, call, select }) {
      const { user } = yield (select(_ => _.app))

      if (!user.exprie_in) {
        const userLocal = yield JSON.parse(localStorage.getItem(`${prefix}admin`))
        yield put({ type: 'registerUser', payload: userLocal })
      } 

      yield put({ type: 'checkTokenExpire' })
      yield put({ type: 'fetchUserAuth' })
    },

    *fetchUserAuth({ payload }, { call, put, select }) {
      const { userAuth } = yield select(({ app }) => app)
      if (userAuth.length === 0 || payload.reload) {
        const res = yield call(queryMy);
        if (res.success) {
          const view = res.data[EnumResourceType.View] || []
          yield put({ type: 'injectUserAuth', payload: view })
        }
      }
    },

    *checkTokenExpire ({
      payload
    }, { put, select }) {
      const { user } = yield(select(_=>_.app))
      let nowTime = Date.parse(new Date()) / 1000;
      //过期时间为空或状态不是登录中代表没有登录，直接返回登录页面
      if (!user.exprie_in || user.status !== EnumAdminStatus.LOGIN) {
        yield put({ type: 'logoutSuccess' })        
      }
      //过期时间比现在相差小于10分钟就重新申请令牌
      if (user.exprie_in - nowTime < 600 && user.exprie_in - nowTime > 0) {
        yield put({ type: 'reToken' })
      }//过期时间比现在相差小于0，代表用户10分钟内没有操作，直接登录过期跳转出去登录页面重新登录
      else if (user.exprie_in - nowTime < 0) {
        yield put({ type: 'logoutSuccess' })
        //手动抛出错误提示给框架捕获
        throw {
          success: false,
          message: '登录失效，请重新登录！'
        }
      }
    },

    *reToken ({ 
      payload 
    }, { put, call, select }) {
      //以旧令牌换取新令牌
      const { user } = yield select((_) => _.app)
      const res = yield call(reToken, {});
      if (res.success && res.data) {
        yield localStorage.setItem(`${prefix}admin`, JSON.stringify({ ...res.data, login_name: user.login_name, status: user.status }))
        yield put({ type: 'registerUser', payload: res.data })
        yield put({ type: 'fetchUserAuth' })
      }
    },

    *lock({
      payload
    }, { put, select }) {
      if (location.pathname !== '/login') {
        yield put({ type: 'updateUserStatus', payload: EnumAdminStatus.LOCKED })
        yield put({ type: 'logoutSuccess', payload:"锁屏成功" })
      } else {
        yield put({ type: 'messageError', payload: '请不要在登录界面进行锁屏操作！' })
      }
    },
    
    *logout ({
      payload,
    }, { call, put, select }) {
      const { user } = yield select((_) => _.app)
      const res = yield call(logout, {})
      if (res.success) {
        yield put({ type: 'updateUserStatus', payload: EnumAdminStatus.LOGOUT })
        yield put({ type: 'logoutSuccess', payload:"登出成功" })
      } else {
        yield put({ type: 'logoutSuccess' })
      }
    },

    *logoutSuccess ({
      payload
    }, { put }) {
      if (payload) {
        yield put({ type: 'messageSuccess', payload: payload })
      }
      if (location.pathname !== '/login') {
        let from = location.pathname
        if (location.pathname === '/') {
          from = '/dashboard'
        }
        let search = location.search
        yield put(routerRedux.push(`/login?from=${from}${search}`))
      }
    },

    *changeNavbar ({
      payload,
    }, { put, select }) {
      const { app } = yield(select(_ => _))
      //当客户端宽度少于769认为是移动设备浏览，隐藏侧边菜单栏改用头部菜单
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

    *registerUser ({ payload }, { put }) {
      const tokenPayload = payload.token.split('.')[1]
      const userInfo = JSON.parse(Base64.decode(tokenPayload))
      const user = { 
        exprie_in: userInfo.exp, 
        login_name: payload.login_name, 
        status: payload.status,
        ...userInfo.user,        
      }
      yield put({ type: 'updateState', payload: { user } })
    },

    *addNoticeCount ({ payload }, { put, select }) {
      const { msgCenterShow, msgCenterRadios } = yield select((_) => _.app)
      if (!msgCenterShow) {
        yield put({ type: 'noticeCountInc' })
      }
      const newMsgCenterRadios = msgCenterRadios.map(item => {
        if (item.key === payload) {
          return {
            ...item,
            count: ++item.count,
          }
        } else {
          return item
        }
      })
      yield put({ type: 'updateState', payload: { msgCenterRadios: newMsgCenterRadios } })
    },

    *showMsgContent ({ payload }, { put, select }) {
      yield localStorage.setItem(`${prefix}msgContentValue`, payload)
      const { msgCenterRadios } = yield select((_) => _.app)
      const newMsgCenterRadios = msgCenterRadios.map(item => {
        if (item.key === payload) {
          return {
            ...item,
            count: 0,
          }
        } else {
          return item
        }
      })
      
      yield put({ type: 'updateState', payload: { msgCenterRadios: newMsgCenterRadios, contentValue: payload } })
    },
  },
  reducers: {
    switchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },

    noticeCountInc (state) {
      return { 
        ...state,
        notificationCount: ++state.notificationCount,
      }
    },

    clearNoticeCount (state) {
      return {
        ...state,
        notificationCount: 0,
      }
    },

    clearRadioCount (state, { payload }) {
      const { msgCenterRadios } = state
      msgCenterRadios[payload].count = 0
      return {
        ...state,
        msgCenterRadios
      }
    },

    updateUserStatus(state, { payload }) {
      const userLocal =  JSON.parse(localStorage.getItem(`${prefix}admin`))
      const newStorageUser = { ...userLocal, status: payload }
      localStorage.setItem(`${prefix}admin`, JSON.stringify(newStorageUser))

      const { user } = state
      const newModelUser = { ...user, status: payload }
      return {
        ...state,
        user: newModelUser
      }
    },

    clearUser(state) {
      localStorage.removeItem(`${prefix}admin`)
      return {
        ...state,
        user: {}
      }
    },

    triggerMsgCenter(state) {
      return {
        ...state,
        msgCenterShow: !state.msgCenterShow
      }
    },

    injectUserAuth(state, { payload }) {
      return {
        ...state,
        userAuth: payload
      }
    }

  },
})