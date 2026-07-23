const axios = require('axios');

/**
 * Creates an Axios instance with standard Angel One headers and retry logic.
 */
const createAngelAxios = (baseURL, apiKey) => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'X-PrivateKey': apiKey,
      'X-UserType': 'USER',
      'X-SourceID': 'WEB',
      'X-ClientLocalIP': '127.0.0.1',
      'X-ClientPublicIP': '127.0.0.1',
      'X-MACAddress': '00:00:00:00:00:00',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request logging
  instance.interceptors.request.use((config) => {
    console.log(`[AngelAxios] Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  }, (error) => Promise.reject(error));

  // Simple retry interceptor
  instance.interceptors.response.use(
    (response) => {
      console.log(`[AngelAxios] Response Success: ${response.config.url} [${response.status}]`);
      return response;
    },
    async (error) => {
      const { config, response } = error;

      console.error(`[AngelAxios] Response Error: ${config?.url} [${response?.status || 'NETWORK_ERROR'}]`, response?.data || error.message);

      // Retry logic
      if (!config || !config.retryCount) {
        config.retryCount = 0;
      }

      const maxRetries = 3;
      const backoffDelay = Math.pow(2, config.retryCount) * 1000;

      if (config.retryCount < maxRetries && (!response || response.status >= 500)) {
        config.retryCount += 1;
        console.log(`Retrying request... Attempt ${config.retryCount} after ${backoffDelay}ms`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return instance(config);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

module.exports = createAngelAxios;
