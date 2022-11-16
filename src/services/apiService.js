import axios from 'axios';
import { DateTime } from 'luxon';
import store from '@/store/index';
import router from '@/router';

const service = {
  api: process.env.VUE_APP_API_URL,
  uploadChunkSize: process.env.VUE_APP_UPLOAD_CHUNK_SIZE,

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
  getUsers(showAll) {
    return this.get('user', { params: { showAll: showAll } });
  },
  getUserById(id) {
    return this.get(`user/${id}`);
  },
  createOrEditUser(user) {
    return this.put('user', user);
  },
  adminSendResetPassword(username) {
    return this.postJsonString('auth/resetPassword', username);
  },

  // Company endpoints
  getCompanies(showAll) {
    return this.get('company', { params: { showAll: showAll } });
  },
  getCompanyById(id) {
    return this.get(`company/${id}`);
  },
  createOrEditCompany(company) {
    return this.put('company', company);
  },

  //SqlScripts endpoints
  getSqlScripts(showAll) {
    return this.get('SqlScript', { params: { showAll: showAll } });
  },
  getSqlScriptById(id) {
    return this.get(`SqlScript/${id}`);
  },
  createOrEditSqlScript(sqlScript) {
    return this.put('sqlScript', sqlScript);
  },
  uploadSqlScriptFile(file, id){
    return this.post('SqlScript/Upload', file, { params: { id: id }, headers: { 'Content-Type': 'application/json' }})
  },
  getSqlScriptFile(id){
    return this.get(`SqlScript/download/${id}`);
  },

  //ConfigurationFile endpoints
  getConfigurations(showAll) {
    return this.get('Configuration', { params: { showAll: showAll } });
  },
  getConfigurationById(id) {
    return this.get(`Configuration/${id}`);
  },
  createOrEditConfiguration(configuration) {

    let convertedConfiguration = { 
      ...configuration,
      companies: configuration.companies.map( x => ({ id : x.id })),
      configurationFiles: configuration.configurationFiles.map( x => ({ id : x.id }))
    }
    return this.put('Configuration', convertedConfiguration);
  },

  

  getLicenses(showAll){
    return this.get('License', { params: { showAll } });
  },
  getLicenseById(id) {
    return this.get(`License/${id}`);
  },
  createOrEditLicense(license) {

    let convertedLicense = { 
      ...license,
      companies: license.companies.map( x => ({ id : x.id })),
      
    }
    return this.put('License', convertedLicense);
  },

  //ConfigurationFile endpoints
  getConfigurationFiles(showAll) {
    return this.get('ConfigurationFile', { params: { showAll: showAll } });
  },
  getConfigurationFileById(id) {
    return this.get(`ConfigurationFile/${id}`);
  },
  createOrEditConfigurationFile(configurationFile) {
    return this.put('ConfigurationFile', configurationFile);
  },
  uploadConfigurationFile(file, id){
    return this.post('ConfigurationFile/Upload', file, { params: { id: id }, headers: { 'Content-Type': 'application/json' }})
  },
  getConfigurationFile(id){
    return this.get(`ConfigurationFile/download/${id}`);
  },

  //Application endpoints
  getApplications(showAll) {
    return this.get('Application', { params: { showAll: showAll } });
  },
  getApplicationById(id) {
    return this.get(`Application/${id}`);
  },
  createOrEditApplication(Application) {
    return this.put('Application', Application);
  },

  getUpdateCheckLogs(){
    return this.get('UpdateCheckLog');
  },
  getUpdateCheckLogById(id){
    return this.get(`UpdateCheckLog/${id}`);
  },

  getUpdateDownloadLogs(){
    return this.get('UpdateDownloadLog');
  },
  getUpdateDownloadLogById(id){
    return this.get(`UpdateDownloadLog/${id}`);
  },

  //ApplicationRelease endpoints
  getApplicationReleases(showAll) {
    return this.get('Application/Release', { params: { showAll: showAll } });
  },
  getApplicationReleaseById(id) {
    return this.get(`Application/Release/${id}`);
  },
  createOrEditApplicationRelease(ApplicationRelease) {
    let convertedApplicationRelease = { 
      ...ApplicationRelease,
      elements: ApplicationRelease.elements.map( x => ({ id : x.id })),
      sqlScripts: ApplicationRelease.sqlScripts.map( x => ({ id : x.id })),
    }

    return this.put('Application/Release', convertedApplicationRelease);
  },

  //ApplicationElement endpoints
  getApplicationElements(showAll) {
    return this.get('Application/Element', { params: { showAll: showAll } });
  },
  getApplicationElementById(id) {
    return this.get(`Application/Element/${id}`);
  },
  createOrEditApplicationElement(ApplicationElement) {
    return this.put('Application/Element', ApplicationElement);
  },

  async uploadApplicationElementFile(file, id, onUploadProgress) {
    const chunkSize = parseInt(this.uploadChunkSize);
    let chunkCount = 0;
    const totalUploadSize = file.size;
    let totalUploaded = 0;

    console.log(`starting chunked upload of file, totalling ${totalUploadSize} bytes`);

    let fileChunkCount = file.size % chunkSize == 0 ? file.size / chunkSize : Math.floor(file.size / chunkSize) + 1;

    for (let i = 0; i < fileChunkCount; i++) {
      const chunkStart = i * chunkSize;
      let chunk = file.slice(chunkStart, chunkStart + chunkSize);

      await this.post('Application/Element/Chunk', chunk, {
        params: { id: id, chunk: chunkCount },
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress: (e) => {
          if (onUploadProgress) {
            onUploadProgress({ total: totalUploadSize, loaded: totalUploaded + e.loaded });
          }
        },
      });

      console.log(`uploading chunk ${i + 1}/${fileChunkCount} for file ${file.name} (${chunk.size} bytes)`);

      totalUploaded += chunk.size;
      if (onUploadProgress) {
        onUploadProgress({ total: totalUploadSize, loaded: totalUploaded });
      }
      chunkCount++;
    }

    console.log(`total chunks: ${chunkCount}`);

    await this.post(
      'Application/Element/finalize',
      {},
      {
        params: { id: id, size: totalUploadSize },
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};

export default service;
