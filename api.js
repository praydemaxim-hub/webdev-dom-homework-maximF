import { COMMENTS_URL, USERS_URL } from './config.js'

// ЗАГРУЗКА КОММЕНТАРИЕВ
export async function loadComments() {
  const response = await fetch(COMMENTS_URL, {
    method: 'GET'
  })

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error('Сервер сломался, попробуй позже')
    }
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Ошибка загрузки: ${response.status}`)
  }

  const data = await response.json()
  return data.comments
}

// ДОБАВЛЕНИЕ КОММЕНТАРИЯ
export async function addComment(text, token) {
  const response = await fetch(COMMENTS_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  })

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Некорректные данные')
    }
    if (response.status === 401) {
      throw new Error('Сессия истекла, войдите заново')
    }
    if (response.status === 500) {
      throw new Error('Сервер сломался, попробуй позже')
    }
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Ошибка при добавлении: ${response.status}`)
  }

  return response.json()
}

// АВТОРИЗАЦИЯ (ЛОГИН)
export async function loginUser(login, password) {
  const response = await fetch(`${USERS_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ login, password })
  })

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Неверный логин или пароль')
    }
    throw new Error(`Ошибка авторизации: ${response.status}`)
  }

  const data = await response.json()
  return data.user
}

// РЕГИСТРАЦИЯ
export async function registerUser(login, name, password) {
  const response = await fetch(`${USERS_URL}`, {
    method: 'POST',
    body: JSON.stringify({ login, name, password })
  })

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Пользователь с таким логином уже существует')
    }
    throw new Error(`Ошибка регистрации: ${response.status}`)
  }

  const data = await response.json()
  return data.user // { id, login, name, token }
}