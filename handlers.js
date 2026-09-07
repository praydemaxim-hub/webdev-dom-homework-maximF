import { addComment } from './api.js'
import { loadComments } from './api.js'
import { renderCommentsFromApi } from './renderer.js'
import { renderLogin } from './renderLogin.js'

function delay(interval = 500) {
  return new Promise((resolve) => setTimeout(resolve, interval))
}

async function addCommentWithRetry(text, token, maxRetries = 3) {
  let lastError
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await addComment(text, token)
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
  textInput,
  commentsList,
  addForm,
  addingState,
  token
) {
  const text = textInput.value.trim()

  if (text.length < 3) {
    alert('Комментарий должен быть не короче 3 символов')
    return
  }

  addForm.style.display = 'none'
  addingState.style.display = 'block'

  try {
    await addCommentWithRetry(text, token)
    const comments = await loadComments()
    renderCommentsFromApi(commentsList, comments)
    textInput.value = ''
  } catch (err) {
    console.error(err)
    if (err.message.includes('интернет') || err instanceof TypeError) {
      alert('Кажется, у вас сломался интернет, попробуйте позже')
    } else if (err.message.includes('Сессия истекла')) {
      alert('Сессия истекла, войдите заново')
      localStorage.removeItem('userToken')
      localStorage.removeItem('userName')
      renderLogin()
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

export function handleReplyClick(commentElement, textInput) {
  const originalText = commentElement.querySelector('.comment-text').textContent
  const originalAuthor = commentElement.querySelector('.comment-header > div:first-child').textContent
  textInput.value = `> ${escapeHtml(originalAuthor)}: ${escapeHtml(originalText)}\n`
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

export function attachHandlers(
  addButton,
  commentsList,
  nameInput,
  textInput,
  addForm,
  addingState,
  token
) {
  addButton.addEventListener('click', () => {
    handleAddComment(
      textInput,
      commentsList,
      addForm,
      addingState,
      token
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
      handleReplyClick(commentElement, textInput)
    }
  })
}