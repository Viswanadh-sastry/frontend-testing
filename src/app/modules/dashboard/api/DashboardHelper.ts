const DASH_LOCAL_STORAGE_KEY = 'rapid-dashboard'

const getDashboard = (): any => {
    if (!localStorage) {
        return
    }

    const lsValue: string | null = localStorage.getItem(DASH_LOCAL_STORAGE_KEY)
    if (!lsValue) {
        return
    }

    try {
        const dash: any = JSON.parse(lsValue) as any
        if (dash) {
            return dash
        }
    } catch (error) {
        console.error('DASH LOCAL STORAGE PARSE ERROR', error)
    }
}

const setDashboard = (dash: any) => {
    if (!localStorage) {
        return
    }

    try {
        const lsValue = JSON.stringify(dash)
        localStorage.setItem(DASH_LOCAL_STORAGE_KEY, lsValue)
    } catch (error) {
        console.error('DASH LOCAL STORAGE SAVE ERROR', error)
    }
}

const clearDashboard = () => {
    if (!localStorage) {
        return
    }

    try {
        localStorage.removeItem(DASH_LOCAL_STORAGE_KEY)
    } catch (error) {
        console.error('DASH LOCAL STORAGE REMOVE ERROR', error)
    }
}

const addDashboard = (dash: any) => {
    if (!localStorage) {
        return
    }

    try {
        const dashboards = getDashboard()
        if (dashboards) {
            dashboards.push(dash)
            const lsValue = JSON.stringify(dashboards)
            localStorage.setItem(DASH_LOCAL_STORAGE_KEY, lsValue)
        }
        return dashboards
    } catch (error) {
        console.error('DASH LOCAL STORAGE ADD ERROR', error)
    }
}

const editDashboard = (dash: any) => {
    if (!localStorage) {
        return
    }

    try {
        const dashboards = getDashboard()
        if (dashboards) {
            const index = dashboards.findIndex((d: any) => d.id === dash.id)
            dashboards[index] = dash
            const lsValue = JSON.stringify(dashboards)
            localStorage.setItem(DASH_LOCAL_STORAGE_KEY, lsValue)
        }
        return dashboards
    } catch (error) {
        console.error('DASH LOCAL STORAGE EDIT ERROR', error)
    }
}

const removeDashboard = (dash: any) => {
    if (!localStorage) {
        return
    }

    try {
        const dashboards = getDashboard()
        if (dashboards) {
            const index = dashboards.findIndex((d: any) => d.id === dash.id)
            dashboards.splice(index, 1)
            const lsValue = JSON.stringify(dashboards)
            localStorage.setItem(DASH_LOCAL_STORAGE_KEY, lsValue)
        }
        return dashboards
    } catch (error) {
        console.error('DASH LOCAL STORAGE REMOVE ERROR', error)
    }
}

const getDashboardById = (id: string) => {
    if (!localStorage) {
        return
    }

    const dashboards = getDashboard()
    if (dashboards) {
        return dashboards.find((d: any) => d.id === id)
    }
}

export { getDashboard, setDashboard, clearDashboard, addDashboard, editDashboard, removeDashboard, getDashboardById, DASH_LOCAL_STORAGE_KEY }
