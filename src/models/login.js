import { login } from '../services/login'
import { routerRedux } from 'dva/router'
import { queryURL, config } from '../utils'
const { prefix } = config

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
  },

  effects: {
    *login ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const res = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (res.success) {
        res.data.data.username = payload.username//由于api没有返回用户名暂时以这个代替
        localStorage.setItem(`${prefix}admin`, JSON.stringify(res.data.data))
        const from = queryURL('from')
        yield put({ type: 'app/query', payload: res.data.data })
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
