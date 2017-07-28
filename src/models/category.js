import modelExtend from 'dva-model-extend'
import * as categoryService from '../services/category'
import { pageModel } from './common'
import { config } from '../utils'

const { query, create, remove, update, queryProductByCategory, updateProductByCategory } = categoryService
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'category',

  state: {
    currentItem: {},
    uploadTempItem: {},
    tempItem: {},
    productList: [],
    currentProductKeyList: [],
    modalVisible: false,
    managerModalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/category') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
          dispatch({ type: 'queryProduct' })
        }
      })
    },
  },

  effects: {

    *query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
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

    *queryProduct ({ payload }, { call, put }) {
        // let productList = res.data.map((item) => {return { key: item.id.toString(), title: item.name }})
    },

    *'delete' ({ payload }, { call, put, select }) {
      const res = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *'multiDelete' ({ payload }, { call, put }) {
      const res = yield call(categoryService.remove, payload)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
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
      const id = yield select(({ category }) => category.currentItem.id)
      const newCategory = { ...payload, id }
      const res = yield call(update, newCategory)
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *uploadSuccess ({ payload }, { put }) {
        yield put({ type: 'uploadImageSuccess', payload })
    },

    *showProductManager ({ payload }, { put, call }) {
      const currentItem = payload.currentItem
      const res = yield call(queryProductByCategory, {id: currentItem.id})
      if (res.success){
        let currentProductKeyList = res.data.map((item) => item.id.toString())
        let productList = res.data.map((item) => {return { key: item.id.toString(), title: item.name, main_img_url: item.main_img_url }})
        yield put({ type: 'showManagerModal', payload: { currentProductKeyList: currentProductKeyList, currentItem: currentItem} })
        yield put({ type: 'test', payload: { productList: productList } })
      } else {
        throw res
      }
    },

    *setProductList ({ payload }, { put, call, select}) {
      const id = yield select(({ category }) => category.currentItem.id)
      const res = yield call(updateProductByCategory, {...payload, id: id})
    },

  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false, uploadTempItem: {} }
    },

    uploadImageSuccess (state, { payload }) {
      uploadTempItem.topic_img_id = payload.id
      uploadTempItem.img_url = payload.url
      return {...state,uploadTempItem: uploadTempItem}
    },

    showManagerModal (state, { payload }){
      return { ...state, ...payload, managerModalVisible: true }
    },

    hideManagerModal (state) {
      return  { ...state, managerModalVisible: false, currentProductKeyList: [] }
    },

    test (state, { payload }) {
      return { ...state, ...payload }
    }

  },
})
