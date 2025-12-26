import { comments } from './comments.js'
import { escapeHtml } from './escape.js'
import { renderComments } from './renderComments.js'

const textInput = document.querySelector('.add-form-text')

function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}

function addEventHandlers() {
    const likeButtons = document.querySelectorAll('.like-button')
    const commentElements = document.querySelectorAll('.comment')

    likeButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation()

            const commentElement = event.target.closest('.comment')
            const commentId = parseInt(commentElement.dataset.id)
            const comment = comments.find((c) => c.id === commentId)

            if (comment.isLikeLoading) {
                return
            }

            button.classList.add('-loading-like')

            comment.isLikeLoading = true

            delay(2000).then(() => {
                comment.likes = comment.isLiked
                    ? comment.likes - 1
                    : comment.likes + 1
                comment.isLiked = !comment.isLiked
                comment.isLikeLoading = false

                button.classList.remove('-loading-like')

                renderComments()
            })
        })
    })

    commentElements.forEach((commentElement) => {
        commentElement.addEventListener('click', (event) => {
            if (event.target.closest('.like-button')) {
                return
            }

            const commentId = parseInt(commentElement.dataset.id)
            const comment = comments.find((c) => c.id === commentId)

            textInput.value = `> ${escapeHtml(comment.name)}\n\n${escapeHtml(comment.text)}\n\n`
            textInput.focus()
        })
    })
}

export { addEventHandlers }
