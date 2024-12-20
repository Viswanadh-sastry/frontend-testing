const ID_TOKEN_LOCAL_STORAGE_KEY = 'rapid-id-token'
const getIdToken = (): string | undefined => {
    if (!localStorage) {
        return
    }

    const lsValue: string | null = localStorage.getItem(ID_TOKEN_LOCAL_STORAGE_KEY)
    if (!lsValue) {
        return
    }

    try {
        const idToken: string = JSON.parse(lsValue) as string
        if (idToken) {
            // You can easily check id_token expiration also
            return idToken
        }
    } catch (error) {
        console.error('ID TOKEN LOCAL STORAGE PARSE ERROR', error)
    }
}

const setIdToken = (idToken: string) => {
    if (!localStorage) {
        return
    }

    try {
        const lsValue = JSON.stringify(idToken)
        localStorage.setItem(ID_TOKEN_LOCAL_STORAGE_KEY, lsValue)
    } catch (error) {
        console.error('ID TOKEN LOCAL STORAGE SAVE ERROR', error)
    }
}

const removeIdToken = () => {
    if (!localStorage) {
        return
    }

    try {
        localStorage.removeItem(ID_TOKEN_LOCAL_STORAGE_KEY)
    } catch (error) {
        console.error('ID TOKEN LOCAL STORAGE REMOVE ERROR', error)
    }
}

export { getIdToken, setIdToken, removeIdToken, ID_TOKEN_LOCAL_STORAGE_KEY }
