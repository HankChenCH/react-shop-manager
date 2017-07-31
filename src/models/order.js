import modelExtend from 'dva-model-extend'
import { query } from '../services/order'
import { pageModel } from './common'

export default modelExtend(pageModel, {

  namespace: 'order',

  state: {
    currentItem: {},
    tempItem: {},
    modalVisible: false,
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/order') {
          dispatch({ type: 'query', payload: {
            status: 2,
            ...location.query,
          } })
        }
      })
    },
  },

  effects: {
    *query ({
      payload = {},
    }, { call, put }) {
      const res = yield call(query, payload)
      if (res.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: res.data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: res.data.total,
            },
          },
        })
      } else {
        throw res
      }
    },
  },

})
