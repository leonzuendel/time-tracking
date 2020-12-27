// State
export const state = () => ({
  workspaces: [],
  currentWorkspace: {},
  projectSelected: 1,
  settings: {
    toDoistApiKey: "",
    toDoistEnabled: false,
    workspaceSelected: "private"
  },
  hideSideBar: false
});

export const actions = {
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  async loadData({ dispatch, state }) {
    await dispatch("getSettings");
    await dispatch("getWorkspaces");
    await dispatch("selectWorkspace", state.settings.workspaceSelected);
    await dispatch("getProjects");
    await dispatch("getTimes");
    await dispatch("getToDos");
  },
  async getWorkspaces({ commit }) {
    await this.$axios.$get("/api/workspaces/user/" + this.$auth.user._id).then(
      function (res) {
        commit("SET_WORKSPACES", res);
        console.log("Workspaces loaded from DB");
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
  async createWorkspace({ commit, dispatch, state }, workspace) {
    await this.$axios.$post("/api/workspaces", workspace).then(
      function (res) {
        const createdWorkspace = workspace;
        createdWorkspace._id = res._id;
        commit("CREATE_WORKSPACE", createdWorkspace);
        dispatch("selectWorkspace", res._id);
        dispatch("updateSettings", state.settings);
        console.log("Workspace created in DB");
      },
      function (err) {
        console.log(err);
        dispatch("createWorkspace", workspace);
      }
    );
  },
  async joinWorkspace({ commit, dispatch, state }, params) {
    await this.$axios.$post("/api/workspaces/join/invite", params).then(
      function (res) {
        const createdWorkspace = res;
        commit("CREATE_WORKSPACE", createdWorkspace);
        dispatch("selectWorkspace", res._id);
        dispatch("updateSettings", state.settings);
        console.log("User added to workspace in DB.");
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
    state.currentWorkspace.times.forEach((time, index) => {
      dispatch("updateTime", { time, index });
    });
  },
  updateToDos({ state, dispatch }) {
    state.currentWorkspace.toDos.forEach((toDo, index) => {
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
  async selectWorkspace({ commit, state, dispatch }, workspaceSelected) {
    let projects = [];
    const times = [];
    const toDos = [];

    if (workspaceSelected !== "private") {
      await this.$axios
        .$get("/api/projects/workspace/" + workspaceSelected)
        .then(
          function (res) {
            projects = res;
          },
          function (err) {
            console.log(err);
          }
        );
    } else {
      await this.$axios
        .$get("/api/projects/user/private/" + this.$auth.user._id)
        .then(
          function (res) {
            projects = res;
          },
          function (err) {
            console.log(err);
          }
        );
    }

    if (projects !== []) {
      projects.forEach((project) => {
        this.$axios.$get("/api/times/project/" + project._id).then(
          function (res) {
            res.forEach((time) => {
              time.start = new Date(time.start);
              time.end = new Date(time.end);
              times.push(time);
            });
          },
          function (err) {
            console.log(err);
          }
        );

        this.$axios.$get("/api/todos/project/" + project._id).then(
          function (res) {
            res.forEach((toDo) => {
              toDos.push(toDo);
            });
          },
          function (err) {
            console.log(err);
          }
        );
      });
    }

    let title = "";

    if (workspaceSelected !== "private") {
      title = state.workspaces.filter((obj) => {
        return obj._id === workspaceSelected;
      })[0].title;
    } else {
      title = "Private";
    }

    const workspace = {
      _id: workspaceSelected,
      title,
      projects,
      times,
      toDos
    };

    commit("SELECT_WORKSPACE", workspace);
    dispatch("updateSettings", state.settings);
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
  SET_WORKSPACES(state, payload) {
    state.workspaces = payload;
  },
  CREATE_PROJECT(state, payload) {
    state.currentWorkspace.projects.push(payload);
    state.projectSelected = payload._id;
  },
  CREATE_WORKSPACE(state, payload) {
    state.workspaces.push(payload);
    state.currentWorkspace._id = payload._id;
    state.currentWorkspace.projects = [];
  },
  CREATE_TIME(state, payload) {
    state.currentWorkspace.times.push(payload);
  },
  CREATE_TODO(state, payload) {
    state.currentWorkspace.toDos.push(payload);
  },
  UPDATE_PROJECT(state, payload) {
    state.currentWorkspace.projects[payload.index] = payload.project;
  },
  UPDATE_TIME(state, payload) {
    state.currentWorkspace.projects[payload.index] = payload.time;
  },
  UPDATE_TODO(state, payload) {
    state.currentWorkspace.toDos[payload.index] = payload.toDo;
  },
  DELETE_PROJECT(state, payload) {
    if (payload > -1) {
      if (
        state.projectSelected ===
          state.currentWorkspace.projects[payload]._id &&
        state.currentWorkspace.projects.length > 1
      ) {
        if (payload > 0) {
          state.projectSelected =
            state.currentWorkspace.projects[payload - 1]._id;
        } else if (state.currentWorkspace.projects.length > 1) {
          state.projectSelected = state.currentWorkspace.projects[1]._id;
        } else {
          state.projectSelected = 0;
        }
      }
    }
    state.currentWorkspace.projects.splice(payload, 1);
  },
  DELETE_TIME(state, payload) {
    state.currentWorkspace.times.splice(payload, 1);
  },
  DELETE_TODO(state, payload) {
    state.currentWorkspace.toDos.splice(payload, 1);
  },
  SELECT_WORKSPACE(state, payload) {
    state.currentWorkspace = payload;
    if (payload.projects.length > 0) {
      state.projectSelected = payload.projects[0]._id;
    }
    state.settings.workspaceSelected = payload._id;
  },
  SELECT_PROJECT(state, payload) {
    state.projectSelected = payload;
  },
  CHECK_TODO(state, payload) {
    if (payload.toDo.done) {
      payload.toDo.status = 0;
      payload.toDo.done = false;
      state.currentWorkspace.toDos.splice(payload.index, 1);
      state.currentWorkspace.toDos.unshift(payload.toDo);
    } else {
      payload.toDo.status = 1;
      payload.toDo.done = true;
      state.currentWorkspace.toDos.push(
        state.currentWorkspace.toDos.splice(payload.index, 1)[0]
      );
    }
  }
};

export const getters = {};

export const strict = false;
