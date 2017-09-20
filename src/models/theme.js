import modelExtend from 'dva-model-extend'
import * as themeService from '../services/theme'
import * as productService from '../services/product'
import { pageModel } from './common'
import { config } from '../utils'

const { query, create, remove, update, batchRemove, queryProducts, updateProducts, removeAllProducts } = themeService
const { queryAll } = productService
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'theme',

  state: {
    currentItem: {},
    currentProductKeyList: [],
    modalVisible: false,
    managerModalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/theme') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {

    *query ({ payload = {} }, { call, put, select }) {
      const { token } = yield select(({ app }) => app.user)
      const res = yield call(query, { ...payload, token: token })
      if (res) {
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
      const { token } = yield select(({ app }) => app.user)
      const res = yield call(remove, { id: payload, token: token })
      const { selectedRowKeys } = yield select(_ => _.theme)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'app/messageSuccess', payload:"删除主题成功" })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *'multiDelete' ({ payload }, { call, put, select }) {
      const { token } = yield select(({ app }) => app.user)
      const res = yield call(batchRemove, { ids: payload.ids.join(','), token: token })
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        message.success('批量删除主题成功')
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *create ({ payload }, { call, put, select }) {
      const { token } = yield select(({ app }) => app.user)
      const newTheme = { ...payload, head_img_id: payload.head_img.img_id }
      delete newTheme.head_img
      const res = yield call(create, { ...newTheme, token: token })
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/messageSuccess', payload:"创建主题成功" })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *update ({ payload }, { select, call, put }) {
      const { token } = yield select(({ app }) => app.user)
      const id = yield select(({ theme }) => theme.currentItem.id)
      const newTheme = { ...payload, id, head_img_id: payload.head_img.img_id }
      delete newTheme.head_img
      const res = yield call(update, { ...newTheme, token: token })
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/messageSuccess', payload:"更新主题成功" })
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
      const { token } = yield select(({ app }) => app.user)
      const id = yield select(({ theme }) => theme.currentItem.id)
      const res = payload.product_id === '' ? yield call(removeAllProducts, { id: id, token: token }) : yield call(updateProducts, {...payload, id: id, token: token })
      if (res.success) {
        yield put({ type: 'hideManagerModal' })
        yield put({ type: 'app/messageSuccess', payload:"更新商品列表成功" })
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
