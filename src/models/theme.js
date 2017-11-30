import modelExtend from 'dva-model-extend'
import * as themeService from '../services/theme'
import * as ws from '../services/ws'
import { pageModel } from './common'
import { config, deleteProps } from '../utils'

const { query, create, remove, update, batchRemove, queryProducts, updateProducts, removeAllProducts, pullOnOff, setRank } = themeService
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
    layoutVisible: false,
    layoutList: [],
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

    *query ({ payload = {} }, { call, put }) {
      const res = yield call(query, payload)
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
      const res = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.theme)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'app/messageSuccess', payload:"删除主题成功" })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *'multiDelete' ({ payload }, { call, put }) {
      const res = yield call(batchRemove, { ids: payload.ids.join(',') })
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        message.success('批量删除主题成功')
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *create ({ payload }, { call, put }) {
      const newTheme = { ...payload, head_img_id: payload.head_img.img_id }
      if (!deleteProps(newTheme, ['head_img'])) {
        yield put({ type: 'app/messageError', payload:"创建主题失败" })
      }

      const res = yield call(create, newTheme)
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/messageSuccess', payload:"创建主题成功" })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    *update ({ payload }, { select, call, put }) {
      const id = yield select(({ theme }) => theme.currentItem.id)
      const newTheme = { ...payload, id, head_img_id: payload.head_img.img_id }
      if (!deleteProps(newTheme, ['head_img'])) {
        yield put({ type: 'app/messageError', payload:"更新主题失败" })
      }

      const res = yield call(update, newTheme)
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
      } else {
        throw res
      }
    },

    *setProductList ({ payload }, { put, call, select}) {
      const id = yield select(({ theme }) => theme.currentItem.id)
      const res = payload.product_id === '' ? yield call(removeAllProducts, { id: id }) : yield call(updateProducts, {...payload, id: id })
      if (res.success) {
        yield put({ type: 'hideManagerModal' })
        yield put({ type: 'app/messageSuccess', payload:"更新商品列表成功" })
        ws.trigger('weapp/theme/syncProduct', { id: id })
      } else {
        throw res
      }
    },

    *pullItem ({ payload }, { put, call, select }) {
      const res = yield call(pullOnOff, { id: payload.id, is_on: payload.is_on ? '1' : '0' })
      if (res.success) {
        let list = yield select(({ theme }) => theme.list)
        let newList = list.map((item) => item.id === payload.id ? {...item, is_on: payload.is_on ? '1' : '0'} : item)
        yield put({ type: 'updateState', payload: { list: newList } })
        yield put({ type: 'app/messageSuccess', payload: (payload.is_on ? '推荐精选' : '取消精选') + '成功' })
        ws.trigger('weapp/theme/syncRank')
      } else {
        throw res
      }
    },
    
    *syncRank ({ payload }, { put, call, select }) {
      const { layoutList } = yield select(({ theme }) => theme)
      const ranks = layoutList.map((item, idx) => {
        return {
          id: item.id,
          rank: idx + 1
        }
      })
      const res = yield call(setRank, { ranks })
      if (res.success) {
        yield put({ type: 'hideLayout' })
        yield put({ type: 'app/messageSuccess', payload: "更新排序成功" })
        yield put({ type: 'query' })
        ws.trigger('weapp/theme/syncRank')
      } else {
        yield put({ type: 'hideLayout' })
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

    showLayout (state) {
      return {
        ...state,
        layoutVisible: true,
        layoutList: state.list.filter((item) => item.is_on === '1').sort((a,b) => a.rank - b.rank)
      }
    },

    hideLayout (state) {
      return {
        ...state,
        layoutVisible: false,
        layoutList: [],
      }
    }

  },
})
