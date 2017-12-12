import modelExtend from 'dva-model-extend'
import { model } from './common'
import * as ws from '../services/ws.js'
import * as chatService from '../services/chat.js'
import { config, hasProp, Enum } from '../utils'
const { prefix } = config
const { EnumChatStatus, EnumChatType } = Enum

const { queryMembers, queryGroups, sendMessage, queryMessage } = chatService

export default modelExtend(model, {
    namespace: 'chat',
    
        state: {
            groups: [],
            members: [],
            onlineMembers: [],
            onlineCount: 0,
            chatMessage: {},
            chatMessagePageInfo: {},
            chatRoomVisible: false,
            currentChatKey: 0,
            currentChat: null,
            scrollBottom: true,
        },
    
        subscriptions : {
            setup({ history, dispatch }) {
                history.listen(location => {
                    if (location.pathname !== '/login') {
                        dispatch({ type: 'queryMember' })
                        dispatch({ type: 'queryGroup' })
                        //登出后重连时查询成员列表
                        // onlineCountTimer = setInterval(() => ws.trigger('manager/online/count', { userType: 'manager' }), 300000)
                    }
                })
            },
        },
    
        effects: {
            *queryMember({ payload }, { put, call, select }) {
                const { members } = yield select((_) => _.chat)
                if (members.length === 0 || payload.reload) {
                    const res = yield call(queryMembers)
                    if (res.success) {
                        yield put({ type: 'updateState', payload: { members: res.data } })
                        ws.trigger('manager/online/count')
                    }
                }
            },

            *queryGroup({ payload }, { put, call, select }) {
                const { groups } = yield select((_) => _.chat)
                if (groups.length === 0 || payload.reload) {
                    const res = yield call(queryGroups)
                    if (res.success) {
                        yield put({ type: 'updateState', payload: { groups: res.data.groups } })
                    }
                }
            },

            *loadMessage({ payload }, { put, call, select }) {
                const { chatMessage } = yield select((_) => _.chat)
                if (!hasProp(chatMessage, payload)) {
                //     const localMessage = yield JSON.parse(localStorage.getItem(`${prefix}chat_message_${payload}`))
                //     chatMessage[payload] = localMessage || []
                //     yield put({ type: 'updateState', payload: { chatMessage: chatMessage } })
                    const key = payload.split('_')
                    const res = yield call(queryMessage, { id: key[1], to_type: key[0] })
                    if (res.success) {
                        yield put({ type: 'loadMessageSuccess', payload: { messages: res.data, key: payload } })
                    } else {
                        throw res
                    }
                }
            },

            *loadMore({ payload }, { put, call, select }) {
                const { chatMessage, chatMessagePageInfo, currentChatKey } = yield select((_) => _.chat)
                const key = currentChatKey.split('_')
                const res = yield call(queryMessage, { id: key[1], to_type: key[0], page: chatMessagePageInfo[currentChatKey].current + 1 })
                if (res.success) {
                    yield put({ type: 'loadMessageSuccess', payload: { messages: res.data, key: currentChatKey } })
                } else {
                    throw res
                }
            },

            *loadMessageSuccess({ payload }, { put, select }) {
                const { chatMessage, chatMessagePageInfo } = yield select((_) => _.chat)
                const messages = payload.messages.data.map(item => ({
                    message: item.message,
                    from: item.sender.true_name,
                    send_time: item.create_time,
                }))

                if (!hasProp(chatMessage, payload.key)) {
                    chatMessage[payload.key] = messages.reverse()
                } else {
                    chatMessage[payload.key] = chatMessage[payload.key].reverse().concat(messages)
                    chatMessage[payload.key].reverse()
                }

                chatMessagePageInfo[payload.key] = {
                    current: payload.messages.current_page,
                    size: payload.messages.per_page,
                    total: payload.messages.total,
                }

                yield put({
                    type: 'updateState',
                    payload: {
                        scrollBottom: false,
                        chatMessage,
                        chatMessagePageInfo,
                    }
                })
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

            *sendMessage({ payload }, { put, call, select }) {
                const { uid, username } = yield select(({ app }) => app.user)
                const { chatMessage, currentChatKey } = yield select((_) => _.chat)
                payload = payload.replace(/\n/g, '<br />$&')
                const key = currentChatKey.split('_');
                const message = {
                    to_id: key[1],
                    to_type: key[0],
                    message: payload,
                }

                const res = yield call(sendMessage, message)
                if (res.success) {
                    if (!(chatMessage[currentChatKey] instanceof Array)) {
                        chatMessage[currentChatKey] = []
                    }
                    chatMessage[currentChatKey].push({ message: payload, from: username, send_time: res.data.create_time })
                    // yield localStorage.setItem(`${prefix}chat_message_${currentChatKey}`, JSON.stringify(chatMessage[currentChatKey]))
                    yield put({ type: 'updateState', payload: { chatMessage, scrollBottom: true } })
                    ws.sendMsg({ message: payload, from: username, to_id: key[1], to_type: key[0], send_time: res.data.create_time })
                }
            },

            *receiveMsg({ payload }, { put, select }) {
                const { chatMessage, groups } = yield select((_) => _.chat)
                const msgKey = payload.to_type + '_' + payload.to_id
                const groupIds = groups.map(item => item.id)

                if (payload.to_type === EnumChatType.Group && groupIds.indexOf(payload.to_id) === -1) {
                    return false
                }

                const message = { message: payload.message, from: payload.from, send_time: payload.send_time }

                if (hasProp(chatMessage, msgKey)) {
                    chatMessage[msgKey].push(message)
                } else {
                    chatMessage[msgKey] = [message]
                }

                yield put({
                    type: 'updateState',
                    payload: {
                        chatMessage
                    }
                })
            },

            *showChatRoom({ payload }, { put, select }) {
                const { members, groups, onlineMembers } = yield select((_) => _.chat)
                const key = payload.split('_')
                let currentChat
                switch (key[0]) {
                    case EnumChatType.Group:                        
                        yield put({ type: 'loadMessage', payload: payload })
                        currentChat = groups.filter( item => item.id.toString() === key[1])[0].name
                        break
                    case EnumChatType.Member:
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