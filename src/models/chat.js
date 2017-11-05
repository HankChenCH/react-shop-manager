import modelExtend from 'dva-model-extend'
import { model } from './common'
import * as ws from '../services/ws.js'
import * as chatService from '../services/chat.js'
import { config, hasProp } from '../utils'
const { prefix } = config

const { queryMembers } = chatService

export default modelExtend(model, {
    namespace: 'chat',
    
        state: {
            members:[],
            onlineMembers: [],
            onlineCount: 0,
            chatMessage: [],
            chatRoomVisible: false,
            currentChatKey: 0,
        },
    
        subscriptions : {
            setup({ history, dispatch }) {
                dispatch({ type: 'queryMember' })
            },
            wsListen({ dispatch }) {
                ws.on('online/count', (res) => {
                    dispatch({ type: 'updateState', payload: res })
                })
                ws.on('online/notice', (res) => {
                    dispatch({ type: 'chat/updateOnline', payload: res })
                })
            }
        },
    
        effects: {
            *queryMember({ payload }, { put, call }) {
                const res = yield call(queryMembers)
                if (res.success) {
                    yield put({ type: 'updateState', payload: { members: res.data } })
                    ws.ready(() => {
                        ws.trigger('online/count', { userType: 'manager' })
                    }) 
                }
            },

            *updateOnline({ payload }, { put, select }) {
                let { onlineMembers, onlineCount } = yield select((_) => _.chat)
                if (onlineMembers.indexOf(payload.uid) === -1) {
                    onlineMembers.push(payload.uid)
                    onlineCount++
                }
                
                yield put({ type: 'updateState', payload: { onlineMembers, onlineCount } })
            },

            *updateOffLine({ payload }, { put, select }) {
                let { onlineMembers, onlineCount } = yield select((_)=>_.chat)
                const newOnline = onlineMembers.filter(item => item !== payload.uid)
                onlineCount--

                yield put({ type: 'updateState', payload: { onlineMembers: newOnline, onlineCount } })
            },

            *sendMessage({ payload }, { put, select }) {
                const { username } = yield select(({ app }) => app.user)
                const { chatMessage } = yield select((_) => _.message)
                payload = payload.replace(/\n/g, '<br />$&')
                chatMessage.push({data: payload, from: username})
                yield put({ type: 'updateState', payload: { chatMessage } })
                ws.sendMsg({ data: payload, from: username })
            },
        },
    
        reducers: {
    
            receiveMsg(state, { payload }) {
                return {
                    ...state,
                    chatMessage: state.chatMessage.concat({ data: payload.data, from: payload.from })
                }
            },

            showChatRoom(state, { payload }) {
                return {
                    ...state,
                    chatRoomVisible: true,
                    currentChatKey: payload
                }
            }
        }
})