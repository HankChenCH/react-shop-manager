import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { queryObjToString } from '../utils'

const model = {
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

const pageModel = modelExtend(model, {

  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条记录`,
      current: 1,
      total: 0,
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { list, pagination } = payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
  },

})

const detailModel = modelExtend(pageModel, {
  
  state: {
    data: {}
  },

  effects: {
    *backList ({ payload }, { put, select }) {
      const { pagination } = yield select((_) => _[payload.model])
      const urlQuery = payload.query ? '&' + queryObjToString(payload.query) : ''
      yield put(routerRedux.push(`/${payload.url}?page=${pagination.current || 1}&pageSize=${pagination.pageSize || 10}${urlQuery}`))
      yield put({ type: 'clearData' })
    },
  }
})


module.exports = {
  model,
  pageModel,
  detailModel,
}
