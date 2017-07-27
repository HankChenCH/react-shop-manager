import { request, config } from '../utils'
const { api } = config
const { list } = api.order

export async function query (params) {
  return request({
    url: list,
    method: 'get',
    data: params,
  })
}
