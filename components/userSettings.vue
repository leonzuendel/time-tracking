<template>
  <div id="user-settings">
    <h2>Workspaces</h2>
    <ul>
      <li
        class="private"
        :class="{ active: isActive('private') }"
        @click="selectWorkspace('private')"
      >
        Private
      </li>
      <li
        v-for="workspace in workspaces"
        :key="workspace._id"
        :class="{ active: isActive(workspace._id) }"
        @click="selectWorkspace(workspace._id)"
      >
        {{ workspace.title }}
      </li>
    </ul>
    <div class="add-workspace">
      <input v-model="workspaceName" class="form-input" />
      <button class="button" @click="addWorkspace()">Create Workspace</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      workspaceName: ""
    };
  },
  computed: {
    ...mapState(["workspaces", "settings", "currentWorkspace"])
  },
  methods: {
    async addWorkspace() {
      if (this.workspaceName !== "") {
        // Boilerplate not working
        const newWorkspace = {
          title: this.workspaceName,
          projects: [],
          users: [{ id: this.$auth.user._id, role: "owner" }]
        };
        await this.$store.dispatch("createWorkspace", newWorkspace);
        this.workspaceName = "";
      }
    },
    selectWorkspace(workspaceId) {
      this.$store.dispatch("selectWorkspace", workspaceId);
    },
    isActive(id) {
      if (id === this.settings.workspaceSelected) {
        return "active";
      }
    }
  }
};
</script>

<style></style>
