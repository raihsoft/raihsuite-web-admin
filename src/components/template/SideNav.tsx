import { useEffect } from 'react'
import classNames from '@/utils/classNames'
import ScrollBar from '@/components/ui/ScrollBar'
import Logo from '@/components/template/Logo'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import { useThemeStore } from '@/store/themeStore'
import { useSessionUser } from '@/store/authStore'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import navigationConfig from '@/configs/navigation.config'
import { useNavigationStore } from '@/store/navigationStore'
import appConfig from '@/configs/app.config'
import { Link } from 'react-router-dom'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    SIDE_NAV_CONTENT_GUTTER,
    HEADER_HEIGHT,
    LOGO_X_GUTTER,
} from '@/constants/theme.constant'
import type { Mode } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'

type SideNavProps = {
    translationSetup?: boolean
    background?: boolean
    className?: string
    contentClass?: string
    mode?: Mode
}

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = ({
    translationSetup = appConfig.activeNavTranslation,
    background = true,
    className,
    contentClass,
    mode,
}: SideNavProps) => {
    const defaultMode = useThemeStore((state) => state.mode)
    const direction = useThemeStore((state) => state.direction)
    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const userAuthority = useSessionUser((state) => state.user.authority)

    // Use navigation store (populated by Header on mount) to get allowed navigation
    const allowedNavigationFromStore = useNavigationStore(
        (state) => state.allowedNavigation,
    )
    const navLoading = useNavigationStore((state) => state.loading)

    // Debug: log the store value to ensure it contains the expected allowed modules
    useEffect(() => {
        // console.debug('[SideNav] allowedNavigationFromStore:', allowedNavigationFromStore)
        // console.debug('[SideNav] navLoading:', navLoading)
    }, [allowedNavigationFromStore, navLoading])

    // If the store value is null -> still loading/initial state or failed to load; do NOT default to full navigation
    // to avoid a flash of all modules. Use an empty array so the skeleton or empty menu is shown instead.
    const allowedNavigation =
        allowedNavigationFromStore === null
            ? []
            : allowedNavigationFromStore

    // Dev-only visible debug info to help verify behavior in the UI
    const renderDebugInfo = () => {
        if (process.env.NODE_ENV === 'production') return null

        return (
            <div className="p-2 text-xs text-gray-600 dark:text-gray-300">
                <div>Debug navigation state:</div>
                <div>store: {allowedNavigationFromStore === null ? 'null' : JSON.stringify(allowedNavigationFromStore.map((m:any)=>m.key))}</div>
                <div>items: {allowedNavigation.length}</div>
            </div>
        )
    }

    return (
        <div
            style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
            className={classNames(
                'side-nav',
                background && 'side-nav-bg',
                !sideNavCollapse && 'side-nav-expand',
                className,
            )}
        >
            <Link
                to={appConfig.authenticatedEntryPath}
                className="side-nav-header flex flex-col justify-center"
                style={{ height: HEADER_HEIGHT }}
            >
                <Logo
                    imgClass="max-h-10"
                    mode={mode || defaultMode}
                    type={sideNavCollapse ? 'streamline' : 'full'}
                    className={classNames(
                        sideNavCollapse && 'ltr:ml-[11.5px] ltr:mr-[11.5px]',
                        sideNavCollapse
                            ? SIDE_NAV_CONTENT_GUTTER
                            : LOGO_X_GUTTER,
                    )}
                />
            </Link>
            <div className={classNames('side-nav-content', contentClass)}>
                <ScrollBar style={{ height: '100%' }} direction={direction}>
                    <VerticalMenuContent
                        collapsed={sideNavCollapse}
                        navigationTree={allowedNavigation}
                        loading={navLoading}
                        routeKey={currentRouteKey}
                        direction={direction}
                        translationSetup={translationSetup}
                        userAuthority={userAuthority || []}
                    />
                </ScrollBar>
            </div>
        </div>
    )
}

export default SideNav
