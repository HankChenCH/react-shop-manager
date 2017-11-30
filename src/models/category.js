import modelExtend from 'dva-model-extend'
import * as categoryService from '../services/category'
import * as ws from '../services/ws'
import { pageModel } from './common'
import { config, deleteProps } from '../utils'

const { query, create, remove, update, batchRemove, queryProducts, updateProducts, removeAllProducts } = categoryService
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'category',

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
        if (location.pathname === '/category') {
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

    *'delete' ({ payload }, { call, put, select }) {
      const res = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.category)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'app/messageSuccess', payload:"删除分类成功" })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },
    
    *'multiDelete' ({ payload }, { call, put }) {
      const res = yield call(batchRemove, { ids: payload.ids.join(',') })
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'app/messageSuccess', payload:"批量删除分类成功" })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *create ({ payload }, { call, put }) {
      const newCategory = { ...payload, topic_img_id: payload.topic_img.img_id }
      if (!deleteProps(newCategory, ['topic_img'])) {
        yield put({ type: 'app/messageError', payload:"更新失败" })
      }

      const res = yield call(create, newCategory)
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/messageSuccess', payload:"创建分类成功" })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *update ({ payload }, { select, call, put }) {

      const id = yield select(({ category }) => category.currentItem.id)
      const newCategory = { ...payload, id, topic_img_id: payload.topic_img.img_id }
      if (!deleteProps(newCategory, ['topic_img'])) {
        yield put({ type: 'app/messageError', payload:"更新失败" })
      }

      const res = yield call(update, newCategory)
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/messageSuccess', payload:"更新分类成功" })
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
      } else {
        throw res
      }
    },

    *setProductList ({ payload }, { put, call, select}) {
      const id = yield select(({ category }) => category.currentItem.id)
      const res = payload.product_id === '' ? yield call(removeAllProducts, { id: id }) : yield call(updateProducts, {...payload, id: id })
      if (res.success) {
        yield put({ type: 'hideManagerModal' })
        yield put({ type: 'app/messageSuccess', payload:"更新商品列表成功" })
        ws.trigger('weapp/category/syncProduct', { id: id })
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

    showManagerModal (state, { payload }){
      return { ...state, ...payload, managerModalVisible: true }
    },

    hideManagerModal (state) {
      return  { ...state, managerModalVisible: false, currentProductKeyList: [] }
    },

  },
})
