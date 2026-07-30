import { addComment } from './api.js';
import { loadComments } from './api.js';
import { renderCommentsFromApi } from './renderer.js';
import { escapeHtml } from './utils.js';

// Имитация задержки запроса к API
function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

export async function handleAddComment(nameInput, textInput, commentsList, addForm, addingState) {
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

  addForm.style.display = 'none';
  addingState.style.display = 'block';

  try {
    await addComment(name, text);
    const comments = await loadComments(commentsList);
    renderCommentsFromApi(commentsList, comments);

    nameInput.value = '';
    textInput.value = '';
  } catch (err) {
    console.error(err);
    alert(err.message || 'Не удалось добавить комментарий');
  } finally {
    addForm.style.display = 'block';
    addingState.style.display = 'none';
  }
}

export async function handleLikeClick(button) {
  // Блокируем повторные клики, пока идёт «запрос»
  if (button.classList.contains('-loading-like')) {
    return;
  }

  const commentElement = button.closest('.comment');
  const counterSpan = commentElement.querySelector('.likes-counter');
  const currentLikes = parseInt(counterSpan.textContent, 10) || 0;

  // Сохраняем состояние до запроса, чтобы знать, что делать после
  const isLikedNow = button.classList.contains('-active-like');

  // Показываем анимацию вращения
  button.classList.add('-loading-like');
  button.classList.remove('-active-like'); // убираем цветное сердечко на время запроса

  // Имитируем сетевой запрос
  await delay(1500);

  // Обновляем данные «в памяти» (как будто пришёл ответ от API)
  const newLikes = isLikedNow ? currentLikes - 1 : currentLikes + 1;
  const newIsLiked = !isLikedNow;

  counterSpan.textContent = String(newLikes);

  if (newIsLiked) {
    button.classList.add('-active-like');
  }

  button.classList.remove('-loading-like');
}

export function handleReplyClick(commentElement, nameInput, textInput) {
  const originalText = commentElement.querySelector('.comment-text').textContent;
  const originalAuthor = commentElement.querySelector('.comment-header > div:first-child').textContent;

  textInput.value = `> ${escapeHtml(originalAuthor)}: ${escapeHtml(originalText)}\n`;
}

export function attachHandlers(addButton, commentsList, nameInput, textInput, addForm, addingState) {
  addButton.addEventListener('click', () => {
    handleAddComment(nameInput, textInput, commentsList, addForm, addingState);
  });

  commentsList.addEventListener('click', (event) => {
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
