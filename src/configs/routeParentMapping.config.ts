/**
 * Maps detail/edit/create routes to their parent list routes
 * This ensures that when navigating to detail pages, the parent module stays highlighted in the menu
 */
export const routeParentMapping: Record<string, string> = {
    // HRMS - Employees
    'hrms.employeeDetails': 'hrms.item1',
    // Additional HRMS route keys used in employeeRoute.ts
    'employeeCreate': 'hrms.item1',
    'employeeEdit': 'hrms.item1',
    // Note: employeeRoute.ts defines a typo 'employeeDeatails' so map it too
    'employeeDeatails': 'hrms.item1',

    // CRM - Enquiries
    'enquiriesDetails': 'enquiries',

    // ASSETS - Asset
    'assetDetails': 'assets',
    'assetCreate': 'assets',
    'assetEdit': 'assets',

    // ASSETS - Asset Categories
    'assetCategoryDetails': 'assetcategories',
    'assetCategoryCreate': 'assetcategories',
    'assetCategoryEdit': 'assetcategories',

    // ASSETS - Asset Types
    'assetTypeDetails': 'assettypes',
    'assetTypeCreate': 'assettypes',
    'assetTypeEdit': 'assettypes',

    // ASSETS - Asset Type Categories
    // Note: route keys in AssetTypeCategoriesRoute use a mix of singular/plural
    'assetTypeCategoriesDetails': 'asset_type_categories',
    'assetTypeCategoryCreate': 'asset_type_categories',
    'assetTypeCategoriesEdit': 'asset_type_categories',

    // Events
    'eventDetails': 'events.list',
    'eventCreate': 'events.list',
    'eventEdit': 'events.list',

    // Sessions
    'events.sessionDetails': 'events.session',
    'events.sessionCreate': 'events.session',
    'sessionEdit': 'events.session',

    // Participants
    'events.participantDetails': 'events.participants',
    'events.participantCreate': 'events.participants',
    'participantEdit': 'events.participants',

    // Session Attendance
    // Route keys here vary between hyphen and camelCase in the routes definition
    'session-attendanceDetails': 'events.attendance',
    'sessionAttendanceCreate': 'events.attendance',
    'sessionattendanceEdit': 'events.attendance',

    // Fee Payment
    // The list route key is `events.feepayment` in routes config
    'feepaymentDetails': 'events.feepayment',
    'feepaymentCreate': 'events.feepayment',
    'feepaymentListEdit': 'events.feepayment',
}

/**
 * Gets the parent route key for a given route
 * Returns the route key itself if no parent mapping exists
 */
export function getParentRouteKey(routeKey: string): string {
    return routeParentMapping[routeKey] || routeKey
}
