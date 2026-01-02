import { postComment } from './api.js'
import { updateComments } from './comments.js'
import { escapeHtml } from './escape.js'
import { renderComments } from './renderComments.js'

const nameInput = document.querySelector('.add-form-name')
const textInput = document.querySelector('.add-form-text')
const button = document.querySelector('.add-form-button')

const resetButtonState = () => {
    button.disabled = false
    button.textContent = 'Написать'
}

export const buttonCreate = button.addEventListener('click', () => {
    const name = nameInput.value.trim()
    const text = textInput.value.trim()

    button.disabled = true
    button.textContent = 'Отправка...'

    if (name === '' || text === '') {
        alert('Пожалуйста, заполните все поля')
        resetButtonState()
        return
    }

    postComment(escapeHtml(text), escapeHtml(name))
        .then((data) => {
            updateComments(data)
            renderComments()
            nameInput.value = ''
            textInput.value = ''
        })
        .catch((error) => {
            console.error(error)
            alert('Ошибка при отправке комментария: ' + error.message)
        })
        .finally(() => {
            resetButtonState()
        })
})
