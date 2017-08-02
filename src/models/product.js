import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import * as productService from '../services/product'
import { pageModel } from './common'
import { config } from '../utils'

const { query, create, update, updateStockAndPrice, pullOnOff, remove } = productService
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'product',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/product') {
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
            list: res.data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: res.data.total,
            },
          },
        })
      }
    },

    *'delete' ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.product)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        message.success('删除商品成功')
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *'multiDelete' ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *update ({ payload }, { select, call, put }) {
      const id = yield select(({ product }) => product.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *pullItem ({ payload }, { put, call, select }) {
      const res = yield call(pullOnOff, { id: payload.id, is_on: payload.is_on ? '1' : '0' })
      if (res.success) {
        let list = yield select(({ product }) => product.list)
        let newList = list.map((item) => item.id === payload.id ? {...item, is_on: payload.is_on ? '1' : '0'} : item)
        // console.log(newList)
        yield put({ type: 'updateState', payload: {list: newList} })
        message.success((payload.is_on ? '上架' : '下架') + '成功')
      } else {
        throw res
      }
      
    },

    *multiOn ({ payload }, { put, call }) {

    },

    *multiOff ({ payload }, { put, call }) {

    },

    *updateCurrentItem ({ payload }, { put, call, select }){
      const currentItem = yield select(({ product }) => product.currentItem)
      const res = yield call(updateStockAndPrice, currentItem);
      if (res.success) {
        yield put({ type: 'updateState', payload: {currentItem: {}} })
        message.success('更新商品成功')
      } else {
        yield put({ type: 'query' })
        throw res
      }
    }

  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...{ payload }, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    chageCurrentItem (state, { payload }) {
      const { currentItem } = state
      return {...state, currentItem: Object.assign(currentItem, payload)}
    },
    
  },
})
