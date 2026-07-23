import { commentsData } from './data.js'
import { renderComments } from './renderer.js'
import { attachHandlers } from './handlers.js'

const nameInput = document.querySelector('.add-form-name')
const textInput = document.querySelector('.add-form-text')
const addButton = document.querySelector('.add-form-button')
const commentsList = document.querySelector('.comments')

// Первоначальная отрисовка
renderComments(commentsList, commentsData)

// Навешиваем обработчики
attachHandlers(addButton, commentsList, nameInput, textInput, commentsData)