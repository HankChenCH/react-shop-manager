import { request, config } from '../utils'
const { api } = config
const { list, info, role, status, batch, members } = api.admin

export async function query (params) {
  return request({
    url: list,
    method: 'get',
    data: params,
  })
}

export async function queryOne (params) {
  return request({
    url: info,
    method: 'get',
    data: params,
  })
}

export async function queryMembers (params) {
  return request({
    url: members,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: info.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function auth (params) {
  return request({
    url: role,
    method: 'put',
    data: params
  })
}

export async function remove (params) {
  return request({
    url: info,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: info,
    method: 'put',
    data: params,
  })
}

export async function enableOrDisable(params) {
  return request({
    url: status,
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

export async function batchUpdate(params) {
  return request({
    url: batch,
    method: 'put',
    data: params,
  })
}