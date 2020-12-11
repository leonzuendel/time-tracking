// State
export const state = () => ({
  settings: {
    ToDoistApiKey: ""
  }
});

export const actions = {
  async changeSettings({ commit }, settings) {
    await commit("SET_SETTINGS", settings);
    await this.$localForage.setItem("Settings", settings);
    console.log("Settings saved");
  }
};

export const mutations = {
  SET_SETTINGS(state, payload) {
    state.settings = payload;
  }
};

export const getters = {};

export const strict = false;
