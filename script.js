import { renderComments } from './module/renderComments.js'
import { addEventHandlers } from './module/addEventHandlers.js'
import { buttonCreate } from './module/button.js'
import { fetchComments } from './module/api.js'
import { comments, updateComments } from './module/comments.js'
buttonCreate
document.addEventListener('DOMContentLoaded', () => {
    renderComments()
    addEventHandlers()
})

fetchComments().then((data) => {
    updateComments(data)
    console.log(comments)
    renderComments()
})
