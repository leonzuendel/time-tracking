<template>
  <div id="user-settings">
    <input v-model="workspaceName" />
    <button @click="addWorkspace()">Create Workspace</button>
    <ul>
      <li
        v-for="workspace in workspaces"
        :key="workspace._id"
        @click="selectWorkspace(workspace._id)"
      >
        {{ workspace.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      workspacName: ""
    };
  },
  computed: {
    ...mapState(["workspaces", "settings"])
  },
  methods: {
    async addWorkspace() {
      // Boilerplate not working
      const newWorkspace = {
        title: this.workspaceName,
        projects: [],
        users: [{ id: this.$auth.user._id, role: "owner" }]
      };
      await this.$store.dispatch("createWorkspace", newWorkspace);
      this.workspaceName = "";
    },
    selectWorkspace(workspaceId) {
      this.$store.dispatch("selectWorkspace", workspaceId);
    }
  }
};
</script>

<style></style>
