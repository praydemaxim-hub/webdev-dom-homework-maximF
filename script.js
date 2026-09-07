import { renderCommentsPage } from './renderCommentsPage.js'
import { renderLogin } from './renderLogin.js'

const token = localStorage.getItem('userToken')

if (token) {
  renderCommentsPage()
} else {
  // Показываем ленту без формы — там будет ссылка на логин
  renderCommentsPage()
}