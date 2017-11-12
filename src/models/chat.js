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
            currentChat: null,
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
                const { chatMessage, currentChatKey } = yield select((_) => _.chat)
                payload = payload.replace(/\n/g, '<br />$&')
                if (!(chatMessage[currentChatKey] instanceof Array)) {
                    chatMessage[currentChatKey] = []
                }
                chatMessage[currentChatKey].push({data: payload, from: username})
                yield localStorage.setItem(`${prefix}chat_message_${currentChatKey}`, JSON.stringify(chatMessage[currentChatKey]))
                yield put({ type: 'updateState', payload: { chatMessage } })
                ws.sendMsg({ data: payload, from: username })
            },

            *showChatRoom({ payload }, { put, select }) {
                const { members } = yield select((_) => _.chat)
                const key = payload.split('_')
                let currentChat
                switch (key[0]) {
                    case 'group':
                        if (key[1] === '0') {
                            currentChat = '讨论组'
                        }
                        break
                    case 'member':
                        currentChat = members.filter( item => item.id.toString() === key[1])[0].true_name
                        break
                    default:
                        currentChat = ''
                        break
                }
                yield put({ 
                    type: 'updateState', 
                    payload: { 
                        chatRoomVisible: true, 
                        currentChat: currentChat, 
                        currentChatKey:payload 
                    } 
                })
            },
        },
    
        reducers: {
    
            receiveMsg(state, { payload }) {
                return {
                    ...state,
                    chatMessage: state.chatMessage.concat({ data: payload.data, from: payload.from })
                }
            },

            hideChatRoom(state) {
                return {
                    ...state,
                    chatRoomVisible: false,
                    currentChat: '',
                    currentChatKey: 0,
                }
            }
        }
})