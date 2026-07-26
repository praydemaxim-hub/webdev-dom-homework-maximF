import { addComment } from './api.js';
import { loadComments } from './api.js';
import { escapeHtml } from './utils.js';

export async function handleAddComment(nameInput, textInput, commentsList) {
  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  let errorMessage = '';

  if (!name && !text) {
    errorMessage = 'Пожалуйста, заполните поля «Имя» и «Комментарий»';
  } else if (!name) {
    errorMessage = 'Пожалуйста, заполните поле «Имя»';
  } else if (!text) {
    errorMessage = 'Пожалуйста, заполните поле «Комментарий»';
  }

  if (errorMessage) {
    alert(errorMessage);
    return;
  }

  try {
    await addComment(name, text);
    await loadComments(commentsList);
    nameInput.value = '';
    textInput.value = '';
  } catch (err) {
    console.error(err);
    alert(err.message || 'Не удалось добавить комментарий');
  }
}

export function handleLikeClick(button) {
  const commentElement = button.closest('.comment');
  const counterSpan = commentElement.querySelector('.likes-counter');
  const currentLikes = parseInt(counterSpan.textContent, 10) || 0;

  if (button.classList.contains('-active-like')) {
    button.classList.remove('-active-like');
    counterSpan.textContent = String(currentLikes - 1);
  } else {
    button.classList.add('-active-like');
    counterSpan.textContent = String(currentLikes + 1);
  }
}

export function handleReplyClick(commentElement, nameInput, textInput) {
  const originalText = commentElement.querySelector('.comment-text').textContent;
  const originalAuthor = commentElement.querySelector('.comment-header > div:first-child').textContent;

  textInput.value = `> ${escapeHtml(originalAuthor)}: ${escapeHtml(originalText)}\n`;
}

export function attachHandlers(addButton, commentsList, nameInput, textInput) {
  addButton.addEventListener('click', () => {
    handleAddComment(nameInput, textInput, commentsList);
  });

  commentsList.addEventListener('click', event => {
    const likeButton = event.target.closest('.like-button');
    if (likeButton) {
      handleLikeClick(likeButton);
      return;
    }

    const commentElement = event.target.closest('.comment');
    if (commentElement) {
      handleReplyClick(commentElement, nameInput, textInput);
    }
  });
}
