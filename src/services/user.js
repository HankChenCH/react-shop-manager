import { request, config } from '../utils'
const { api } = config
const { list, info } = api.user

export async function query (params) {
  return request({
    url: list,
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
