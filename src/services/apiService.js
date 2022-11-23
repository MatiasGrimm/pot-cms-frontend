import axios from 'axios';
import { DateTime } from 'luxon';
import store from '@/store/index';
import router from '@/router';

const service = {
  api: process.env.VUE_APP_API_URL,
 
  async getOptions(inOptions) {
    if (!inOptions?.noAuth && store.getters.user && DateTime.fromISO(store.getters.user.expires) < DateTime.now()) {
      console.log('token expired, refreshing');

      const user = await this.refreshAuth(store.getters.user.refreshToken);

      store.commit('updateUser', user);
    }

    const token = store.getters.authToken;

    if (!inOptions?.noAuth && token) {
      return {
        ...inOptions,
        headers: {
          Authorization: `Bearer ${token}`,
          ...inOptions?.headers,
        },
      };
    } else {
      return inOptions;
    }
  },
  handleResponseError(err) {
    if (err?.response?.status === 401) {
      // not authenticated, consider user logged out
      store.dispatch('LOGOUT');
      router.push('/');
    } else {
      let message, details;
      if (err.response?.data.type) {
        if (err.response.data.type === 'https://tools.ietf.org/html/rfc7231#section-6.5.1') {
          details = '';
          for (let x in err.response.data.errors) {
            details += `${x}: ${err.response.data.errors[x]}\r\n`;
          }
        }
        message = err.response.data.title;
      } else {
        message = err.message;
        details = err.response?.data;
      }
      store.commit('alert', {
        show: true,
        title: 'API error',
        color: '#AD2433',
        textColor: 'white',
        message,
        details,
      });
    }
  },
  async handleResponse(task) {
    try {
      const response = await task;

      if (response.headers['x-pagination']) {
        return {
          paging: JSON.parse(response.headers['x-pagination']),
          data: response.data,
        };
      }

      return response.data;
    } catch (err) {
      this.handleResponseError(err);
      throw err;
    }
  },

  async post(endpoint, payload, options) {
    return this.handleResponse(axios.post(`${this.api}/${endpoint}`, payload, await this.getOptions(options)));
  },
  postJsonString(endpoint, payload, options) {
    return this.post(endpoint, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
  },
  async get(endpoint, payload) {
    return this.handleResponse(axios.get(`${this.api}/${endpoint}`, await this.getOptions(payload)));
  },
  async put(endpoint, payload) {
    return this.handleResponse(axios.put(`${this.api}/${endpoint}`, payload, await this.getOptions()));
  },
  async delete(endpoint, payload) {
    return this.handleResponse(axios.delete(`${this.api}/${endpoint}`, await this.getOptions(payload)));
  },

  //Endpoints
  refreshAuth(refreshCode) {
    return this.postJsonString('auth/refresh', refreshCode, { noAuth: true });
  },
  resetPassword(username) {
    return this.postJsonString('auth/resetPassword', username, { noAuth: true });
  },
  resetPasswordToken(options) {
    return this.post('auth/resetPasswordToken', options, { noAuth: true });
  },
  changePassword(passwordChanges) {
    return this.post('auth/changePassword', passwordChanges);
  },
  activateAccount(activationChanges) {
    return this.post('auth/activate', activationChanges);
  },
  login(credentials) {
    return this.post('auth/login', credentials, { noAuth: true });
  },

  // User endpoints
  getStaffList(showAll) {
    return this.get('staff', { params: { showAll: showAll } });
  },
  getStaffById(id) {
    return this.get(`staff/${id}`);
  },
  createOrEditStaff(staff) {
    return this.put('staff', staff);
  },
  adminSendResetPassword(username) {
    return this.postJsonString('auth/resetPassword', username);
  },

  // Location endpoints
  getLocations(showAll) {
    return this.get('location', { params: { showAll: showAll } });
  },
  getLocationById(id) {
    return this.get(`location/${id}`);
  },
  createOrEditLocation(location) {
    return this.put('location', location);
  },

  //Product endpoints
  getProducts(showAll) {
    return this.get('product', { params: { showAll: showAll } })
  }

};

export default service;
