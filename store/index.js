// State
export const state = () => ({
  projects: [],
  times: [],
  toDos: [],
  projectSelected: 1,
  settings: {
    toDoistApiKey: "",
    toDoistEnabled: false
  },
  hideSideBar: false
});

export const actions = {
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  async loadData({ dispatch }) {
    await dispatch("getSettings");
    await dispatch("getProjects");
    await dispatch("getTimes");
    await dispatch("getToDos");
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
  async getToDos({ commit }) {
    await this.$axios.$get("/api/todos/user/" + this.$auth.user._id).then(
      function (res) {
        commit("SET_TODOS", res);
        console.log("ToDos loaded from DB");
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
  async createToDo({ commit }, toDo) {
    await this.$axios.$post("/api/todos", toDo).then(
      function (res) {
        const createdToDo = toDo;
        createdToDo._id = res._id;
        commit("CREATE_TODO", createdToDo);
        console.log("ToDO created in DB");
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
  updateTimes({ state, dispatch }) {
    state.times.forEach((time, index) => {
      dispatch("updateTime", { time, index });
    });
  },
  updateToDos({ state, dispatch }) {
    state.toDos.forEach((toDo, index) => {
      dispatch("updateToDo", { toDo, index });
    });
  },
  async updateTime({ commit }, data) {
    await this.$axios.$put("/api/times/" + data.time._id, data.time).then(
      function (res) {
        commit("UPDATE_TIME", data);
        console.log("Time updated in DB");
      },
      function (err) {
        console.log(err);
      }
    );
  },
  async updateToDo({ commit }, data) {
    await this.$axios.$put("/api/todos/" + data.toDo._id, data.toDo).then(
      function (res) {
        commit("UPDATE_TODO", data);
        console.log("ToDo updated in DB");
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
  async deleteToDo({ commit }, data) {
    await this.$axios.$delete("/api/todos/" + data.toDoId).then(
      function (res) {
        commit("DELETE_TODO", data.index);
        console.log("ToDo deleted in DB");
      },
      function (err) {
        console.log(err);
      }
    );
  },
  selectProject({ commit }, projectId) {
    commit("SELECT_PROJECT", projectId);
  },
  checkToDo({ commit }, data) {
    commit("CHECK_TODO", data);
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
  TOGGLE_SIDEBAR(state) {
    state.hideSideBar = !state.hideSideBar;
  },
  SET_SETTINGS(state, payload) {
    state.settings = payload;
  },
  SET_PROJECTS(state, payload) {
    state.projects = payload;
  },
  async SET_TIMES(state, payload) {
    await payload.forEach((time) => {
      time.start = new Date(time.start);
      time.end = new Date(time.end);
    });
    state.times = payload;
  },
  SET_TODOS(state, payload) {
    state.toDos = payload;
  },
  CREATE_PROJECT(state, payload) {
    state.projects.push(payload);
    state.projectSelected = payload._id;
  },
  CREATE_TIME(state, payload) {
    state.times.push(payload);
  },
  CREATE_TODO(state, payload) {
    state.toDos.push(payload);
  },
  UPDATE_PROJECT(state, payload) {
    state.projects[payload.index] = payload.project;
  },
  UPDATE_TIME(state, payload) {
    state.projects[payload.index] = payload.time;
  },
  UPDATE_TODO(state, payload) {
    state.toDos[payload.index] = payload.toDo;
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
  DELETE_TODO(state, payload) {
    state.toDos.splice(payload, 1);
  },
  SELECT_PROJECT(state, payload) {
    state.projectSelected = payload;
  },
  CHECK_TODO(state, payload) {
    if (payload.toDo.done) {
      payload.toDo.status = 0;
      payload.toDo.done = false;
      state.toDos.splice(payload.index, 1);
      state.toDos.unshift(payload.toDo);
    } else {
      payload.toDo.status = 1;
      payload.toDo.done = true;
      state.toDos.push(state.toDos.splice(payload.index, 1)[0]);
    }
  }
};

export const getters = {};

export const strict = false;
