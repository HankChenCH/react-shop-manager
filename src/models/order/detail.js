import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { model } from '../common'
import * as orderService from '../../services/order'

const { queryDetail } = orderService

export default modelExtend(model, {

    namespace: 'orderDetail',

    state: {
        data: {},
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(() => {
                const match = pathToRegexp('/order/:id').exec(location.pathname)
                if (match) {
                  dispatch({ type: 'query', payload: { id: match[1] } })
                }
            })
        },
    },

    effects: {
        *query({ payload }, { put, call }) {
            const res = yield call(queryDetail, payload)
            if (res.success) {
                yield put({ type: 'updateState', payload: { data: res.data } })
            } else {
                throw res
            }
        }
    },

    reducers: {

    }
})