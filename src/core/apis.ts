const apis = {
  auth: {
    signIn: 'auth/sign-in',
    signUp: 'auth/sign-up',
  },
  dashboard: {
    price: 'dashboard/price',
  },
  registerBots: {
    list: 'register-bots',
    add: 'register-bots/add',
    edit: 'register-bots/edit',
    delete: 'register-bots/delete',
  },
  registerApikeys: {
    list: 'register-apikeys',
    add: 'register-apikeys/add',
    edit: 'register-apikeys/edit',
    delete: 'register-apikeys/delete',
  },
  settings: {
    loadApikey: 'settings/load-apikey',
    saveApikey: 'settings/save-apikey',
    password: 'settings/password',
  },
};

export {
  apis,
};
