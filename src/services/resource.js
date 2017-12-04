import { request, config } from '../utils'
const { api } = config
const { list, all, info, batch } = api.resource

export async function query(params) {
    return request({
        url: list,
        method: 'get',
        data: params,
    })
}

export async function queryAll(params) {
    return request({
        url: all,
        method: 'get',
        data: params,
    })
}

export async function create(params) {
    return request({
        url: list,
        method: 'post',
        data: params
    })
}

export async function update(params) {
    return request({
        url: info,
        method: 'put',
        data: params
    })
}

export async function remove(params) {
    return request({
        url: info,
        method: 'delete',
        data: params,
    })
}

export async function batchRemove(params) {
    return request({
        url: batch,
        method: 'delete',
        data: params,
    })
}