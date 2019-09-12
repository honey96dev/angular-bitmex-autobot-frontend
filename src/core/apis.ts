const apis = {
  auth: {
    signIn: 'auth/sign-in',
    signUp: 'auth/sign-up',
  },
  dashboard: {
    priceChart: 'dashboard/price-chart',
  },
  registerBots: {
    list: 'register-bots',
    add: 'register-bots/add',
    edit: 'register-bots/edit',
    delete: 'register-bots/delete',
    activate: 'register-bots/activate',
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
    connectToExchange: 'settings/connect-to-exchange',
    loadPersonalChart: 'settings/load-personal-chart',
    savePersonalChart: 'settings/save-personal-chart',
  },
};

export {
  apis,
};
