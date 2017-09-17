import modelExtend from 'dva-model-extend'
import * as orderService from '../services/order'
import { pageModel } from './common'

const { query, changePrice, deliveryGoods, remove, batchRemove } = orderService

export default modelExtend(pageModel, {

  namespace: 'order',

  state: {
    queryStatus: '1',
    currentItem: {},
    tempItem: {},
    priceModalVisible: false,
    deliveryModalVisible: false,
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/order') {
          dispatch({ type: 'query', payload: {
            status: 1,
            ...location.query,
          } })

          dispatch({ type: 'updateQueryStatus', payload: {
            queryStatus: location.query.status || '1'
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
        yield put({
          type: 'updateState',
          payload: {
            list: [], 
          }
        })
        throw res
      }
    },

    *updateQueryStatus ({ payload }, { select, put }){
      const { queryStatus } = yield select(_ => _.order)
      if (queryStatus !== payload.queryStatus) {
        yield put({ type: 'updateState', payload: payload })
      }
    },

    *'delete' ({ payload }, { call, put, select }) {
      const res = yield call(remove, { id: payload })
      const { selectedRowKeys, pagination, queryStatus } = yield select(_ => _.order)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'app/messageSuccess', payload:"删除订单成功" })
        yield put({ type: 'query', payload: { status: queryStatus, page: pagination.current, pageSize: pagination.pageSize } })
      } else {
        throw res
      }
    },

    *'multiDelete' ({ payload }, { call, put, select }) {
      const { pagination, queryStatus } = yield select(_ => _.order)
      const res = yield call(batchRemove, { ids: payload.ids.join(',') })
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'app/messageSuccess', payload:"删除订单成功" })
        yield put({ type: 'query', payload: { status: queryStatus, page: pagination.current, pageSize: pagination.pageSize } })
      } else {
        throw res
      }
    },

    *updatePrice ({ payload }, { put, call, select }) {
      const user = yield select(({ app }) => app.user)
      const { currentItem, pagination, queryStatus } = yield select(_ => _.order)
      const res = yield call(changePrice, { id: currentItem.id, token: user.token, ...payload })
      if (res.success) {
        console.log(queryStatus)
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/messageSuccess', payload:"订单修改价格成功" })
        yield put({ type: 'query', payload: { status: queryStatus, page: pagination.current, pageSize: pagination.pageSize } })
      } else {
        throw res
      }
    },

    *deliveryItem ({ payload }, { put, call, select }) {
      const user = yield select(({ app }) => app.user)
      const { currentItem, pagination, queryStatus } = yield select(_ => _.order)
      console.log(payload)
      const res = yield call(deliveryGoods, { id: currentItem.id, token: user.token, ...payload })
      if (res.success) {
        console.log(queryStatus)
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/messageSuccess', payload:"订单发货成功" })
        yield put({ type: 'query', payload: { status: queryStatus, page: pagination.current, pageSize: pagination.pageSize } })
      } else {
        throw res
      }
    }

  },

  reducers: {
    showPriceModal (state, { payload }) {
      return { ...state, ...payload, priceModalVisible: true }
    },

    showDeliveryModal (state, { payload }) {
      return { ...state, ...payload, deliveryModalVisible: true }
    },

    hideModal (state) {
      return { 
        ...state, 
        currentItem: {}, 
        priceModalVisible: false,
        deliveryModalVisible: false
      }
    },
  },

})
