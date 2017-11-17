import modelExtend from 'dva-model-extend'
import { model } from './common'
import * as ws from '../services/ws.js'
import { config, hasProp, Enum } from '../utils'
const { prefix } = config

const { EnumOrderStatus } = Enum

export default modelExtend(model, {

    namespace: 'message',

    state: {
        msgNotice: JSON.parse(localStorage.getItem(`${prefix}message`)) || [],
    },

    subscriptions : {
    },

    effects: {
        *addOrderNotice({ payload }, { put, select }) {
            const order_no = payload.orderInfo.order_no
            const newNotice = `您有一笔新的订单等待处理，订单号：${order_no}`
            const { msgNotice } = yield select((_) => _.message)
            msgNotice.unshift({ 
                msgKey: 'order' + payload.orderInfo.id,
                msg: newNotice, 
                type: 'order', 
                orderInfo: payload.orderInfo 
            })
            yield put({ 
                type: 'updateNotice',
                payload: {
                    msgNotice
                }
            })
            const { queryStatus } = yield select((_) => _.order)
            if (queryStatus === EnumOrderStatus.UNDELIVERY) {
                yield put({ type: 'order/reloadlist' })
            }
        },

        *removeNotice({ payload }, { put, select }) {
            const { msgNotice } = yield select((_) => _.message)
            const newMsgNotice = msgNotice.filter(item => item.msgKey !== payload)
            yield put({ type: 'app/clearRadioCount', payload: 0 })
            yield put({
                type: 'updateNotice',
                payload: {
                    msgNotice: newMsgNotice
                }
            })
        }
    },

    reducers: {
        updateNotice(state, { payload }) {
            localStorage.setItem(`${prefix}message`, JSON.stringify(payload.msgNotice))
            return {
                ...state,
                msgNotice: payload.msgNotice
            }
        }    
    }
})