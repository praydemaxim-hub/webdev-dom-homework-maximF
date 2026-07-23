import { escapeHtml } from './utils.js'

export function renderComments(commentsList, commentsData) {
    commentsList.innerHTML = '' // очищаем список

    commentsData.forEach((comment, index) => {
        const likeClass = comment.isLiked ? '-active-like' : ''
        const newCommentHTML = `
        <li class="comment" data-index="${index}">
        <div class="comment-header">
            <div>${escapeHtml(comment.name)}</div>
            <div>${escapeHtml(comment.date)}</div>
        </div>
        <div class="comment-body">
            <div class="comment-text">
            ${escapeHtml(comment.text)}
            </div>
        </div>
        <div class="comment-footer">
            <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${likeClass}"></button>
            </div>
        </div>
        </li>`

        commentsList.insertAdjacentHTML('beforeend', newCommentHTML)
    })
}