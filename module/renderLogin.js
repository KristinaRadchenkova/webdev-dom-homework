import { login, registration, setToken, saveAuthToStorage } from './api.js'
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
        
        if (passwordValue.length < 6) {
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
            renderRegistration()
        })
    }
}

const renderRegistration = () => {
    const container = document.querySelector('.container')

    const registrationHTML = `
    <section class="add-form">
        <h1>Форма регистрации</h1>
        <div id="registration-error" class="error-message" style="display: none; color: #ff6b6b; margin-bottom: 15px; padding: 10px; background: rgba(255, 107, 107, 0.1); border-radius: 8px;"></div>
        <input
            type="text"
            class="add-form-name"
            placeholder="Введите имя"
            id="reg-name"
            required
            minlength="3"
        />
        <input
            type="text"
            class="add-form-name"
            placeholder="Введите логин"
            id="reg-login"
            required
            minlength="3"
        />
        <input
            type="password"
            class="add-form-name"
            placeholder="Введите пароль"
            id="reg-password"
            required
            minlength="6"
        >
        <fieldset class="add-form-registry">
            <button class="add-form-button-main button-main" type="submit">
                Зарегистрироваться
            </button>
            <u class="add-form-button-link back-to-login">
                Вернуться к входу
            </u>
        </fieldset>
    </section>
    `
    container.innerHTML = registrationHTML

    const nameEl = document.querySelector('#reg-name')
    const loginEl = document.querySelector('#reg-login')
    const passwordEl = document.querySelector('#reg-password')
    const submitButtonEl = document.querySelector('.button-main')
    const errorEl = document.querySelector('#registration-error')

    nameEl.addEventListener('input', validateRegistrationForm)
    loginEl.addEventListener('input', validateRegistrationForm)
    passwordEl.addEventListener('input', validateRegistrationForm)

    function validateRegistrationForm() {
        const nameValue = nameEl.value.trim()
        const loginValue = loginEl.value.trim()
        const passwordValue = passwordEl.value.trim()
        
        if (nameValue.length < 3) {
            showError('Имя должно содержать минимум 3 символа')
            return false
        }
        
        if (loginValue.length < 3) {
            showError('Логин должен содержать минимум 3 символа')
            return false
        }
        
        if (passwordValue.length < 6) {
            showError('Пароль должен содержать минимум 6 символов')
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
        if (!validateRegistrationForm()) {
            return
        }

        const nameValue = nameEl.value.trim()
        const loginValue = loginEl.value.trim()
        const passwordValue = passwordEl.value.trim()

        submitButtonEl.disabled = true
        submitButtonEl.textContent = 'Регистрация...'

        registration(nameValue, loginValue, passwordValue)
            .then((data) => {
                // После успешной регистрации автоматически входим
                return login(loginValue, passwordValue)
            })
            .then((data) => {
                setToken(data.user.token)
                setName(data.user.name)
                saveAuthToStorage(data.user.token, data.user.name)
                fetchAndRenderComments()
            })
            .catch((error) => {
                errorEl.textContent = error.message || 'Ошибка при регистрации'
                errorEl.style.display = 'block'
                submitButtonEl.disabled = false
                submitButtonEl.textContent = 'Зарегистрироваться'
            })
    })

    const backToLoginEl = document.querySelector('.back-to-login')
    if (backToLoginEl) {
        backToLoginEl.addEventListener('click', () => {
            renderLogin()
        })
    }
}