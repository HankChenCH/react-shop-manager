import pathToRegexp from 'path-to-regexp'
import { queryDetail } from '../../services/product'

export default {

  namespace: 'productDetail',

  state: {
    data: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/product/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    *query ({
      payload,
    }, { call, put }) {
      const res = yield call(queryDetail, payload)
      if (res.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: res.data,
          },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
      }
    },
  },
}
