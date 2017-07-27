import { request, config } from '../utils'
const { api } = config
const { system } = api
const { alogin } = system

export async function login (data) {
  return request({
    url: alogin,
    method: 'post',
    data,
  })
}
