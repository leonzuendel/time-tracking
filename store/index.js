// State
export const state = () => ({
  projects: [],
  projectSelected: 1,
  settings: {
    toDoistApiKey: "",
    toDoistEnabled: false
  }
});

export const actions = {
  async changeSettings({ commit }, settings) {
    await commit("SET_SETTINGS", settings);
    await this.$localForage.setItem("Settings", settings);
    console.log("Settings saved");
  },
  async getProjects({ commit }) {
    await this.$axios.$get("/api/projects/user/" + this.$auth.user._id).then(
      function (res) {
        commit("SET_PROJECTS", res);
        console.log("Projects loaded from DB");
      },
      function (err) {
        console.log(err);
      }
    );
  },
  async createProject({ commit }, project) {
    await this.$axios.$post("/api/projects", project).then(
      function (res) {
        const createdProject = project;
        createdProject._id = res._id;
        commit("CREATE_PROJECT", createdProject);
        console.log("Project created in DB");
      },
      function (err) {
        console.log(err);
      }
    );
  },
  async updateProject({ commit }, data) {
    await this.$axios
      .$put("/api/projects/" + data.project._id, data.project)
      .then(
        function (res) {
          commit("UPDATE_PROJECT", data);
          console.log("Project updated in DB");
        },
        function (err) {
          console.log(err);
        }
      );
  },
  async deleteProject({ commit }, data) {
    await this.$axios.$delete("/api/projects/" + data.projectId).then(
      function (res) {
        commit("DELETE_PROJECT", data.index);
        console.log("Project deleted in DB");
      },
      function (err) {
        console.log(err);
      }
    );
  },
  selectProject({ commit }, projectId) {
    commit("SELECT_PROJECT", projectId);
  },
  async updateSettings({ commit }, settings) {
    await this.$axios
      .$put("/api/users/" + this.$auth.user._id, { settings })
      .then(
        function (res) {
          commit("UPDATE_SETTINGS", settings);
          console.log("Project updated in DB");
        },
        function (err) {
          console.log(err);
        }
      );
  }
};

export const mutations = {
  SET_SETTINGS(state, payload) {
    state.settings = payload;
  },
  SET_PROJECTS(state, payload) {
    state.projects = payload;
  },
  CREATE_PROJECT(state, payload) {
    state.projects.push(payload);
    state.projectSelected = payload._id;
  },
  UPDATE_PROJECT(state, payload) {
    state.projects[payload.index] = payload.project;
  },
  DELETE_PROJECT(state, payload) {
    if (payload > -1) {
      if (
        state.projectSelected === state.projects[payload]._id &&
        state.projects.length > 1
      ) {
        if (payload > 0) {
          state.projectSelected = state.projects[payload - 1]._id;
        } else if (state.projects.length > 1) {
          state.projectSelected = state.projects[1]._id;
        } else {
          state.projectSelected = 0;
        }
      }
    }
    state.projects.splice(payload, 1);
  },
  SELECT_PROJECT(state, payload) {
    state.projectSelected = payload;
  },
  UPDATE_SETTINGS(state, payload) {
    state.settings = payload;
  }
};

export const getters = {};

export const strict = false;
