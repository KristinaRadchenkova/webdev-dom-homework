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
    const addFormText = document.querySelector('.add-form-text')
    const addFormName = document.querySelector('.add-form-name')

    if (addFormButton) {
        addFormButton.addEventListener('click', () => {
            const name = addFormName.value
            const text = addFormText.value

            if (!text || text.trim().length < 5) {
                showFormError('Текст комментария слишком короткий. Минимальная длина - 5 символов')
                return
            }

            const originalText = addFormButton.textContent

            addFormButton.textContent = 'Отправка...'
            addFormButton.disabled = true

            postComment(text, name)
                .then((newComments) => {
                    comments.length = 0
                    comments.push(...newComments)
                    addFormText.value = ''
                    clearFormError()

                    addFormButton.textContent = originalText
                    addFormButton.disabled = false

                    renderComments()
                })
                .catch((error) => {
                    console.error('Ошибка при отправке комментария:', error)
                    showFormError(error.message || 'Ошибка при отправке комментария')
                    addFormButton.textContent = originalText
                    addFormButton.disabled = false
                })
        })
    }

    if (addFormText) {
        addFormText.addEventListener('input', () => {
            clearFormError()
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

function showFormError(message) {
    clearFormError()
    
    const errorDiv = document.createElement('div')
    errorDiv.className = 'form-error-message'
    errorDiv.textContent = message
    errorDiv.style.cssText = 'color: #ff6b6b; margin-top: 10px; padding: 10px; background: rgba(255, 107, 107, 0.1); border-radius: 8px;'
    
    const addForm = document.querySelector('.add-form')
    if (addForm) {
        addForm.appendChild(errorDiv)
    }
}

function clearFormError() {
    const errorDiv = document.querySelector('.form-error-message')
    if (errorDiv) {
        errorDiv.remove()
    }
}

export { addEventHandlers }