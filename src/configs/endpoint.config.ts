// export const apiPrefix = 'http://127.0.0.1:8001/api/v1/auth' 

// const endpointConfig = {
//     signIn: `${apiPrefix}/login/`,
//     signOut: `${apiPrefix}/logout/`,
//     signUp: `${apiPrefix}/register/`,
//     forgotPassword: `${apiPrefix}/forgot-password/`,
//     resetPassword: `${apiPrefix}/reset-password/`,
// }

// export default endpointConfig



export const apiPrefix = '/auth'

const endpointConfig = {
    signIn: `${apiPrefix}/login/`,
    signOut: `${apiPrefix}/logout/`,
    signUp: `${apiPrefix}/register/`,
    forgotPassword: `${apiPrefix}/forgot-password/`,
    resetPassword: `${apiPrefix}/reset-password/`,
    changePassword: `${apiPrefix}/change-password/`,
}

export default endpointConfig