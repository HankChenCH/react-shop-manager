import modelExtend from 'dva-model-extend'
import { model } from './common'
import * as ws from '../services/ws.js'
import { config, hasProp } from '../utils'
const { prefix } = config

export default modelExtend(model, {

    namespace: 'message',

    state: {
        msgCenterRadios: [
            { key: '1', value: '消息通知' },
            { key: '2', value: '讨论区' }
        ],
        msgCenterShow: false,
        contentValue: localStorage.getItem(`${prefix}msgContentValue`) || '1',
        msgNotice: [],
    },

    subscriptions : {
    },

    effects: {

        *addOrderNotice({ payload }, { put, select }) {
            // console.log(payload)
            const order_no = payload.orderInfo.order_no
            // console.log(payload)
            const newNotice = `您有一笔新的订单等待处理，订单号：${order_no}`
            const { msgNotice } = yield select((_) => _.message)
            msgNotice.unshift({ 
                msgKey: 'order' + payload.orderInfo.id,
                msg: newNotice, 
                type: 'order', 
                orderInfo: payload.orderInfo 
            })
            yield put({ 
                type: 'updateState',
                payload:  { msgNotice }
            })
        }
    },

    reducers: {
        triggerMsgCenter (state) {
            return {
                ...state,
                msgCenterShow: !state.msgCenterShow
            }
        },

        showContent (state, { payload }) {
            localStorage.setItem(`${prefix}msgContentValue`, payload)
            return {
                ...state,
                contentValue: payload
            }
        }
    }
})