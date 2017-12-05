import { request, config } from '../utils'
const { api } = config
const { list, my, info, admin, status, batch } = api.group

export async function query(params) {
    return request({
        url: list,
        method: 'get',
        data: params,
    })
}

export async function queryMy(params) {
    return request({
        url: my,
        method: 'get',
        data: params,
    })
}

export async function create(params) {
    return request({
        url: info.replace('/:id', ''),
        method: 'post',
        data: params,
    })
}

export async function allot(params) {
    return request({
        url: admin,
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

export async function update(params) {
    return request({
        url: info,
        method: 'put',
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