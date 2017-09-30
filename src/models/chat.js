import modelExtend from 'dva-model-extend'
import { model } from './common'
import { config, hasProp } from '../utils'
const { prefix } = config

export default modelExtend(model, {

    namespace: 'chat',

    state: {
        chatRoomShow: false,
        chatMessage: [{from:'hank',data:'test'}],
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
        triggerChatRoom (state) {
            return {
                ...state,
                chatRoomShow: !state.chatRoomShow
            }
        }
    }
})