import { config } from '../utils/'

const { websocketURL } = config

let websocket = undefined
let eventListener = []

function getWebsocket(url) {
    if (!(websocket instanceof WebSocket)) {
        websocket = new WebSocket(url)
    }
    return websocket
}

export async function connect() {
    const client = getWebsocket(websocketURL)
    client.onopen = () => {
        console.log('链接成功',client)
    }
    client.onmessage = (res) => {
        const message = JSON.parse(res.data)
        if (eventListener[message.event] instanceof Function) {
            eventListener[message.event](message)
        }
    }
}

//增加监听服务器事件以及返回结果
export function addListen(event, cb) {
    if(eventListener[event] instanceof Function) {
        console.error('this event already has listener function,please checkout!')
        return
    }

    eventListener[event] = cb
}

//普通发送消息
export async function sendMsg(data = {}) {
    const client = getWebsocket(websocketURL)
    const sendBody = { ...data, event: 'msg'}
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