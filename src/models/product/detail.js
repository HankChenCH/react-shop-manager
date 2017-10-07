import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { pageModel } from '../common'
import { routerRedux } from 'dva/router'
import { queryDetail, update, updateDetail, updateParams, oneSales, createBuyNow, queryBuyNow, removeBuyNow } from '../../services/product'
import { deleteProps } from '../../utils'

export default modelExtend(pageModel, {

  namespace: 'productDetail',

  state: {
    data: {},
    modalType: 'base',
    modalVisible: false,
    prevProduct: {},
    nextProduct: {},
    productSales: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/product/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
          dispatch({ type: 'queryBuyNow', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    *query ({
      payload,
    }, { call, put }) {
      const res = yield call(queryDetail, payload)
      if (res.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: res.data,
          },
        })
        yield put({ type: 'queryPageProduct' })
        yield put({ type: 'querySales' })
      } else {
        yield put({ type: 'backList' })
        throw data
      }
    },

    *queryBuyNow ({ payload }, { put, call }) {
      const res = yield call(queryBuyNow, payload)
      if (res.success) {
        yield put({ 
          type: 'updateState', 
          payload: { 
            list: res.data, 
            current: Number(payload.page) || 1,
            pageSize: Number(payload.pageSize) || 10,
            total: res.data.total, 
          } 
        })
      }
    },

    *queryPageProduct ({ payload }, { put, select }) {
      const { data } = yield select((_) => _.productDetail)
      const { productAll } = yield select((_) => _.app)
      const prevProduct = {}
      const nextProduct = {}
      
      for (let i=0;i<productAll.length;i++) {
        if (productAll[i].key === data.id.toString()) {

          if (i > 0) {
            prevProduct.id = parseInt(productAll[i-1].key)
            prevProduct.name = productAll[i-1].title
          }

          if (i < productAll.length) {
            nextProduct.id = parseInt(productAll[i+1].key)
            nextProduct.name = productAll[i+1].title
          }
        }
      }

      yield put({ type: 'updateState', payload: { prevProduct, nextProduct } })
    },

    *querySales ({ payload }, { put, call, select }) {
      const { data } = yield select((_) => _.productDetail)
      const res = yield call(oneSales, { countMonth: 6, id: data.id })
      if (res.success) {
        const sales = res.data.map((item) => { return { "销售额": parseFloat(item.month_sales), "销售量": parseInt(item.month_counts), date: item.count_date } })
        yield put({ type: 'updateState', payload: { productSales: sales } })
      } else {
        throw res
      }
    },

    *locateTo ({ payload }, { put }) {
      yield put(routerRedux.push(`/product/${payload}`))
      yield put({ type: 'clearData' })
    },

    *backList ({ payload }, { put, select }) {
      const { pagination } = yield select((_) => _.product)
      yield put(routerRedux.push(`/product?page=${pagination.current || 1}&pageSize=${pagination.pageSize || 10}`))
      yield put({ type: 'clearData' })
    },

    *update ({ payload }, { put, call, select }) {
      const { data, modalType } = yield select((_) => _.productDetail)
      let newProduct = {}
      
      switch (modalType){
        case 'base':
          newProduct = Object.assign(payload.data, { ...payload.data.img, id: data.id })
          if (!deleteProps(newProduct, ['img'])) {
            yield put({ type: 'app/messageError', payload: "更新商品基础信息失败" })
          }
          yield put({ type: 'updateBase', payload: newProduct })
          break;
        case 'detail':
          newProduct = { ...payload.data, id: data.id }
          yield put({ type: 'updateDetail', payload: newProduct })
          break;
        case 'params':
          newProduct = { properties: payload.data, id: data.id }
          yield put({ type: 'updateParams', payload: newProduct })
          break;
        case 'buyNow':
          const newBuyNow = { 
            ...payload.data, 
            start_time: Math.ceil(payload.data.buynow_time[0].valueOf() / 1000), 
            end_time: Math.ceil(payload.data.buynow_time[1].valueOf() / 1000) 
          }
          if (!deleteProps(newBuyNow, ['buynow_time'])) {
            yield put({ type: 'app/messageError', payload: "开启秒杀失败" })
          }
          newProduct = { ...newBuyNow, id: data.id }
          yield put({ type: 'updateBuyNow', payload: newProduct })
          break;
      }

        yield put({ type: 'hideModal' })
    },

    *pullOn ({ payload }, { put, select }) {
      const { data } = yield select((_) => _.productDetail)
      yield put({ type: 'updateBase', payload: { ...data, is_on: '1' } })
    },

    *updateBase ({ payload }, { put, call }) {
      const res = yield call(update, payload)
      
      if (res.success) {
        yield put({ type: 'query', payload: { id: payload.id }})
        yield put({ type: 'app/messageSuccess', payload:"更新商品基础信息成功" })
      } else {
        throw res
      }
    },

    *updateDetail({ payload }, { put, call }) {
      const res = yield call(updateDetail, payload)
      
      if (res.success) {
        yield put({ type: 'query', payload: { id: payload.id }})
        yield put({ type: 'app/messageSuccess', payload:"更新商品基础信息成功" })
      } else {
        throw res
      }
    },

    *updateParams ({ payload }, { put, call }) {
      const res = yield call(updateParams, payload)
      
      if (res.success) {
        yield put({ type: 'query', payload: { id: payload.id }})
        yield put({ type: 'app/messageSuccess', payload:"更新商品基础信息成功" })
      } else {
        throw res
      }
    },

    *updateBuyNow ({ payload }, { put, call, select }) {
      const { data } = yield select((_) => _.productDetail)
      const res = yield call(createBuyNow, payload)

      if (res.success) {
        yield put({ type: 'queryBuyNow', payload: { id: data.id }})
        yield put({ type: 'app/messageSuccess', payload:"开启秒杀成功" })
      } else {
        throw res
      }
    },

    *deleteBuyNow ({ payload }, { put, call, select }) {
      const { data } = yield select((_) => _.productDetail)
      const res = yield call(removeBuyNow, { id: data.id, bid: payload })

      if (res.success) {
        yield put({ type: 'queryBuyNow', payload: { id: data.id }})
        yield put({ type: 'app/messageSuccess', payload:"删除秒杀成功" })
      } else {
        throw res
      }
    }
  },

  reducers: {
    clearData (state) {
      return {
        ...state,
        data: {},
        sales: [],
        list: [],
        pagination: {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条记录`,
          current: 1,
          total: 0,
        },
        prevProduct: {},
        nextProduct: {},
      }
    },

    showModal(state, { payload }) {
      return {
        ...state,
        modalVisible: true,
        ...payload,
      }
    },

    hideModal(state) {
      return {
        ...state,
        modalVisible: false,
      }
    },

    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
      }
    },
  },
})