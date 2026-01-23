import { comments } from './comments.js'
import { escapeHtml } from './escape.js'
import { renderComments } from './renderComments.js'
import { postComment } from './api.js'

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
    const addFormButton = document.querySelector('.add-form-button')

    if (addFormButton) {
        addFormButton.addEventListener('click', () => {
            const addFormName = document.querySelector('.add-form-name')
            const addFormText = document.querySelector('.add-form-text')

            const name = addFormName.value
            const text = addFormText.value

            const originalText = addFormButton.textContent

            addFormButton.textContent = 'Отправка...'
            addFormButton.disabled = true

            postComment(text, name)
                .then((newComments) => {
                    comments.length = 0
                    comments.push(...newComments)
                    addFormText.value = ''

                    addFormButton.textContent = originalText
                    addFormButton.disabled = false

                    renderComments()
                })
                .catch((error) => {
                    console.error('Ошибка при отправке комментария:', error)
                    addFormButton.textContent = originalText
                    addFormButton.disabled = false
                })
        })
    }

    likeButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation()

            const commentElement = event.target.closest('.comment')
            const commentId = commentElement.dataset.id
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

            const commentId = commentElement.dataset.id
            const comment = comments.find((c) => c.id === commentId)
            const textInput = document.querySelector('.add-form-text')
            textInput.value = `> ${escapeHtml(comment.name)}\n\n${escapeHtml(comment.text)}\n\n`
            textInput.focus()
        })
    })
}

export { addEventHandlers }
