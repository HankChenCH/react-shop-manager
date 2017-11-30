import modelExtend from 'dva-model-extend'
import * as resourceService from '../services/resource'
import { pageModel } from './common'
import { config, deleteProps } from '../utils'

const { query, create, update, remove, batchRemove } = resourceService

export default modelExtend(pageModel, {
  namespace: 'resource',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/setting/resource') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {

    *query ({ payload = {} }, { call, put }) {
      const res = yield call(query, payload)
      if (res.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: res.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: res.total,
            },
          },
        })
      }
    },

    *'delete' ({ payload }, { call, put, select }) {
      const res = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.category)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'app/messageSuccess', payload:"删除资源成功" })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },
    
    *'multiDelete' ({ payload }, { call, put }) {
      const res = yield call(batchRemove, { ids: payload.ids.join(',') })
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'app/messageSuccess', payload:"批量删除资源成功" })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *create ({ payload }, { call, put }) {
      const res = yield call(create, payload)
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/messageSuccess', payload:"创建资源成功" })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *update ({ payload }, { select, call, put }) {
      const id = yield select(({ menu }) => menu.currentItem.id)

      const res = yield call(update, { ...payload, id })
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/messageSuccess', payload:"更新资源成功" })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false, uploadTempItem: {} }
    },
  },
})