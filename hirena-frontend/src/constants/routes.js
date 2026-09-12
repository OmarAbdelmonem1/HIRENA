
export const ROLE_ROUTES = {
  ADMIN: '/admin',
  COMPANY: '/company',
  JOB_SEEKER: '/profile',
};

export const getRouteByRole = (role) => {
  return ROLE_ROUTES[role] || '/welcome';
};

