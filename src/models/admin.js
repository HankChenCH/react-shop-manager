import modelExtend from 'dva-model-extend'
import { query, create, remove, update, enableOrDisable } from '../services/admin'
import { pageModel } from './common'
import { config } from '../utils'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'admin',

  state: {
    currentItem: {},
    modalVisible: false,
    selectedRowKeys: [],
    modalType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/setting/admin') {
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

    *'delete' ({ payload }, { call, put, select }) {
      console.log(payload)
      const res = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.admin)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'app/messageSuccess', payload: '删除管理员成功' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *'multiDelete' ({ payload }, { call, put }) {
      const res = yield call(adminsService.remove, payload)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'app/messageSuccess', payload: '删除管理员成功' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *create ({ payload }, { call, put }) {
      const res = yield call(create, payload)
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *update ({ payload }, { select, call, put }) {
      const id = yield select(({ admin }) => admin.currentItem.id)
      const newAdmin = { ...payload, id }
      const res = yield call(update, newUser)
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *updateStatus({ payload }, { put, call, select }) {
      const { list } = yield select(_ => _.admin)
      const res = yield call(enableOrDisable, payload)
      if (res.success) {
        const newList = list.map(item => { 

          if(item.id === payload.id){ 
            item.state =  payload.state.toString()
          }

          return item 
        })
        yield put({ type: 'updateState', payload: { list: newList } })
        const message = "管理员" + (res.state ? '启用' : '禁用') + '成功'
        yield put({ type: 'app/messageSuccess', payload: message })
      } else {
        throw res
      }
    }
  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state,  ...payload , modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
})
