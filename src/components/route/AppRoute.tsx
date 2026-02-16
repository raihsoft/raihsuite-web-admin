import { useEffect, useCallback } from 'react'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import { useLocation } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import type { LayoutType } from '@/@types/theme'
import type { ComponentType } from 'react'

export type AppRouteProps<T> = {
    component: ComponentType<T>
    routeKey: string
    layout?: LayoutType
}

const AppRoute = <T extends Record<string, unknown>>({
    component: Component,
    routeKey,
    ...props
}: AppRouteProps<T>) => {
    const location = useLocation()

    const { layout, setPreviousLayout, setLayout } = useThemeStore(
        (state) => state,
    )

    const { type: layoutType, previousType: previousLayout } = layout

    const setCurrentRouteKey = useRouteKeyStore(
        (state) => state.setCurrentRouteKey,
    )

    const handleLayoutChange = useCallback(() => {
        console.log('Debugging routeKey:', routeKey)
        if (routeKey === 'hrms.item1' || routeKey.startsWith('employeeDetails')) {
            console.log('Setting currentRouteKey to hrms.item1')
            setCurrentRouteKey('hrms.item1')
        } else if (routeKey === 'enquiries' || routeKey.startsWith('enquiriesDetails')) {
            console.log('Setting currentRouteKey to crm.enquiries')
            setCurrentRouteKey('enquiries')
        } else {
            console.log('Setting currentRouteKey to', routeKey)
            setCurrentRouteKey(routeKey)
        }

        if (props.layout && props.layout !== layoutType) {
            setPreviousLayout(layoutType)
            setLayout(props.layout)
        }

        if (!props.layout && previousLayout && layoutType !== previousLayout) {
            setLayout(previousLayout)
            setPreviousLayout('')
        }
        // eslint-disable-next-line react-hooks
    }, [props.layout, routeKey])

    useEffect(() => {
        handleLayoutChange()
    }, [location, handleLayoutChange])

    return <Component {...(props as T)} />
}

export default AppRoute
