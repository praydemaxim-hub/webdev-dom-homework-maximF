// !!! ЗАМЕНИ НА СВОЁ ИМЯ И ФАМИЛИЮ ЛАТИНИЦЕЙ ЧЕРЕЗ ДЕФИС
const PERSONAL_KEY = 'maxim-fedoretc';

const baseUrl = `https://wedev-api.sky.pro/api/v1/${PERSONAL_KEY}/comments`;

export async function loadComments(commentsList) {
  const response = await fetch(baseUrl, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки комментариев: ${response.status}`);
  }

  const data = await response.json();
  renderCommentsFromApi(commentsList, data.comments);
}

export async function addComment(name, text) {
  const response = await fetch(baseUrl, {
    method: 'POST',
    // Заголовок Content-Type убран: API не принимает его
    body: JSON.stringify({ text, name }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || `Ошибка при добавлении комментария: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

import { escapeHtml } from './utils.js';

function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export function renderCommentsFromApi(commentsList, apiComments) {
  commentsList.innerHTML = '';

  apiComments.forEach((comment, index) => {
    const name = comment.author?.name || 'Аноним';
    const date = formatDate(comment.date);
    const likeClass = comment.isLiked ? '-active-like' : '';

    const newCommentHTML = `
      <li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${escapeHtml(name)}</div>
          <div>${escapeHtml(date)}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
            ${escapeHtml(comment.text)}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${likeClass}"></button>
          </div>
        </div>
      </li>`;

    commentsList.insertAdjacentHTML('beforeend', newCommentHTML);
  });
}
