import modelExtend from 'dva-model-extend'
import { query, queryMy, create, remove, update, batchRemove, allot } from '../services/group'
import * as ws from '../services/ws'
import { pageModel } from './common'
import { config } from '../utils'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'group',

  state: {
    currentItem: {},
    modalVisible: false,
    allotModalVisible: false,
    selectedRowKeys: [],
    modalType: 'create',
    myList: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/setting/group') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }

        dispatch({
          type: 'querySelf',
        })
      })
    },
  },

  effects: {

    *query ({ payload = {} }, { call, put }) {
      const res = yield call(query, payload)
      if (res.success) {
        const { data } = res
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    *querySelf({ payload }, { call, put, select }) {
      const res = yield call(queryMy)
      if (res.success) {
        const { data } = res
        yield put({
          type: 'updateState',
          payload: {
            myList: data
          }
        })
      } else {
        throw res
      }
    },

    *'delete' ({ payload }, { call, put, select }) {
      const res = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.group)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'app/messageSuccess', payload: '删除群组成功' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *'multiDelete' ({ payload }, { call, put }) {
      const res = yield call(batchRemove, payload)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'app/messageSuccess', payload: '删除群组成功' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *create ({ payload }, { call, put }) {
      const res = yield call(create, payload)
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/messageSuccess', payload: '创建群组成功' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *update ({ payload }, { select, call, put }) {
      const id = yield select(({ admin }) => admin.currentItem.id)
      const newAdmin = { ...payload, id }
      const res = yield call(update, newAdmin)
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/messageSuccess', payload: '更新群组成功' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *allot ({ payload }, { call, put, select }) {
      const { id } = yield select(({ group }) => group.currentItem)
      const res = yield call(allot, { ...payload, id })
      if (res.success) {
        yield put({ type: 'hideAllotModal' })
        yield put({ type: 'app/messageSuccess', payload: '授权成功' })
        ws.trigger('manager/admin/group_reload', { id })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    }
  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state,  ...payload , modalVisible: true }
    },

    showAllotModal (state, { payload }) {
      return { ...state, ...payload, allotModalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    hideAllotModal (state) {
      return { ...state, allotModalVisible: false }
    }

  },
})
