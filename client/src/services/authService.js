import { apiRequest } from './api'

const AUTH_TOKEN_KEY = 'fuelcore_auth_token'

export const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY)

export const saveStoredToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export const clearStoredToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const registerUser = async (payload) =>
  apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const loginUser = async (payload) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const getCurrentUser = async (token) =>
  apiRequest('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
