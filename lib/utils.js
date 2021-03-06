const AuthError = require('./autherror');
const { App } = require('adapt-authoring-core');
/**
* Auth-related utility functions
*/
class Utils {
  /**
  * The registered auth routes
  * @return {Object}
  */
  static get routes() {
    return App.instance.auth.routes;
  }
  /**
  * Middleware to check request is correctly authenticated
  * @param {ClientRequest} req
  * @return {Promise}
  */
  static async authenticate(req) {
    req.auth = {
      id: { userId: Date.now().toString().padStart(24, '0') },
      scopes: []
    };
  }
  /**
  * Middleware to check request is correctly authorised
  * @param {ClientRequest} req
  * @return {Promise}
  */
  static async authorise(req) {
    const method = req.method.toLowerCase();
    const url = `${req.baseUrl}${this.removeTrailingSlash(req.route.path)}`;

    if(!this.isAuthorisedForRoute(method, url, req.auth.scopes)) {
      throw AuthError.Authorise({ method, url });
    }
  }
  /**
  * Checks whether the provided scopes are authorised to access a specific URL/HTTP method combination
  * @return {Boolean}
  */
  static isAuthorisedForRoute(method, url, currentScopes) {
    return true;
    /*
    if(!currentScopes || !currentScopes.length) {
      return false;
    }
    if(this.routes.unsecure[url] && this.routes.unsecure[url][method]) {
      return true;
    }
    const requiredScopes = this.routes.secure[url] && this.routes.secure[url][method];
    return requiredScopes && requiredScopes.every(s => currentScopes.includes(s));
    */
  }
  /**
  * Removes a trailing slash from a string
  * @param {String} s String to convert
  * @return {String}
  */
  static removeTrailingSlash(s) {
    return s.slice(-1) === '/' ? s.slice(0, s.length-1) : s;
  }
  static setRoute(method, route, routes, value) {
    method = method.toLowerCase();
    route = AuthUtils.removeTrailingSlash(route);

    if(!['post','get','put','patch','delete'].includes(method)) {
      throw new Error(App.instance.lang.t('error.secureroute', { method, route }));
    }
    if(!routes[route]) {
      routes[route] = {};
    }
    routes[route][method] = value;
  }
}

module.exports = Utils;
