import { comments } from './comments.js'
import { escapeHtml } from './escape.js'
import { addEventHandlers } from './addEventHandlers.js'

const commentsList = document.querySelector('.comments')

function renderComments() {
    commentsList.innerHTML = ''

    comments.forEach((comment) => {
        const commentElement = document.createElement('li')
        commentElement.className = 'comment'
        commentElement.dataset.id = comment.id

        commentElement.innerHTML = `
                    <div class="comment-header">
                        <div>${escapeHtml(comment.name)}</div>
                        <div>${comment.date}</div>
                    </div>
                    <div class="comment-body">
                        <div class="comment-text">${escapeHtml(comment.text)}</div>
                    </div>
                    <div class="comment-footer">
                        <div class="likes">
                            <span class="likes-counter">${comment.likes}</span>
                            <button class="like-button ${comment.isLiked ? '-active-like' : ''}"></button>
                        </div>
                    </div>
                `

        commentsList.appendChild(commentElement)
    })

    addEventHandlers()
}

export { renderComments }
