<template>
  <section v-if="dataReady" class="settings">
    <h2>Project Integration</h2>
    <h3>Import ToDoist project</h3>
    <div v-if="settings.toDoistEnabled">
      <label for="todoist-project-select"></label>
      <select id="todoist-project-select" v-model="selectedToDoistProject">
        <option value="0" disabled>Select Project</option>
        <option
          v-for="project in toDoistProjects"
          :key="project.id"
          :value="project.id"
        >
          {{ project.name }}
        </option>
      </select>
      <button class="big-button" @click="importFromToDoist()">Import</button>
    </div>
    <div v-else>
      <p>Please provide an API token in the workspace settings.</p>
    </div>

    <h2>Delete this project</h2>
    <p>Use with caution. Deletion can not be reversed.</p>
    <p v-if="project.title !== ''">
      Please fill in the title of this project ("<b>{{ project.title }}</b
      >") to confirm deletion:
    </p>
    <input
      v-if="project.title !== ''"
      v-model="safeDeleteInput"
      type="text"
      placeholder="Project Title"
      class="safe-delete-input"
    />
    <button class="delete-project-button" @click="deleteProject(index)">
      <i class="lar la-trash-alt"></i> Delete Project
    </button>
  </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  props: {
    project: Object,
    index: Number
  },
  data() {
    return {
      dataReady: false,
      safeDeleteInput: "",
      toDoistProjects: [],
      selectedToDoistProject: "0"
    };
  },
  computed: {
    ...mapState(["settings"])
  },
  watch: {
    "settings.toDoistApiKey": {
      handler(val) {
        this.getToDoistProjects();
      },
      deep: true
    },
    "settings.toDoistEnabled": {
      handler(val) {
        this.getToDoistProjects();
      },
      deep: true
    }
  },
  async mounted() {
    if (this.settings.toDoistEnabled) {
      await this.getToDoistProjects();
    }
    this.dataReady = true;
  },
  methods: {
    deleteProject(index) {
      if (this.safeDeleteInput === this.project.title) {
        this.$parent.deleteProject(index);
      }
    },
    async getToDoistProjects() {
      const config = {
        headers: {
          Authorization: "Bearer " + this.settings.toDoistApiKey,
          "Content-Type": "application/json"
        }
      };
      const projects = await this.$axios.$get(
        "https://api.todoist.com/rest/v1/projects",
        config
      );
      this.toDoistProjects = projects;
    },
    async importFromToDoist() {
      if (this.selectedToDoistProject !== "0") {
        const config = {
          headers: {
            Authorization: "Bearer " + this.settings.toDoistApiKey,
            "Content-Type": "application/json"
          }
        };
        const tasks = await this.$axios.$get(
          "https://api.todoist.com/rest/v1/tasks?project_id=" +
            this.selectedToDoistProject,
          config
        );
        console.log(tasks);
        tasks.forEach((task) => {
          const oldTask = this.project.toDos.filter(
            (toDo) => toDo.id === task.id
          );
          if (oldTask.length < 1) {
            task.title = task.content;
            task.importedFrom = "ToDoist";
            task.imported = true;
            task.content = "";
            task.category = 1;
            task.status = 0;
            this.project.toDos.unshift(task);
          } else if (oldTask[0] !== task) {
            this.project.toDos[this.project.toDos.indexOf(oldTask[0])].title =
              task.content;
          }
        });
        this.selectedToDoistProject = "0";
      }
    }
  }
};
</script>

<style></style>
