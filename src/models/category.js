import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import * as categoryService from '../services/category'
import * as productService from '../services/product'
import { pageModel } from './common'
import { config } from '../utils'

const { query, create, remove, update, batchRemove, queryProducts, updateProducts, removeAllProducts } = categoryService
const { queryAll } = productService
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

    *queryProduct ({ payload }, { call, put, select }) {
        const user = yield select(({ app }) => app.user)
        const res = yield call(queryAll, { ...payload, token: user.token })
        if (res.success) {
          let productList = res.data.map((item) => {return { key: item.id.toString(), title: item.name, main_img_url: item.main_img_url }})
          yield put({ type: 'updateState', payload: { productList: productList }})
        } else {
          throw res
        }
    },

    *'delete' ({ payload }, { call, put, select }) {
      const res = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.category)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        message.success('删除分类成功')
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *'multiDelete' ({ payload }, { call, put }) {
      const res = yield call(batchRemove, { ids: payload.ids.join(',') })
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        message.success('批量删除分类成功')
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *create ({ payload }, { call, put }) {
      const res = yield call(create, payload)
      if (res.success) {
        yield put({ type: 'hideModal' })
        message.success('创建分类成功')
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
        message.success('更新分类成功')
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *showProductManager ({ payload }, { put, call }) {
      const currentItem = payload.currentItem
      const res = yield call(queryProducts, {id: currentItem.id})
      if (res.success){
        let currentProductKeyList = res.data.map((item) => item.id.toString())
        yield put({ type: 'showManagerModal', payload: { currentProductKeyList: currentProductKeyList, currentItem: currentItem} })
        // yield put({ type: 'test', payload: { productList: productList } })
      } else {
        throw res
      }
    },

    *setProductList ({ payload }, { put, call, select}) {
      const id = yield select(({ category }) => category.currentItem.id)
      const res = payload.product_id === '' ? yield call(removeAllProducts, { id: id }) : yield call(updateProducts, {...payload, id: id})
      if (res.success) {
        yield put({ type: 'hideManagerModal' })
        message.success('更新商品列表成功')
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

    uploadImageSuccess (state, { payload }) {
      const { uploadTempItem } = state
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

  },
})
