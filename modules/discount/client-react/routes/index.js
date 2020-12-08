const base = '/discount';

const ROUTES = {
  adminPanel: base + '/admin-panel',

  add: base + '/new/:modalName/:id',
  edit: base + '/edit/:modalName/:id',
  editLink: base + '/edit/'
};

export default ROUTES;
