import { renderComments } from './renderComments.js'
import { addEventHandlers } from './addEventHandlers.js'
import { buttonCreate } from './button.js'

buttonCreate
document.addEventListener('DOMContentLoaded', () => {
    renderComments()
    addEventHandlers()
})
