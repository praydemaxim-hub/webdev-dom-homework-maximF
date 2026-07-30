import { baseUrl } from './config.js';

export async function loadComments(commentsList) {
  const response = await fetch(baseUrl, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки комментариев: ${response.status}`);
  }

  const data = await response.json();
  return data.comments;
}

export async function addComment(name, text) {
  const response = await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify({ text, name }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || `Ошибка при добавлении комментария: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}
