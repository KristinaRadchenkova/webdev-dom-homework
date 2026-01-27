const host = 'https://wedev-api.sky.pro/api/v2/kristina-boykova'

const authost = 'https://wedev-api.sky.pro/api/user'

export let token = ''

export const setToken = (newToken) => {
    token = newToken
}

export let name = ''

export const setName = (newName) => {
    name = newName
}

export const saveAuthToStorage = (userToken, userName) => {
    localStorage.setItem('authToken', userToken);
    localStorage.setItem('userName', userName);
};

export const clearAuthFromStorage = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
};

export const loadAuthFromStorage = () => {
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName');
    
    if (token && name) {
        setToken(token);
        setName(name);
        return true;
    }
    return false;
};

const fetchWithRetry = (url, options = {}, retries = 3, delay = 1000) => {
    return new Promise((resolve, reject) => {
        const attempt = (remainingRetries) => {
            fetch(url, options)
                .then((response) => {
                    if (response.status === 500 && remainingRetries > 0) {
                        setTimeout(() => {
                            console.log(
                                `Повторная попытка запроса, осталось попыток: ${remainingRetries - 1}`,
                            )
                            attempt(remainingRetries - 1)
                        }, delay)
                    } else {
                        resolve(response)
                    }
                })
                .catch((error) => {
                    if (remainingRetries > 0) {
                        setTimeout(() => {
                            console.log(
                                `Повторная попытка запроса после сетевой ошибки, осталось попыток: ${remainingRetries - 1}`,
                            )
                            attempt(remainingRetries - 1)
                        }, delay)
                    } else {
                        reject(error)
                    }
                })
        }

        attempt(retries)
    })
}

export const fetchComments = () => {
    return fetchWithRetry(host + '/comments')
        .then((response) => {
            if (response.status === 500) {
                return Promise.reject(
                    new Error(
                        'Серверная ошибка. Пожалуйста, попробуйте позже.',
                    ),
                )
            }
            if (!response.ok) {
                return Promise.reject(
                    new Error(`Ошибка сервера: ${response.status}`),
                )
            }
            return response.json()
        })
        .then((data) => {
            console.log(data)
            const appComments = data.comments.map((comment) => {
                return {
                    id: comment.id,
                    name: comment.author.name,
                    date: new Date(comment.date).toLocaleString(),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                }
            })
            return appComments
        })
        .catch((error) => {
            if (
                (error.message &&
                    (error.message.includes('Failed to fetch') ||
                        error.message.includes('NetworkError'))) ||
                !navigator.onLine
            ) {
                return Promise.reject(
                    new Error(
                        'Проблемы с интернетом. Проверьте подключение и попробуйте снова.',
                    ),
                )
            }

            if (error instanceof Error) {
                return Promise.reject(error)
            }

            return Promise.reject(
                new Error(
                    'Произошла неизвестная ошибка. Пожалуйста, попробуйте позже.',
                ),
            )
        })
}

export const postComment = (text, name, forceError = false) => {
    const requestData = {
        text: text.trim(),
        name: name.trim(),
    }

    if (forceError) {
        requestData.forceError = true
    }

    return fetchWithRetry(host + '/comments', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
    })
        .then((response) => {
            if (response.status === 401) {
                return Promise.reject(
                    new Error('Сессия истекла. Пожалуйста, войдите снова.'),
                )
            }
            if (response.status === 400) {
                return response.json().then((errorData) => {
                    return Promise.reject(
                        new Error(errorData.error || 'Ошибка валидации данных'),
                    )
                })
            }
            if (response.status === 500) {
                return Promise.reject(
                    new Error(
                        'Серверная ошибка. Пожалуйста, попробуйте позже.',
                    ),
                )
            }
            if (!response.ok) {
                return Promise.reject(
                    new Error(`Ошибка сервера: ${response.status}`),
                )
            }
            return response.json()
        })
        .then(() => {
            return fetchComments()
        })
        .catch((error) => {
            if (
                (error.message &&
                    (error.message.includes('Failed to fetch') ||
                        error.message.includes('NetworkError'))) ||
                !navigator.onLine
            ) {
                return Promise.reject(
                    new Error(
                        'Проблемы с интернетом. Комментарий не отправлен. Проверьте подключение и попробуйте снова.',
                    ),
                )
            }

            if (error instanceof Error) {
                return Promise.reject(error)
            }

            return Promise.reject(
                new Error(
                    'Ошибка при отправке комментария: ' +
                        (error.message || 'неизвестная ошибка'),
                ),
            )
        })
}

export const postCommentWithForceError = (text, name) => {
    return postComment(text, name, true)
}

export function registration(name, login, password) {
    return fetch(authost, {
        method: 'POST',
        body: JSON.stringify({
            name: name.trim(),
            login: login.trim(),
            password: password,
        }),
    }).then((response) => {
        if (!response.ok) {
            return response.json().then((errorData) => {
                throw new Error(errorData.error || `Ошибка сервера: ${response.status}`)
            })
        }
        return response.json()
    })
}

export function login(login, password) {
    return fetch(authost + '/login', {
        method: 'POST',
        body: JSON.stringify({
            login: login.trim(),
            password: password,
        }),
    }).then((response) => {
        if (!response.ok) {
            return response.json().then((errorData) => {
                throw new Error(errorData.error || 'Неверный логин или пароль')
            })
        }
        return response.json()
    })
}