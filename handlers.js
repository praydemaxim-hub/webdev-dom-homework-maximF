import { escapeHtml } from './utils.js'
import { renderComments } from './renderer.js'

// Обработчик кнопки «Написать»
export function handleAddComment(nameInput, textInput, commentsList, commentsData) {
    const name = nameInput.value.trim()
    const text = textInput.value.trim()

    let errorMessage = ''

    if (!name && !text) {
        errorMessage = 'Пожалуйста, заполните поля «Имя» и «Комментарий»'
    } else if (!name) {
        errorMessage = 'Пожалуйста, заполните поле «Имя»'
    } else if (!text) {
        errorMessage = 'Пожалуйста, заполните поле «Комментарий»'
    }

    if (errorMessage) {
        alert(errorMessage)
        return
    }

    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')

    const dateTimeString = `${day}.${month}.${year} ${hours}:${minutes}`

    commentsData.push({
        name,
        date: dateTimeString,
        text,
        likes: 0,
        isLiked: false,
    })

    renderComments(commentsList, commentsData)

    nameInput.value = ''
    textInput.value = ''
}

// Обработка клика по лайку
export function handleLikeClick(button, commentsData, commentsList) {
    const commentElement = button.closest('.comment')
    const index = Number(commentElement.getAttribute('data-index'))

    if (isNaN(index) || index < 0 || index >= commentsData.length) return

    const comment = commentsData[index]
    if (comment.isLiked) {
        comment.likes--
        comment.isLiked = false
    } else {
        comment.likes++
        comment.isLiked = true
    }

    renderComments(commentsList, commentsData)
}


// Обработка клика для ответа на комментарий
export function handleReplyClick(commentElement, nameInput, textInput, commentsData) {
    const index = Number(commentElement.getAttribute('data-index'))
    if (isNaN(index) || index < 0 || index >= commentsData.length) return

    const comment = commentsData[index]

    nameInput.value = comment.name
    textInput.value = `> ${escapeHtml(comment.text)}\n`
}

// Навешивание всех обработчиков на DOM
export function attachHandlers(addButton, commentsList, nameInput, textInput, commentsData) {
    addButton.addEventListener('click', () => {
        handleAddComment(nameInput, textInput, commentsList, commentsData)
    })

    commentsList.addEventListener('click', (event) => {
        const likeButton = event.target.closest('.like-button')
        if (likeButton) {
            handleLikeClick(likeButton, commentsData, commentsList)
            return
        }

        const commentElement = event.target.closest('.comment')
        if (commentElement) {
            handleReplyClick(commentElement, nameInput, textInput, commentsData)
        }
    })
}