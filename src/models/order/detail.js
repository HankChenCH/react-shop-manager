import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { detailModel } from '../common'
import * as orderService from '../../services/order'

const { queryDetail } = orderService

export default modelExtend(detailModel, {

    namespace: 'orderDetail',

    state: {
        modalVisible: false,
        modalType: 'delivery',
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
                yield put({
                    type: 'querySuccess',
                    payload: {
                      data: res.data,
                    },
                })
                yield put({
                    type: 'order/updateState',
                    payload: {
                        currentItem: res.data
                    }
                })
            } else {
                throw res
            }
        }
    },

    reducers: {
        querySuccess (state, { payload }) {
            const { data } = payload
            return {
              ...state,
              data,
            }
        },

        showModal (state, { payload }) {
            const { modalType } = payload
            return {
                ...state,
                modalVisible: true,
                modalType,
            }
        },

        hideModal (state, { payload }) {
            return {
                ...state,
                modalVisible: false,
            }
        },
        
        clearData (state, { payload }) {
            return {
                ...state,
                data: {},
            }
        }
    }
})