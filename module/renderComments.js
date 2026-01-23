import { comments } from './comments.js'
import { escapeHtml } from './escape.js'
import { addEventHandlers } from './addEventHandlers.js'
import { renderLogin } from './renderLogin.js'
import { token,name } from './api.js'

const container = document.querySelector('.container')

function renderComments() {
    container.innerHTML = ''

    const commentHtml = comments
        .map((comment) => {
            return `
        <li class="comment" data-id="${comment.id}">
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
        </li>
        `
        })
        .join('')

    const addCommentsHtml = `            
            <div class="add-form">
                <input
                    type="text"
                    class="add-form-name"
                    value="${name}"
                    readonly
                />
                <textarea
                    type="textarea"
                    class="add-form-text"
                    placeholder="Введите ваш коментарий"
                    rows="4"
                ></textarea>
                <div class="add-form-row">
                    <button class="add-form-button">Написать</button>
                </div>
            </div>`
    const linkToLoginText = `<p>чтобы отправить комментарий, <span class="link-login">войдите</span></p>`
    const baseHtml = `<ul class="comments">${commentHtml}</ul>
    ${token ? addCommentsHtml : linkToLoginText}`
    container.innerHTML = baseHtml

    if (token) {
        addEventHandlers()
    } else {
        document.querySelector('.link-login').addEventListener('click', () => {
            renderLogin()
        })
    }
}

export { renderComments }
