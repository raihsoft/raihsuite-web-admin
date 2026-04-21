// export type AppConfig = {
//     apiPrefix: string
//     authenticatedEntryPath: string
//     unAuthenticatedEntryPath: string
//     locale: string
//     accessTokenPersistStrategy: 'localStorage' | 'sessionStorage' | 'cookies'
//     enableMock: boolean
//     activeNavTranslation: boolean
// }

// const appConfig: AppConfig = {
//     apiPrefix: 'https://staging-api.raihsuite.com/v1',
//     authenticatedEntryPath: '/home',
//     unAuthenticatedEntryPath: '/sign-in',
//     locale: 'en',
//     accessTokenPersistStrategy: 'localStorage',
//     enableMock: false, 
//     activeNavTranslation: false,
// }


// export default appConfig



export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    locale: string
    accessTokenPersistStrategy: 'localStorage' | 'sessionStorage' | 'cookies'
    enableMock: boolean
    activeNavTranslation: boolean
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const appConfig = {
  apiPrefix: BASE_URL,
  authenticatedEntryPath: '/',
  unAuthenticatedEntryPath: '/sign-in',
  locale: 'en',
  accessTokenPersistStrategy: 'localStorage',
  enableMock: false,
  activeNavTranslation: false,
}

export default appConfig