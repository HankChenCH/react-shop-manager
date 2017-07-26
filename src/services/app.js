import { request, config } from '../utils'
const { api } = config
const { user, userLogout, userLogin } = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return {
    success: true
  }
  // return request({
  //   url: userLogout,
  //   method: 'get',
  //   data: params,
  // })
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
  //   url: user.replace('/:id', ''),
  //   method: 'get',
  //   data: params,
  // })
}
