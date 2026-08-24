import { registerUser } from './api.js'
import { renderCommentsPage } from './renderCommentsPage.js'
import { renderLogin } from './renderLogin.js'

export function renderRegister() {
  const app = document.getElementById('app')

  app.innerHTML = `
    <div class="modal-content">
      <h2 class="form-title">Регистрация</h2>
      <div class="error-message" id="registerError" style="color: #ff6b6b; margin-bottom: 12px; text-align: center;"></div>
      <form id="registerForm" class="form-row" style="display: flex; flex-direction: column; gap: 12px; max-width: 400px; margin: 0 auto;">
        <input type="text" id="regLoginInput" class="input" placeholder="Логин (для входа)" required style="padding: 12px; border-radius: 8px; border: none;" />
        <input type="text" id="regNameInput" class="input" placeholder="Имя для комментариев" required style="padding: 12px; border-radius: 8px; border: none;" />
        <input type="password" id="regPasswordInput" class="input" placeholder="Пароль" required style="padding: 12px; border-radius: 8px; border: none;" />
        <button type="submit" class="button" style="padding: 12px; background: #bcec30; border: none; border-radius: 18px; font-size: 20px; cursor: pointer;">Зарегистрироваться</button>
      </form>
      <p class="toggle-link" style="text-align: center; margin-top: 16px; color: #ddd;">
        Уже есть аккаунт? <span id="toLoginLink" style="color: #bcec30; cursor: pointer; text-decoration: underline;">Войти</span>
      </p>
    </div>
  `

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const login = document.getElementById('regLoginInput').value.trim()
    const name = document.getElementById('regNameInput').value.trim()
    const password = document.getElementById('regPasswordInput').value.trim()
    const errorEl = document.getElementById('registerError')

    errorEl.textContent = ''

    if (!login || !name || !password) {
      errorEl.textContent = 'Заполните все поля'
      return
    }

    if (login.length < 3 || name.length < 3 || password.length < 3) {
      errorEl.textContent = 'Логин, имя и пароль должны быть не короче 3 символов'
      return
    }

    try {
      const user = await registerUser(login, name, password)

      localStorage.setItem('userToken', user.token)
      localStorage.setItem('userName', user.name)
      localStorage.setItem('userLogin', user.login)

      renderCommentsPage()
    } catch (err) {
      errorEl.textContent = err.message || 'Ошибка регистрации. Попробуйте другой логин.'
    }
  })

  // Переход на страницу входа
  document.getElementById('toLoginLink').addEventListener('click', () => {
    renderLogin()
  })
}