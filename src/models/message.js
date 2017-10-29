import modelExtend from 'dva-model-extend'
import { model } from './common'
import * as ws from '../services/ws.js'
import { config, hasProp } from '../utils'
const { prefix } = config

export default modelExtend(model, {

    namespace: 'message',

    state: {
        msgCenterShow: false,
        contentValue: localStorage.getItem(`${prefix}msgContentValue`) || '1',
        msgNotice: [],
        chatMessage: [],
    },

    subscriptions : {
    },

    effects: {
        *sendMessage({ payload }, { put, select }) {
            const { username } = yield select(({ app }) => app.user)
            const { chatMessage } = yield select((_) => _.message)
            payload = payload.replace(/\n/g, '<br />$&')
            chatMessage.push({data: payload, from: username})
            yield put({ type: 'updateState', payload: { chatMessage } })
            ws.sendMsg({ data: payload, from: username })
        },

        *addOrderNotice({ payload }, { put, select }) {
            const newNotice = `您有一笔新的订单等待处理，订单号：${payload.orderNo}`
            yield put({ type: 'addMsgNotice', payload: { msg: newNotice } })
        }
    },

    reducers: {
        triggerMsgCenter (state) {
            return {
                ...state,
                msgCenterShow: !state.msgCenterShow
            }
        },

        receiveMsg(state, { payload }) {
            return {
                ...state,
                chatMessage: state.chatMessage.concat({ data: payload.data, from: payload.from })
            }
        },

        addMsgNotice(state, { payload }) {
            const { msgNotice } = state
            msgNotice.unshift(payload)
            return {
                ...state,
                msgNotice: msgNotice
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