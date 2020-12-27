<template>
  <div id="user-settings">
    <h2>Workspaces</h2>
    <p class="light">You can manage your and your team's workspaces here.</p>
    <ul>
      <li
        class="private"
        :class="{ active: isActive('private') }"
        @click="selectWorkspace('private')"
      >
        Private - this is your very own workspace
      </li>
      <li class="table-head">
        <div>Name</div>
        <div>Invite-Code</div>
      </li>
      <li
        v-for="workspace in workspaces"
        :key="workspace._id"
        :class="{ active: isActive(workspace._id) }"
      >
        <div class="name" @click="selectWorkspace(workspace._id)">
          {{ workspace.title }}
        </div>
        <div class="invite">
          {{ workspace.invite }}
          <span class="copy-button" @click="copyValue(workspace.invite)">
            <i class="lar la-copy"></i>
          </span>
        </div>
      </li>
    </ul>
    <div class="add-workspace">
      <input
        v-model="workspaceName"
        class="form-input"
        placeholder="Workspace Name"
      />
      <button class="button" @click="addWorkspace()">Create Workspace</button>
    </div>
    <div class="add-workspace invite">
      <input
        v-model="workspaceInvite"
        class="form-input"
        placeholder="Invite Code"
      />
      <button class="button" @click="joinWorkspace()">Join Workspace</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      workspaceName: "",
      workspaceInvite: ""
    };
  },
  computed: {
    ...mapState(["workspaces", "settings", "currentWorkspace"])
  },
  methods: {
    async addWorkspace() {
      const invite = Math.random().toString(36).slice(2);
      if (this.workspaceName !== "") {
        // Boilerplate not working
        const newWorkspace = {
          title: this.workspaceName,
          projects: [],
          users: [{ id: this.$auth.user._id, role: "owner" }],
          invite
        };
        await this.$store.dispatch("createWorkspace", newWorkspace);
        this.workspaceName = "";
      }
    },
    async joinWorkspace() {
      if (this.workspaceInvite !== "") {
        const params = {
          invite: this.workspaceInvite,
          user: this.$auth.user._id
        };
        await this.$store.dispatch("joinWorkspace", params);
        this.workspaceInvite = "";
      }
    },
    selectWorkspace(workspaceId) {
      this.$store.dispatch("selectWorkspace", workspaceId);
    },
    isActive(id) {
      if (id === this.settings.workspaceSelected) {
        return "active";
      }
    },
    copyValue(text) {
      this.$copyText(text);
    }
  }
};
</script>

<style></style>
