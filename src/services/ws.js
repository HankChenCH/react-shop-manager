import { config, deleteProps } from '../utils/'

const { prefix, websocketURL } = config

let websocket = undefined
const eventListener = []

function getWebsocket(url) {
    if (!(websocket instanceof WebSocket)) {
        const token = JSON.parse(localStorage.getItem(`${prefix}admin`)).token
        websocket = new WebSocket(url + '?token=' + token)
    } else if (websocket instanceof WebSocket && websocket.readyState !== 1) {
        const token = JSON.parse(localStorage.getItem(`${prefix}admin`)).token
        websocket = new WebSocket(url + '?token=' + token)
    }
    
    return websocket
}

export async function connect() {
    const client = getWebsocket(websocketURL)
    if (client.readyState !== 1) {
        client.onopen = () => {
            console.log('链接成功',client)
        }
        client.onmessage = (res) => {
            const message = JSON.parse(res.data)
            const { event } = message
            if (eventListener[event] instanceof Function && deleteProps(message, ['event'])) {
                // console.log(event)
                eventListener[event](message)
            }
        }
    }
}

//增加监听服务器事件以及返回结果
export function on(event, cb) {
    if(eventListener[event] instanceof Function) {
        console.error('this event already has listener function,please checkout!')
        return
    }

    eventListener[event] = cb
}

//普通发送消息
export async function sendMsg(data = {}) {
    const client = getWebsocket(websocketURL)
    const sendBody = { ...data, event: 'manager/chat'}
    client.send(JSON.stringify(sendBody))
}

//触发服务器事件
export async function trigger(event, data = {}) {
    const client = getWebsocket(websocketURL)
    const sendBody = { ...data, event: event }
    client.send(JSON.stringify(sendBody))
}

//客户端主动关闭
export async function close(code, reason) {
    const client = getWebsocket(websocketURL);
    client.close(code, reason);
}

//检查客户端是否准备好
export async function ready(cb) {
    const client = getWebsocket(websocketURL)
    if (client.readyState === 1) {
        cb()
    }
}