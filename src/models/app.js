import modelExtend from 'dva-model-extend'
import { query, queryProductAll, logout, reToken } from '../services/app'
import { model } from './common'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { config } from '../utils'
import { message } from 'antd'
const { prefix } = config

export default modelExtend(model, {
  namespace: 'app',
  state: {
    user: JSON.parse(localStorage.getItem(`${prefix}admin`)) || {},
    productAll: [],
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
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
          dispatch({ type: 'checkTokenExpire' })
          dispatch({ type: 'queryProduct' })
        }
      })
    },

  },
  effects: {

    // *query ({
    //   payload,
    // }, { call, put }) {
    //   // const data = yield call(query, parse(payload))
    //   // if (data.success && data.user) {
    //   //   yield put({
    //   //     type: 'registerUser',
    //   //     payload: data.user,
    //   //   })
    //   //   if (location.pathname === '/login') {
    //   //     yield put(routerRedux.push('/dashboard'))
    //   //   }
    //   // } else {
        
    //   // }
    // },
    *messageSuccess ({ payload }) {
      message.success(payload)
    },

    *queryProduct ({ payload }, { call, put, select }) {
        const { user, productAll } = yield select(({ app }) => app)
        if (productAll.length === 0) {
          const res = yield call(queryProductAll, { ...payload, token: user.token })
          if (res.success) {
            let productAll = res.data.map((item) => {return { key: item.id.toString(), title: item.name, main_img_url: item.main_img_url }})
            yield put({ type: 'updateState', payload: { productAll: productAll }})
          } else {
            throw res
          }
        }
    },

    *checkTokenExpire ({
      payload
    }, { put, select }) {
      const { user } = yield(select(_=>_.app))
      let nowTime = Date.parse(new Date()) / 1000;
      //票据为空代表没有登录，直接返回登录页面
      if (!user.hasOwnProperty("token")) {
        yield put({ type: 'logoutSuccess' })        
      }
      console.log(user.exprie_in,nowTime)
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
      const { user } = yield(select(_=>_.app))
      //以旧令牌换取新令牌
      const res = yield call(reToken, { token: user.token });
      if (res.success && res.data) {
        localStorage.setItem(`${prefix}admin`, JSON.stringify(res.data))
        yield put({ type: 'registerUser', payload: res.data })
      }
    },

    *logout ({
      payload,
    }, { call, put, select }) {
      const user = yield select(({ app }) => app.user)
      const res = yield call(logout, { token: user.token })
      if (res.success) {
        yield put({ type: 'messageSuccess', payload:"登出成功" })
        yield put({ type: 'logoutSuccess' })
      } else {
        yield put({ type: 'logoutSuccess' })
        throw (res)
      }
    },

    *logoutSuccess ({
      payload
    }, { put }) { 
      yield localStorage.removeItem(`${prefix}admin`)
      if (location.pathname !== '/login') {
        let from = location.pathname
        if (location.pathname === '/dashboard') {
          from = '/dashboard'
        }
        window.location = `${location.origin}/login?from=${from}`
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

  },
  reducers: {
    registerUser (state, { payload: user }) {
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
})