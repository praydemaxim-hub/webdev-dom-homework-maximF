import { baseUrl } from './config.js'

export async function loadComments(commentsList) {
  const response = await fetch(baseUrl, { method: 'GET' })

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error('Сервер сломался, попробуй позже')
    }
    const errorData = await response.json().catch(() => ({}))
    const message = errorData.error || `Ошибка загрузки комментариев: ${response.status}`
    throw new Error(message)
  }

  const data = await response.json()
  return data.comments
}

export async function addComment(name, text) {
  const response = await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify({ text, name }),
  })

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Некорректные данные')
    }
    if (response.status === 500) {
      throw new Error('Сервер сломался, попробуй позже')
    }
    const errorData = await response.json().catch(() => ({}))
    const message = errorData.error || `Ошибка при добавлении комментария: ${response.status}`
    throw new Error(message)
  }

  return response.json()
}
