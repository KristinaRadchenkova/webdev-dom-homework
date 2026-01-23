import { login, setToken } from './api.js'
import { fetchAndRenderComments } from '../script.js'
import { setName } from './api.js'

export const renderLogin = () => {
    const container = document.querySelector('.container')

    const loginHTML = `
    <section class="add-form">
        <h1>Форма входа</h1>
    <input
        type="text"
        class="add-form-name"
        placeholder="Введите логин"
        id="login"
        required
    />
    <input
        type="password"
        class="add-form-name"
        placeholder="Введите пароль"
        id="password"
        required
    >
    <fieldset class="add-form-registry">
        <button class="add-form-button-main button-main" type="submit">
            Войти</button>
        <u class="add-form-button-link registry">
        Зарегистрироваться
        </u>
     </fieldset>
    </section>
    `
    container.innerHTML = loginHTML

    const loginEl = document.querySelector('#login')
    const passwordEl = document.querySelector('#password')
    const submitButtonEl = document.querySelector('.button-main')

    submitButtonEl.addEventListener('click', () => {
        login(loginEl.value, passwordEl.value)
            .then((response) => {
                return response
            })
            .then((data) => {
                setToken(data.user.token)
                setName(data.user.name)
                fetchAndRenderComments()
            })
    })
}