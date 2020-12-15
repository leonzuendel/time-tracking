// State
export const state = () => ({
  projects: [],
  times: [],
  projectSelected: 1,
  settings: {
    toDoistApiKey: "",
    toDoistEnabled: false
  }
});

export const actions = {
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
  async getTimes({ commit }) {
    await this.$axios.$get("/api/times/user/" + this.$auth.user._id).then(
      function (res) {
        commit("SET_TIMES", res);
        console.log("Times loaded from DB");
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
  async createTime({ commit }, time) {
    await this.$axios.$post("/api/times", time).then(
      function (res) {
        const createdTime = time;
        createdTime._id = res._id;
        commit("CREATE_TIME", createdTime);
        console.log("Time created in DB");
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
  async deleteTime({ commit }, data) {
    await this.$axios.$delete("/api/times/" + data.timeId).then(
      function (res) {
        commit("DELETE_TIME", data.index);
        console.log("Time deleted in DB");
      },
      function (err) {
        console.log(err);
      }
    );
  },
  selectProject({ commit }, projectId) {
    commit("SELECT_PROJECT", projectId);
  },
  async getSettings({ commit }) {
    await this.$axios
      .$get("/api/users/" + this.$auth.user._id + "/settings")
      .then(
        function (res) {
          commit("SET_SETTINGS", res);
        },
        function (err) {
          console.log(err);
        }
      );
  },
  async updateSettings({ commit }, settings) {
    await this.$axios
      .$put("/api/users/" + this.$auth.user._id, { settings })
      .then(
        function (res) {
          commit("SET_SETTINGS", settings);
          this.$auth.user.settings = settings;
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
  SET_TIMES(state, payload) {
    state.times = payload;
  },
  CREATE_PROJECT(state, payload) {
    state.projects.push(payload);
    state.projectSelected = payload._id;
  },
  CREATE_TIME(state, payload) {
    state.times.push(payload);
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
  DELETE_TIME(state, payload) {
    state.times.splice(payload, 1);
  },
  SELECT_PROJECT(state, payload) {
    state.projectSelected = payload;
  }
};

export const getters = {};

export const strict = false;
