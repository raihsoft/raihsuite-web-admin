export const getTenantId = (): string | null => {
    const tenant = localStorage.getItem('tenant')
    if (tenant) {
        return tenant
    }

    const rawSessionUser = localStorage.getItem('sessionUser')
    if (!rawSessionUser) {
        return null
    }

    try {
        const sessionUser = JSON.parse(rawSessionUser) as {
            tenant_id?: string | number
        }

        if (sessionUser?.tenant_id) {
            const tenantId = String(sessionUser.tenant_id)
            localStorage.setItem('tenant', tenantId)
            return tenantId
        }
    } catch {
        // ignore invalid sessionUser value
    }

    return null
}
