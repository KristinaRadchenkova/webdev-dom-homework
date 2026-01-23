import { renderComments } from './module/renderComments.js'
import { addEventHandlers } from './module/addEventHandlers.js'
// import { buttonCreate } from './module/button.js'
import { fetchComments } from './module/api.js'
import { updateComments } from './module/comments.js'

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderComments()
})

export const fetchAndRenderComments = () => {
    fetchComments().then((data) => {
        updateComments(data)
        renderComments()
        addEventHandlers()
    })
}
// buttonCreate()
