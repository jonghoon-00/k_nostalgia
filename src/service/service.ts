import AddressAPI from './address.service';
import AuthAPI from './auth.service';

class API {
  auth;
  address;

  constructor() {
    this.auth = new AuthAPI();
    this.address = new AddressAPI();
  }
}

const api = new API();

export default api;