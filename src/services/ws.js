import { config } from '../utils/'

const { websocketURL } = config

let websocket = undefined;
function getWebsocket(url) {
    if (!(websocket instanceof WebSocket)) {
        websocket = new WebSocket(url);
    }
    return websocket;
}

export async function connect() {
    const client = getWebsocket(websocketURL);
    client.onopen = () => {
        client.send(JSON.stringify({ event: 'login' }));
    };
    client.onerror = () => {
        throw {
            success: false,
            msg: '消息服务器链接失败'
        }
    }
}

export async function listen(event, cb) {
    const client = getWebsocket(websocketURL)
    client.onmessage = (res) => {
        if (res.event === event) {
            cb(res)
        }
    }
}

export async function send(data) {
    const client = getWebsocket(websocketURL);
    client.send(JSON.stringify(data));
}

export async function logout(code, reason) {
    const client = getWebsocket(websocketURL);
    client.close(code, reason);
}