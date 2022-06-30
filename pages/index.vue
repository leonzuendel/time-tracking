<template>
  <div>
    <div
      v-if="dataReady"
      id="content"
      class="has-side-bar"
      :class="{ 'hidden-side-bar': hideSideBar }"
    >
      <div id="side-bar" :class="{ hidden: hideSideBar }">
        <div class="side-bar-toggle" @click="$store.dispatch('toggleSideBar')">
          <i v-if="!hideSideBar" class="las la-minus"></i>
          <i v-if="hideSideBar" class="las la-bars"></i>
        </div>
        <div v-if="!hideSideBar" class="not-hidden">
          <h2>Projects</h2>
          <ul id="project-nav">
            <draggable v-model="projects" handle=".handle" ghost-class="ghost">
              <li
                v-for="(project, index) in currentWorkspace.projects"
                :key="project._id"
                :ref="'project-li-' + index"
                :class="isActive(project._id)"
              >
                <div class="inner" @click="selectProject(project._id)">
                  <i class="las la-braille handle"></i>
                  <div
                    class="project-color"
                    :style="{ backgroundColor: projectColor(project.color) }"
                  ></div>
                  {{ project.title ? project.title : "Untitled" }}
                </div>
                <div>
                  <el-button
                    class="delete-project"
                    @click="deleteProject(index, project)"
                  >
                    <i class="lar la-trash-alt"></i>
                  </el-button>
                </div>
              </li>
            </draggable>
          </ul>
          <el-button class="add-project" @click="addProject()">
            <i class="las la-plus-circle"></i>Add Project
          </el-button>
        </div>
      </div>
      <div v-if="dataReady" id="inner">
        <Project
          v-if="currentWorkspace.projects && currentProject"
          :project.sync="currentProject"
          :index="currentProjectIndex"
        />
        <p v-else class="no-projects"></p>
      </div>
      <div v-else class="loading">Loading Data...</div>
    </div>
    <Loader v-else />
  </div>
</template>

<script>
import Project from "@/components/Project";
import Loader from "@/components/Loader";
import { mapState } from "vuex";
export default {
  middleware: "auth",
  name: "Projects",

  components: {
    Project,
    Loader
  },

  data() {
    return {
      dataReady: false,
      projectBoilerplate: {
        title: "",
        content: "",
        times: [],
        toDos: [],
        id: 1,
        settings: {
          ToDoistProject: "",
          syncedToDoistProject: undefined
        }
      },
      projectIdCount: 1
    };
  },

  computed: {
    ...mapState([
      "currentWorkspace",
      "projectSelected",
      "hideSideBar",
      "settings"
    ]),
    currentProject() {
      const result = this.currentWorkspace.projects.filter((obj) => {
        return obj._id === this.projectSelected;
      });
      return result[0];
    },
    currentProjectIndex() {
      return this.currentWorkspace.projects.indexOf(this.currentProject);
    }
  },

  watch: {
    "currentWorkspace.projects": {
      handler(val) {
        this.$store.dispatch("updateProject", {
          project: this.currentProject,
          index: this.currentProjectIndex
        });
      },
      deep: true
    }
  },

  async mounted() {
    if (!this.$auth.user) {
      this.$router.push("/user/login");
    }
    await this.$store.dispatch("loadData");
    // const projects = await this.$localForage.getItem("Projects");
    if (this.currentWorkspace.projects) {
      if (this.currentWorkspace.projects[0]) {
        this.$store.dispatch(
          "selectProject",
          this.currentWorkspace.projects[0]._id
        );
      }
    }
    this.dataReady = true;
  },

  methods: {
    async addProject() {
      // Boilerplate not working
      const newProject = {
        title: "",
        content: "",
        users: [{ id: this.$auth.user._id, role: "owner" }],
        settings: {},
        color: this.randomColor()
      };

      if (this.settings.workspaceSelected !== "private") {
        newProject.workspace = this.settings.workspaceSelected;
        newProject.private = false;
      } else {
        newProject.private = true;
      }
      // this.saveProjects();
      await this.$store.dispatch("createProject", newProject);
    },

    deleteProject(index, project) {
      this.$store.dispatch("deleteProject", {
        projectId: project._id,
        index
      });
      // this.projects.splice(index, 1);
    },

    selectProject(id) {
      this.$store.dispatch("selectProject", id);
      this.$store.dispatch("loadData");
    },

    isActive(id) {
      if (id === this.projectSelected) {
        return "active";
      }
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomColor() {
      let color = "";
      const number = this.getRandomInt(1, 5);
      switch (number) {
        case 1:
          color = "red";
          break;
        case 2:
          color = "blue";
          break;
        case 3:
          color = "green";
          break;
        case 4:
          color = "yellow";
          break;
        case 5:
          color = "orange";
          break;
      }
      return color;
    },
    projectColor(color) {
      return "var(--project-color-" + color;
    }
  }
};
</script>
