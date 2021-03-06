import modelExtend from 'dva-model-extend'
import { query, queryOne, queryMembers, create, remove, update, enableOrDisable, batchUpdate, batchRemove, auth } from '../services/admin'
import * as ws from '../services/ws'
import { pageModel } from './common'
import { config } from '../utils'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'admin',

  state: {
    currentItem: {},
    modalVisible: false,
    authModalVisible: false,
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

        if (location.pathname === '/setting/personal') {
          dispatch({ type: 'querySelf' })
        }

        if (location.pathname === '/setting/group') {
          dispatch({ type: 'queryAll' })
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
      } else {
        throw res
      }
    },

    *querySelf({ payload }, { call, put, select }) {
      const { uid } = yield select(({ app }) => app.user)
      const res = yield call(queryOne, { id: uid })
      if (res.success) {
        const { data } = res
        yield put({
          type: 'updateState',
          payload: {
            currentItem: data
          }
        })
      } else {
        throw res
      }
    },

    *queryAll({ payload }, { call, put }) {
      const res = yield call(queryMembers)
      if (res.success) {
        const { data } = res
        yield put({
          type: 'updateState',
          payload: {
            list: data
          }
        })
      }
    },

    *'delete' ({ payload }, { call, put, select }) {
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
      const res = yield call(batchRemove, payload)
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
        yield put({ type: 'app/messageSuccess', payload: '创建信息成功' })
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
        yield put({ type: 'app/messageSuccess', payload: '更新信息成功' })
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
        const message = "管理员" + (res.state === '1' ? '启用' : '禁用') + '成功'
        yield put({ type: 'app/messageSuccess', payload: message })
      } else {
        throw res
      }
    },

    *multiUpdateStatus ({ payload }, { call, put, select }) {
      const { list, selectedRowKeys } = yield select(({ admin }) => admin)
      const res = yield call(batchUpdate, { ids: payload.ids.join(','), state: payload.state })
      if (res.success) {
        let newList = list.map(item => { 
          if(selectedRowKeys.indexOf(item.id) !== -1){
            return { ...item, state: res.data.state }
          }

          return item
        })
        yield put({ type: 'updateState', payload: { list: newList, selectedRowKeys: [] } })
        yield put({ type: 'app/messageSuccess', payload: '批量' + (res.data.state === '1' ? '启' : '禁') + '用成功' })
      } else {
        yield put({ type: 'query' })
        throw res
      }
    },

    *auth ({ payload }, { call, put, select }) {
      const { id } = yield select(({ admin }) => admin.currentItem)
      const res = yield call(auth, { ...payload, id })
      if (res.success) {
        yield put({ type: 'hideAuthModal' })
        yield put({ type: 'app/messageSuccess', payload: '授权成功' })
        ws.trigger('manager/admin/permission_reload', { id })
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

    showAuthModal (state, { payload }) {
      return { ...state, ...payload, authModalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    hideAuthModal (state) {
      return { ...state, authModalVisible: false }
    }

  },
})
