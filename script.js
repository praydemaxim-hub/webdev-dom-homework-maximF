import { attachHandlers } from './handlers.js'
import { loadComments } from './api.js'
import { renderCommentsFromApi } from './renderer.js'

const nameInput = document.querySelector('.add-form-name')
const textInput = document.querySelector('.add-form-text')
const addButton = document.querySelector('.add-form-button')
const commentsList = document.getElementById('commentsList')
const loadingState = document.getElementById('loadingState')
const addingState = document.getElementById('addingState')
const addForm = document.getElementById('addForm')

// При запуске показываем состояние загрузки
loadingState.style.display = 'block'

loadComments(commentsList)
    .then((comments) => {
        renderCommentsFromApi(commentsList, comments)
    })
    .catch((err) => {
        console.error('Ошибка загрузки комментариев:', err)
        alert('Не удалось загрузить комментарии. Проверьте консоль.')
    })
    .finally(() => {
        loadingState.style.display = 'none'
    })

// Навешиваем обработчики событий
attachHandlers(
    addButton,
    commentsList,
    nameInput,
    textInput,
    addForm,
    addingState,
)
