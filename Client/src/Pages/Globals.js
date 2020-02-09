let GlobalState = {
  states: {
    darkmode: true,
    isLoggedIn: false
  },
  add(key, value) {
    this.states[key] = value;
  },
  store(key, value) {
    console.log(key, value);
    this.add(key, value);
    localStorage.setItem(key, value.toString());
  },
  get(key) {
    let local = localStorage.getItem(key);
    return local;
  },
  delete(key) {
    localStorage.removeItem(key);
  }
};

export default GlobalState;
