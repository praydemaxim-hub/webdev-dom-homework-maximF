import { loginUser } from './api.js'
import { renderCommentsPage } from './renderCommentsPage.js'
import { renderRegister } from './renderRegister.js'

export function renderLogin() {
  const app = document.getElementById('app')

  app.innerHTML = `
    <div class="modal-content">
      <h2 class="form-title">Вход</h2>
      <div class="error-message" id="loginError" style="color: #ff6b6b; margin-bottom: 12px; text-align: center;"></div>
      <form id="loginForm" class="form-row" style="display: flex; flex-direction: column; gap: 12px; max-width: 400px; margin: 0 auto;">
        <input type="text" id="loginInput" class="input" placeholder="Логин" required style="padding: 12px; border-radius: 8px; border: none;" />
        <input type="password" id="passwordInput" class="input" placeholder="Пароль" required style="padding: 12px; border-radius: 8px; border: none;" />
        <button type="submit" class="button" style="padding: 12px; background: #bcec30; border: none; border-radius: 18px; font-size: 20px; cursor: pointer;">Войти</button>
      </form>
      <p class="toggle-link" style="text-align: center; margin-top: 16px; color: #ddd;">
        Нет аккаунта? <span id="toRegisterLink" style="color: #bcec30; cursor: pointer; text-decoration: underline;">Зарегистрироваться</span>
      </p>
    </div>
  `

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const login = document.getElementById('loginInput').value.trim()
    const password = document.getElementById('passwordInput').value.trim()
    const errorEl = document.getElementById('loginError')

    errorEl.textContent = ''

    if (!login || !password) {
      errorEl.textContent = 'Заполните оба поля'
      return
    }

    try {
      const user = await loginUser(login, password)

      localStorage.setItem('userToken', user.token)
      localStorage.setItem('userName', user.name)
      localStorage.setItem('userLogin', user.login)

      renderCommentsPage()
    } catch (err) {
      errorEl.textContent = err.message || 'Ошибка входа. Проверьте логин и пароль.'
    }
  })

  // Переход на страницу регистрации
  document.getElementById('toRegisterLink').addEventListener('click', () => {
    renderRegister()
  })
}