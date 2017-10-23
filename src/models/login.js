import { login } from '../services/login'
import { routerRedux } from 'dva/router'
import { queryURL, config, Enum } from '../utils'
const { prefix } = config
const { EnumAdminStatus } = Enum

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
  },

  effects: {
    *login ({
      payload,
    }, { put, call, select }) {
      const { user } = yield select((_) => _.app)
      yield put({ type: 'showLoginLoading' })
      if (user.status && user.status === EnumAdminStatus.LOCKED) {
        payload = { login_name: user.login_name, ...payload }
      }
      const res = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (res.success) {
        const admin = { ...res.data, login_name: payload.login_name, status: EnumAdminStatus.LOGIN }
        yield put({ type: 'app/messageSuccess', payload: '登录成功' })
        yield localStorage.setItem(`${prefix}admin`, JSON.stringify(admin))
        const from = queryURL('from')
        yield put({ type: 'app/registerUser', payload: admin })
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw res
      }
    },
  },
  reducers: {
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
  },
}
