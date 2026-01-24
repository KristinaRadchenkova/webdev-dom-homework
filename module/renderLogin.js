import { login, setToken, saveAuthToStorage } from './api.js'
import { fetchAndRenderComments } from '../script.js'
import { setName } from './api.js'

export const renderLogin = () => {
    const container = document.querySelector('.container')

    const loginHTML = `
    <section class="add-form">
        <h1>Форма входа</h1>
        <div id="login-error" class="error-message" style="display: none; color: #ff6b6b; margin-bottom: 15px; padding: 10px; background: rgba(255, 107, 107, 0.1); border-radius: 8px;"></div>
    <input
        type="text"
        class="add-form-name"
        placeholder="Введите логин"
        id="login"
        required
        minlength="3"
    />
    <input
        type="password"
        class="add-form-name"
        placeholder="Введите пароль"
        id="password"
        required
        minlength="6"
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
    const errorEl = document.querySelector('#login-error')

    loginEl.addEventListener('input', validateLoginForm)
    passwordEl.addEventListener('input', validateLoginForm)

    function validateLoginForm() {
        const loginValue = loginEl.value.trim()
        const passwordValue = passwordEl.value.trim()
        
        if (loginValue.length < 3) {
            showError('Логин должен содержать минимум 3 символа')
            return false
        }
        
        if (passwordValue.length < 5) {
            showError('Пароль должен содержать минимум 5 символов')
            return false
        }
        
        clearError()
        return true
    }

    function showError(message) {
        errorEl.textContent = message
        errorEl.style.display = 'block'
        submitButtonEl.disabled = true
    }

    function clearError() {
        errorEl.style.display = 'none'
        submitButtonEl.disabled = false
    }

    submitButtonEl.addEventListener('click', () => {
        if (!validateLoginForm()) {
            return
        }

        const loginValue = loginEl.value.trim()
        const passwordValue = passwordEl.value.trim()

        submitButtonEl.disabled = true
        submitButtonEl.textContent = 'Вход...'

        login(loginValue, passwordValue)
            .then((data) => {
                setToken(data.user.token)
                setName(data.user.name)
                saveAuthToStorage(data.user.token, data.user.name)
                fetchAndRenderComments()
            })
            .catch((error) => {
                errorEl.textContent = error.message || 'Ошибка при входе. Проверьте логин и пароль.'
                errorEl.style.display = 'block'
                submitButtonEl.disabled = false
                submitButtonEl.textContent = 'Войти'
            })
    })

    const registryEl = document.querySelector('.registry')
    if (registryEl) {
        registryEl.addEventListener('click', () => {
            alert('Функция регистрации временно недоступна')
        })
    }
}