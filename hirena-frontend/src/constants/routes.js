
export const ROLE_ROUTES = {
  ADMIN: '/admin',
  COMPANY: '/company/dashboard',
  JOB_SEEKER: '/',
};

export const getRouteByRole = (role) => {
  return ROLE_ROUTES[role] || '/welcome';
};
