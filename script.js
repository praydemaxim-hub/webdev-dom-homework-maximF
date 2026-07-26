import { attachHandlers } from './handlers.js';
import { loadComments } from './api.js';

const nameInput = document.querySelector('.add-form-name');
const textInput = document.querySelector('.add-form-text');
const addButton = document.querySelector('.add-form-button');
const commentsList = document.querySelector('.comments');

// При запуске загружаем список комментариев из API
loadComments(commentsList).catch(err => {
  console.error('Ошибка загрузки комментариев:', err);
  alert('Не удалось загрузить комментарии. Проверьте консоль.');
});

// Навешиваем обработчики событий
attachHandlers(addButton, commentsList, nameInput, textInput);
