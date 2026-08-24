import { renderCommentsFromApi } from './renderer.js'
import { loadComments } from './api.js'
import { attachHandlers } from './handlers.js'
import { renderLogin } from './renderLogin.js'

export async function renderCommentsPage() {
  const app = document.getElementById('app')
  const token = localStorage.getItem('userToken')
  const userName = localStorage.getItem('userName') || ''

  app.innerHTML = `
    <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
      ${
        token
          ? `<button id="logoutButton" style="background: #ff6b6b; border: none; padding: 8px 16px; border-radius: 12px; cursor: pointer; color: white; font-weight: bold;">Выйти</button>`
          : ''
      }
    </div>
    <div class="loading-state" id="loadingState">Загрузка комментариев…</div>
    <ul class="comments" id="commentsList"></ul>
    <div class="adding-state" id="addingState" style="display: none">Комментарий добавляется…</div>

    ${
      token
        ? `
          <div class="add-form" id="addForm">
            <input type="text" class="add-form-name" id="nameInput" value="${userName}" readonly />
            <textarea class="add-form-text" id="textInput" placeholder="Введите ваш комментарий" rows="4"></textarea>
            <div class="add-form-row">
              <button class="add-form-button" id="addButton">Написать</button>
            </div>
          </div>
        `
        : `
          <p class="login-prompt" style="color: #ddd; text-align: center; margin-top: 30px;">
            <span id="loginLink" style="color: #bcec30; cursor: pointer; text-decoration: underline;">Чтобы добавить комментарий, авторизуйтесь</span>
          </p>
        `
    }
  `

  // Загрузка комментариев
  const loadingState = document.getElementById('loadingState')
  const commentsList = document.getElementById('commentsList')

  loadingState.style.display = 'block'
  try {
    const comments = await loadComments()
    renderCommentsFromApi(commentsList, comments)
  } catch (err) {
    alert(`Ошибка загрузки: ${err.message}`)
  } finally {
    loadingState.style.display = 'none'
  }

  // Если авторизован
  if (token) {
    const addButton = document.getElementById('addButton')
    const nameInput = document.getElementById('nameInput')
    const textInput = document.getElementById('textInput')
    const addForm = document.getElementById('addForm')
    const addingState = document.getElementById('addingState')

    attachHandlers(
      addButton,
      commentsList,
      nameInput,
      textInput,
      addForm,
      addingState,
      token
    )

    // Кнопка выхода
    const logoutButton = document.getElementById('logoutButton')
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        localStorage.removeItem('userToken')
        localStorage.removeItem('userName')
        localStorage.removeItem('userLogin')
        renderLogin()
      })
    }
  } else {
    const loginLink = document.getElementById('loginLink')
    if (loginLink) {
      loginLink.addEventListener('click', () => {
        renderLogin()
      })
    }
  }
}