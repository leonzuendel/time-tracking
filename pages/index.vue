<template>
  <div id="content" class="has-side-bar">
    <div v-if="dataReady" id="side-bar">
      <ul id="project-nav">
        <li
          v-for="(project, index) in projects"
          :key="index"
          :ref="'project-li-' + index"
          :class="isActive(index)"
        >
          <div
            v-if="project.title !== ''"
            class="inner"
            @click="selectProject(index)"
          >
            <i class="las la-edit"></i>{{ project.title }}
          </div>
          <div v-else class="inner" @click="selectProject(index)">
            <i class="las la-edit"></i>Untitled
          </div>
          <div>
            <button class="delete-project" @click="deleteProject(index)">
              <i class="lar la-trash-alt"></i>
            </button>
          </div>
        </li>
      </ul>
      <button class="add-project" @click="addProject()">
        <i class="las la-plus-circle"></i>Add project
      </button>
    </div>
    <div v-if="dataReady" id="inner">
      <Project
        v-if="projects && currentProject"
        :project.sync="currentProject"
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

export default {
  name: "Projects",

  components: {
    Project
  },

  data() {
    return {
      projectSelected: 0,
      projects: [],
      dataReady: false,
      projectBoilerplate: {
        title: "",
        content: "",
        times: []
      }
    };
  },

  computed: {
    currentProject() {
      return this.projects[this.projectSelected];
    }
  },

  watch: {
    currentProject: {
      handler(val) {
        this.saveProjects();
      },
      deep: true
    }
  },

  async mounted() {
    const projects = await this.$localForage.getItem("Projects");
    if (projects) {
      this.projects = projects;
    }
    this.dataReady = true;
  },

  methods: {
    async saveProjects() {
      await this.$localForage.setItem("Projects", this.projects);
      console.log("Projects saved");
    },
    addProject() {
      this.projects.push({ ...this.projectBoilerplate });
      this.projectSelected = this.projects.length - 1;
      this.saveProjects();
    },
    deleteProject(index) {
      if (index > -1) {
        if (this.projectSelected !== 0) {
          this.projectSelected--;
        }
        this.projects.splice(index, 1);
      }
      this.saveProjects();
    },
    selectProject(index) {
      this.projectSelected = index;
    },
    isActive(index) {
      if (index === this.projectSelected) {
        return "active";
      }
    }
  }
};
</script>
