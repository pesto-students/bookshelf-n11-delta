const environment = {
  API_URL: process.env.REACT_APP_API_URL,
  STRIPE_API_KEY: process.env.REACT_APP_STRIPE_API_KEY,
  GUEST_EMAIL: process.env.REACT_APP_GUEST_EMAIL,
  GUEST_PASSWORD: process.env.REACT_APP_GUEST_PASSWORD,
  LOADING_DELAY: +(process.env.REACT_APP_LOADING_DELAY ?? 1000),
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
};

export default environment;
