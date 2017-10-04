import modelExtend from 'dva-model-extend'
import { model } from './common'
import { config, hasProp } from '../utils'
const { prefix } = config

export default modelExtend(model, {

    namespace: 'chat',

    state: {
        chatRoomShow: false,
        chatMessage: [],
        chatPosition: 'absoulte'
    },

    subscriptions : {
        setup ({ dispatch }) {
            window.onscroll = function() {
                let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop

                console.log(scrollHeight)

                if (scrollHeight > 50) {
                    dispatch({ type: 'chat/UpdateState', payload: { chatPosition: 'fixed' } })
                } else {
                    dispatch({ type: 'chat/UpdateState', payload: { chatPosition: 'absoulte' } })
                }
            }
        }
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