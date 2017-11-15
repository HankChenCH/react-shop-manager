import modelExtend from 'dva-model-extend'
import { model } from './common'
import * as ws from '../services/ws.js'
import * as chatService from '../services/chat.js'
import { config, hasProp, Enum } from '../utils'
const { prefix } = config
const { EnumChatStatus } = Enum

const { queryMembers } = chatService

export default modelExtend(model, {
    namespace: 'chat',
    
        state: {
            members:[],
            onlineMembers: [],
            onlineCount: 0,
            chatMessage: {},
            chatRoomVisible: false,
            currentChatKey: 0,
            currentChat: null,
        },
    
        subscriptions : {
            setup({ history, dispatch }) {
                history.listen(location => {
                    if (location.pathname !== '/login') {
                        //登出后重连时查询成员列表
                        dispatch({ type: 'queryMember' })
                    }
                })
            },
            wsListen({ dispatch }) {
                ws.on('offline/notice', (res) => {
                    dispatch({ type: 'offlineUpdate', payload: res })
                })
                ws.on('online/notice', (res) => {
                    dispatch({ type: 'onlineUpdate', payload: res })
                })
                ws.on('online/count', (res) => {
                    dispatch({ type: 'membersUpdate', payload: res })
                })
            }
        },
    
        effects: {
            *queryMember({ payload }, { put, call }) {
                const res = yield call(queryMembers)
                if (res.success) {
                    yield put({ type: 'updateState', payload: { members: res.data } })
                    ws.trigger('online/count', { userType: 'manager' })
                }
            },

            *loadMessage({ payload }, { put, select }) {
                const { chatMessage } = yield select((_) => _.chat)
                if (!hasProp(chatMessage, payload)) {
                    const localMessage = yield JSON.parse(localStorage.getItem(`${prefix}chat_message_${payload}`))
                    chatMessage[payload] = localMessage || []
                    yield put({ type: 'updateState', payload: { chatMessage: chatMessage } })
                }
            },

            *membersUpdate({ payload }, { put, select }) {
                const { members } = yield select((_) => _.chat)
                let newMembers = members.map(item => {
                    if (payload.onlineMembers.indexOf(item.id) !== -1) {
                        return {
                            ...item,
                            chatStatus: EnumChatStatus.Online
                        }
                    } else {
                        return {
                            ...item,
                            chatStatus: EnumChatStatus.Offline
                        }
                    }
                })

                yield put({ type: 'updateState', payload: { 
                        members: newMembers, 
                        onlineMembers: payload.onlineMembers, 
                        onlineCount: payload.onlineCount 
                    } 
                })
            },

            *onlineUpdate({ payload }, { put, select }) {
                let { members, onlineMembers, onlineCount } = yield select((_) => _.chat)
                if (onlineMembers.indexOf(payload.uid) === -1) {
                    members = members.map(item => {
                        if (item.id === payload.uid) {
                            return {
                                ...item,
                                chatStatus: EnumChatStatus.Online
                            }
                        }
                        return item
                    })
                    onlineMembers.push(payload.uid)
                    onlineCount++
                    yield put({ type: 'updateState', payload: { members, onlineMembers, onlineCount } })
                }
                
            },

            *offlineUpdate({ payload }, { put, select }) {
                let { members, onlineMembers, onlineCount } = yield select((_)=>_.chat)
                members = members.map(item => {
                    if (item.id === payload.uid) {
                        return {
                            ...item,
                            chatStatus: EnumChatStatus.Offline
                        }
                    }
                    return item
                })
                const newOnline = onlineMembers.filter(item => item !== payload.uid)
                onlineCount--

                yield put({ type: 'updateState', payload: { members, onlineMembers: newOnline, onlineCount } })
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
                const { members, onlineMembers } = yield select((_) => _.chat)
                const key = payload.split('_')
                let currentChat
                switch (key[0]) {
                    case 'group':
                        if (key[1] === '0') {
                            currentChat = '讨论组'
                        }
                        break
                    case 'member':
                        yield put({ type: 'loadMessage', payload: payload })
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