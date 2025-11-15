import { postComment } from './api.js'
import { updateComments } from './comments.js'
import { escapeHtml } from './escape.js'
import { renderComments } from './renderComments.js'

const nameInput = document.querySelector('.add-form-name')
const textInput = document.querySelector('.add-form-text')
const button = document.querySelector('.add-form-button')

export const buttonCreate = button.addEventListener('click', () => {
    const name = nameInput.value.trim()
    const text = textInput.value.trim()

    if (name === '' || text === '') {
        alert('Пожалуйста, заполните все поля')
        return
    }

    //const date = new Date()
    //const formattedDate = ` ${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString().slice(-2)} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

    // const newComment = {
    //     id: Date.now(),
    //     name: name,
    //     date: formattedDate,
    //     text: text,
    //     likes: 0,
    //     isLiked: false,
    // }

    // comments.push(newComment)

    // renderComments()
    postComment(escapeHtml(text), escapeHtml(name)).then((data) => {
        updateComments(data)
        renderComments()
        nameInput.value = ''
        textInput.value = ''
    })
})
