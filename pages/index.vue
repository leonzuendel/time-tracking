<template>
  <div v-if="dataReady" id="content" class="has-side-bar">
    <div id="side-bar">
      <ul id="project-nav">
        <draggable v-model="projects" handle=".handle" ghost-class="ghost">
          <li
            v-for="(project, index) in projects"
            :key="project._id"
            :ref="'project-li-' + index"
            :class="isActive(project._id)"
          >
            <div
              v-if="project.title !== ''"
              class="inner"
              @click="selectProject(project._id)"
            >
              <i class="las la-braille handle"></i><i class="lar la-folder"></i
              >{{ project.title }}
            </div>
            <div v-else class="inner" @click="selectProject(project._id)">
              <i class="las la-braille handle"></i
              ><i class="lar la-folder"></i>Untitled
            </div>
            <div>
              <button
                class="delete-project"
                @click="deleteProject(index, project)"
              >
                <i class="lar la-trash-alt"></i>
              </button>
            </div>
          </li>
        </draggable>
      </ul>
      <button class="add-project" @click="addProject()">
        <i class="las la-plus-circle"></i>Add Project
      </button>
    </div>
    <div v-if="dataReady" id="inner">
      <Project
        v-if="projects && currentProject"
        :project.sync="currentProject"
        :index="currentProjectIndex"
      />
      <p v-else class="no-projects">
        Press "Add Project" to add your first project.
      </p>
    </div>
    <div v-else class="loading">Loading Data...</div>
  </div>
</template>

<script>
import Project from "@/components/Project";
import { mapState } from "vuex";
export default {
  middleware: "auth",
  name: "Projects",

  components: {
    Project
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
    ...mapState(["projects", "projectSelected"]),
    currentProject() {
      const result = this.projects.filter((obj) => {
        return obj._id === this.projectSelected;
      });
      return result[0];
    },
    currentProjectIndex() {
      return this.projects.indexOf(this.currentProject);
    }
  },

  watch: {
    projects: {
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
    if (this.projects) {
      if (this.projects[0]) {
        this.$store.dispatch("selectProject", this.projects[0]._id);
      }
    }
    this.dataReady = true;

    setInterval(function () {
      this.$store.dispatch("loadData");
    }, 60000);
  },

  methods: {
    async addProject() {
      // Boilerplate not working
      const newProject = {
        title: "",
        content: "",
        user: this.$auth.user._id,
        settings: {}
      };
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
    },

    isActive(id) {
      if (id === this.projectSelected) {
        return "active";
      }
    }
  }
};
</script>
