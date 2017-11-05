import { request, config } from '../utils'
const { api } = config
const { admin } = api

const { members } = admin

export async function queryMembers(params){
    return request({
        url: members,
        method: 'get',
        data: params,
    })
}