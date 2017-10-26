import modelExtend from 'dva-model-extend'
import { model } from './common'
import { config, hasProp } from '../utils'
const { prefix } = config

export default modelExtend(model, {

    namespace: 'message',

    state: {
        msgCenterShow: false,
        contentValue: localStorage.getItem(`${prefix}msgContentValue`) || '1',
        chatMessage: [],
    },

    subscriptions : {
    },

    effects: {
        *sendMessage({ payload }, { put, select }) {
            const { username } = yield select(({ app }) => app.user)
            const { chatMessage } = yield select((_) => _.chat)
            payload = payload.replace(/\n/g, '<br />$&')
            chatMessage.push({data: payload, from: username})
            yield put({ type: 'updateState', payload: { chatMessage } })
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