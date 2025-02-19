import { LORAAuthModel } from './_models';

const LORA_AUTH_LOCAL_STORAGE_KEY = 'rapid-lora-auth'
const getLORAAuth = (): LORAAuthModel | undefined => {
    if (!localStorage) {
        return
    }

    const lsValue: string | null = localStorage.getItem(LORA_AUTH_LOCAL_STORAGE_KEY)
    if (!lsValue) {
        return
    }

    try {
        const auth: LORAAuthModel = JSON.parse(lsValue) as LORAAuthModel
        if (auth) {
            // You can easily check auth_token expiration also
            return auth
        }
    } catch (error) {
        console.error('LORA AUTH LOCAL STORAGE PARSE ERROR', error)
    }
}

const setLORAAuth = (auth: LORAAuthModel) => {
    if (!localStorage) {
        return
    }

    try {
        const lsValue = JSON.stringify(auth)
        localStorage.setItem(LORA_AUTH_LOCAL_STORAGE_KEY, lsValue)
    } catch (error) {
        console.error('LORA AUTH LOCAL STORAGE SAVE ERROR', error)
    }
}

const removeLORAAuth = () => {
    if (!localStorage) {
        return
    }

    try {
        localStorage.removeItem(LORA_AUTH_LOCAL_STORAGE_KEY)
    } catch (error) {
        console.error('LORA AUTH LOCAL STORAGE REMOVE ERROR', error)
    }
}

export { getLORAAuth, setLORAAuth, removeLORAAuth, LORA_AUTH_LOCAL_STORAGE_KEY }
