export const ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        ME: "/auth/me",
    },

    CARS: {
        LIST: "/cars",
        MY: "/cars/my",
        BY_ID: (id) => `/cars/${id}`,
        CREATE: "/cars",
    },

    LOCATIONS: {
        LIST: "/locations",
        BY_ID: (id) => `/locations/${id}`,
    },

    BOOKINGS: {
        CREATE: "/bookings",
        MY: "/bookings/my",
        CONFIRM: (id) => `/bookings/${id}/confirm`,
        CANCEL: (id) => `/bookings/${id}/cancel`,
    },

    ADMIN: {
        USERS: "/admin/users",
        UPDATE_ROLES: (id, rolesCsv) => `/admin/users/${id}/roles?roles=${rolesCsv}`,
    }
};
