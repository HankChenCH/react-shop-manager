import modelExtend from 'dva-model-extend'
import * as orderService from '../services/order'
import { pageModel } from './common'
import { Enum } from '../utils'

const { query, changePrice, deliveryGoods, remove, batchRemove, batchClose, issueGoods } = orderService
const { EnumOrderStatus } = Enum

export default modelExtend(pageModel, {

  namespace: 'order',

  state: {
    queryStatus: EnumOrderStatus.UNPAY,
    currentItem: {},
    tempItem: {},
    modalType: 'price',
    modalVisible: false,
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

          dispatch({ type: 'express/query' })
        }
      })

      setInterval(() => {
        dispatch({
          type: 'reloadList'
        })
      }, 600000)
    },
  },

  effects: {
    *query ({
      payload = {},
    }, { call, put }) {
      const res = yield call(query, { ...payload })
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

    *reloadList ({ payload }, { put, select }) {
      const { queryStatus, pagination } = yield select((_) => _.order)
      if (queryStatus === EnumOrderStatus.UNPAY) {
        yield put({ type: 'query', payload: { page: pagination.current, pageSize: pagination.pageSize } })
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

    *priceItem ({ payload }, { put, call, select }) {
      const { currentItem, pagination, queryStatus } = yield select(_ => _.order)
      const res = yield call(changePrice, { id: currentItem.id, ...payload })
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/messageSuccess', payload:"订单修改价格成功" })
        yield put({ type: 'query', payload: { status: queryStatus, page: pagination.current, pageSize: pagination.pageSize } })
      } else {
        throw res
      }
    },

    *deliveryItem ({ payload }, { put, call, select }) {
      console.log(payload)
      const { currentItem, pagination, queryStatus } = yield select(_ => _.order)
      const res = yield call(deliveryGoods, { id: currentItem.id , ...payload })
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'orderDetail/hideModal' })
        yield put({ type: 'app/messageSuccess', payload:"订单发货成功" })
        yield put({ type: 'query', payload: { status: queryStatus, page: pagination.current, pageSize: pagination.pageSize } })
      } else {
        throw res
      }
    },

    *issueItem ({ payload }, { put, call, select }) {
      const { currentItem, pagination, queryStatus } = yield select(_ => _.order)
      const res = yield call(issueGoods, { id: currentItem.id, tickets: payload })
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'orderDetail/hideModal' })
        yield put({ type: 'app/messageSuccess', payload:"订单出票成功" })
        yield put({ type: 'query', payload: { status: queryStatus, page: pagination.current, pageSize: pagination.pageSize } })
      } else {
        throw res
      }
    },

    *close ({ payload }, { put, call, select }) {
      console.log(payload)
      const { selectedRowKeys, pagination, queryStatus } = yield select(_ => _.order)
      const res = yield call(batchClose, { ids: payload })
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'app/messageSuccess', payload:"关闭订单成功" })
        yield put({ type: 'query', payload: { status: queryStatus, page: pagination.current, pageSize: pagination.pageSize } })
      } else {
        throw res
      }
    },

    *multiClose ({ payload }, { put, call, select }) {
      const { pagination, queryStatus } = yield select(_ => _.order)
      const res = yield call(batchClose, { ids: payload.ids.join(',') })
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'app/messageSuccess', payload:"关闭订单成功" })
        yield put({ type: 'query', payload: { status: queryStatus, page: pagination.current, pageSize: pagination.pageSize } })
      } else {
        throw res
      }
    },

  },

  reducers: {
    showPriceModal (state, { payload }) {
      return { ...state, ...payload, priceModalVisible: true }
    },

    showDeliveryModal (state, { payload }) {
      return { ...state, ...payload, deliveryModalVisible: true }
    },

    showModal (state, { payload }) {
      return {
        ...state,
        ...payload,
        modalVisible: true,
      }
    },

    hideModal (state) {
      return { 
        ...state, 
        currentItem: {}, 
        priceModalVisible: false,
        deliveryModalVisible: false,
        modalVisible: false,
      }
    },
  },

})
