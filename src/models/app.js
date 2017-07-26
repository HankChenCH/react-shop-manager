import { query, logout, reToken } from '../services/app'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { config } from '../utils'
const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: JSON.parse(localStorage.getItem(`${prefix}admin`)) || {},
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
  },
  subscriptions: {

    setup ({ dispatch }) {
      dispatch({ type: 'checkTokenExpire' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {

    *query ({
      payload,
    }, { call, put }) {
      const data = yield call(query, parse(payload))
      if (data.success && data.user) {
        yield put({
          type: 'querySuccess',
          payload: data.user,
        })
        if (location.pathname === '/login') {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        if (location.pathname !== '/login') {
          let from = location.pathname
          if (location.pathname === '/dashboard') {
            from = '/dashboard'
          }
          window.location = `${location.origin}/login?from=${from}`
        }
      }
    },

    *logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw (data)
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

    *checkTokenExpire ({
      payload
    }, { put, select }) {
      const { user } = yield(select(_=>_.app))
      let nowTime = Date.parse(new Date()) / 1000;
      //过期时间比现在相差小于10分钟就重新申请令牌
      if (user.exprie_in - nowTime < 6000000 && user.exprie_in - nowTime > 0) {
        yield put({ type: 'reToken' })
      }//过期时间比现在相差小于0，代表用户很久没有操作，直接登录过期跳转出去登录页面重新登录
      else if (user.exprie_in - nowTime < 0) {
        yield put({ type: 'logout'  })
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
      const { user } = yield(select(_=>_.app))
      //以旧令牌换取新令牌
      const data = yield call(reToken, user.token);
      if (data.success && data.user) {
        yield put({ type: 'querySuccess', payload: data.user })
      }
    }

  },
  reducers: {
    querySuccess (state, { payload: user }) {
      return {
        ...state,
        user,
      }
    },

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
  },
}
