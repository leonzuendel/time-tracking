<template>
  <div id="content" class="has-side-bar">
    <div v-if="dataReady" id="side-bar">
      <ul id="project-nav">
        <draggable v-model="projects" handle=".handle" ghost-class="ghost">
          <li
            v-for="(project, index) in projects"
            :key="project.id"
            :ref="'project-li-' + index"
            :class="isActive(project.id)"
          >
            <div
              v-if="project.title !== ''"
              class="inner"
              @click="selectProject(project.id)"
            >
              <i class="las la-braille handle"></i><i class="lar la-folder"></i
              >{{ project.title }}
            </div>
            <div v-else class="inner" @click="selectProject(project.id)">
              <i class="las la-braille handle"></i
              ><i class="lar la-folder"></i>Untitled
            </div>
            <div>
              <button class="delete-project" @click="deleteProject(index)">
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

export default {
  name: "Projects",

  components: {
    Project
  },

  data() {
    return {
      projectSelected: 1,
      projects: [],
      dataReady: false,
      projectBoilerplate: {
        title: "",
        content: "",
        times: [],
        toDos: [],
        id: 1
      },
      projectIdCount: 1
    };
  },

  computed: {
    currentProject() {
      const result = this.projects.filter((obj) => {
        return obj.id === this.projectSelected;
      });
      return result[0];
    },
    currentProjectIndex() {
      return this.projects.indexOf(this.currentProject);
    }
  },

  watch: {
    currentProject: {
      handler(val) {
        this.saveProjects();
      },
      deep: true
    },
    projects: {
      handler(val) {
        this.saveProjects();
      },
      deep: true
    }
  },

  async mounted() {
    const idCount = await this.$localForage.getItem("ProjectIdCount");
    if (idCount) {
      this.projectIdCount = idCount;
    } else {
      this.projectIdCount = 1;
    }
    const projects = await this.$localForage.getItem("Projects");
    if (projects) {
      this.projects = projects;
    }
    if (projects) {
      if (this.projects[0]) {
        this.projectSelected = this.projects[0].id;
      } else {
        this.projectSelected = 0;
      }
    }
    this.dataReady = true;
  },

  methods: {
    async saveProjects() {
      await this.$localForage.setItem("ProjectIdCount", this.projectIdCount);
      await this.$localForage.setItem("Projects", this.projects);
      console.log("Projects saved");
    },
    addProject() {
      // Boilerplate not working
      const newProject = {
        title: "",
        content: "",
        times: [],
        toDos: [],
        id: 1
      };
      newProject.id = this.projectIdCount;
      this.projectIdCount++;
      this.projects.push(newProject);
      this.projectSelected = this.projectIdCount - 1;
      this.saveProjects();
    },
    deleteProject(index) {
      if (index > -1) {
        if (
          this.projectSelected === this.projects[index].id &&
          this.projects.length > 1
        ) {
          if (index > 0) {
            this.projectSelected = this.projects[index - 1].id;
          } else {
            this.projectSelected = 0;
          }
        }
        this.projects.splice(index, 1);
      }
      this.saveProjects();
    },
    selectProject(id) {
      this.projectSelected = id;
    },
    isActive(id) {
      if (id === this.projectSelected) {
        return "active";
      }
    }
  }
};
</script>
