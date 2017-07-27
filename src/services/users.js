import { request, config } from '../utils'
const { api } = config
const { list } = api.user

export async function query (params) {
  return request({
    url: list,
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: list,
    method: 'delete',
    data: params,
  })
}
