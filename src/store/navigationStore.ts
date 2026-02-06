import { create } from 'zustand'
import type { NavigationTree } from '@/@types/navigation'
import { getAllowedNavigation } from '@/configs/navigation.config/getAllowedNavigation'

type NavigationState = {
    allowedNavigation: NavigationTree[] | null
    loading: boolean
    loadAllowedNavigation: () => Promise<void>
    setAllowedNavigation: (nav: NavigationTree[] | null) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
    allowedNavigation: null,
    loading: false,
    setAllowedNavigation: (nav) => {
        console.debug('[navigationStore] setAllowedNavigation', nav)
        set(() => ({ allowedNavigation: nav }))
    },
    loadAllowedNavigation: async () => {
        console.debug('[navigationStore] loadAllowedNavigation start')
        set(() => ({ loading: true }))
        try {
            const nav = await getAllowedNavigation()
            console.debug('[navigationStore] loadAllowedNavigation received', nav)
            set(() => ({ allowedNavigation: nav }))
        } catch (err) {
            console.error('[navigationStore] loadAllowedNavigation failed', err)
            set(() => ({ allowedNavigation: null }))
        } finally {
            set(() => ({ loading: false }))
        }
    },
}))
