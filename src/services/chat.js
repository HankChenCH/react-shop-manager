import { request, config } from '../utils'
const { api } = config
const { admin, group, message } = api

const { members } = admin
const { my } = group
const { send } = message

export async function queryMembers(params){
    return request({
        url: members,
        method: 'get',
        data: params,
    })
}

export async function queryGroups(params) {
    return request({
        url: my,
        method: 'get',
        data: params,
    })
}

export async function sendMessage(params) {
    return request({
        url: send,
        method: 'post',
        data: params,
    })
}