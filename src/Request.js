// Shared transport dispatch. Endpoint locations come from the generated methods.
const request = (httpClient, method, template, locations, params) => {
  const query = {};
  const body = {};
  const path = template.replace(/\{([^}]+)\}/g, (_, name) => {
    if (params[name] === undefined || params[name] === null || params[name] === '') {
      throw new Error(`Missing path parameter: ${name}`);
    }
    return encodeURIComponent(params[name]);
  });
  Object.keys(params).forEach((name) => {
    const value = params[name];
    if (locations.path.includes(name) || value === undefined || value === null) return;
    // Unknown fields retain the historical query/body behavior for forward compatibility.
    const target = locations.query.includes(name) || method === 'GET' || method === 'DELETE' ? query : body;
    target[name] = value;
  });
  if (method === 'POST' || method === 'PUT') {
    return httpClient[`_${method.toLowerCase()}`](path, body, query);
  }
  return httpClient[`_${method.toLowerCase()}`](path, query);
};

module.exports = { request };
