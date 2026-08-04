export const renderRegistration = () => {
  const app = document.getElementById('app')
  app.innerHTML = `
    <div class="modal-content">
      <h2 class="form-title">Вход</h2>
      <div class="error-message" id="registerError"></div>
      <form id="registerForm" class="form-row">
        <input type="text" id="regLoginInput" class="input" placeholder="Логин (для входа)" required />
        <input type="password" id="regPasswordInput" class="input" placeholder="Пароль" required />
        <button type="submit" class="button">Зарегистрироваться</button>
      </form>
      <p class="toggle-link">
        Уже есть аккаунт? <span id="toLoginLink">Войти</span>
      </p>
    </div>
  `
}