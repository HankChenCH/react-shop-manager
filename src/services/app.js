import { request, config } from '../utils'
const { api } = config
const { user, system } = api
const { alogin, alogout } = system
const { list } = user

export async function login (params) {
  return request({
    url: alogin,
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: alogout,
    method: 'delete',
    data: params,
  })
}

export async function reToken (params) {
  return {
    success: false
  }
}

export async function query (params) {
  if (params.token) {
    return {
      success: true,
      user: params,
    }
  }
  return {
    success: false
  }
  // return request({
  //   url: list,
  //   method: 'get',
  //   data: params,
  // })
}
