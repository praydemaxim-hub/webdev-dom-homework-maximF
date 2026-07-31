import { addComment } from './api.js'
import { loadComments } from './api.js'
import { renderCommentsFromApi } from './renderer.js'

function delay(interval = 500) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), interval)
  })
}

// Автоповтор при 500
async function addCommentWithRetry(name, text, maxRetries = 3) {
  let lastError
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await addComment(name, text)
    } catch (err) {
      lastError = err
      if (err.message === 'Сервер сломался, попробуй позже') {
        if (i < maxRetries) {
          await delay(500)
          continue
        }
      } else {
        break
      }
    }
  }
  throw lastError
}

export async function handleAddComment(
  nameInput,
  textInput,
  commentsList,
  addForm,
  addingState,
) {
  const name = nameInput.value.trim()
  const text = textInput.value.trim()

  // Валидация не короче 3 символов
  if (name.length < 3 || text.length < 3) {
    alert('Имя и комментарий должны быть не короче 3 символов')
    return // поля НЕ очищаем — значения остаются в форме
  }

  addForm.style.display = 'none'
  addingState.style.display = 'block'

  try {
    await addCommentWithRetry(name, text)

    const comments = await loadComments(commentsList)
    renderCommentsFromApi(commentsList, comments)

    // Очищаем поля только при успехе
    nameInput.value = ''
    textInput.value = ''
  } catch (err) {
    console.error(err)

    // Обработка «нет интернета»
    if (
      err instanceof TypeError ||
      (err.name === 'DOMException' && err.message.includes('network'))
    ) {
      alert('Кажется, у вас сломался интернет, попробуйте позже')
    } else {
      alert(err.message)
    }
  } finally {
    addForm.style.display = 'block'
    addingState.style.display = 'none'
  }
}

export async function handleLikeClick(button) {
  if (button.classList.contains('-loading-like')) return

  const commentElement = button.closest('.comment')
  const counterSpan = commentElement.querySelector('.likes-counter')
  const currentLikes = parseInt(counterSpan.textContent, 10) || 0
  const isLikedNow = button.classList.contains('-active-like')

  button.classList.add('-loading-like')
  button.classList.remove('-active-like')

  await delay(1500)

  const newLikes = isLikedNow ? currentLikes - 1 : currentLikes + 1
  const newIsLiked = !isLikedNow

  counterSpan.textContent = String(newLikes)
  if (newIsLiked) button.classList.add('-active-like')
  button.classList.remove('-loading-like')
}

export function handleReplyClick(commentElement, nameInput, textInput) {
  const originalText =
    commentElement.querySelector('.comment-text').textContent
  const originalAuthor = commentElement.querySelector(
    '.comment-header > div:first-child',
  ).textContent

  textInput.value = `> ${escapeHtml(originalAuthor)}: ${escapeHtml(originalText)}\n`
}

export function attachHandlers(
  addButton,
  commentsList,
  nameInput,
  textInput,
  addForm,
  addingState,
) {
  addButton.addEventListener('click', () => {
    handleAddComment(
      nameInput,
      textInput,
      commentsList,
      addForm,
      addingState,
    )
  })

  commentsList.addEventListener('click', (event) => {
    const likeButton = event.target.closest('.like-button')
    if (likeButton) {
      handleLikeClick(likeButton)
      return
    }

    const commentElement = event.target.closest('.comment')
    if (commentElement) {
      handleReplyClick(commentElement, nameInput, textInput)
    }
  })
}

function escapeHtml(str) {
  if (!str) return ''
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
