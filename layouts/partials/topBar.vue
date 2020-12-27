<template>
  <div id="top-bar">
    <div
      v-if="$auth.user"
      class="app-title"
      @click="userSettingsOpen = !userSettingsOpen"
    >
      <div class="profile-color">
        {{ $auth.user.first_name.slice(0, 1)
        }}{{ $auth.user.last_name.slice(0, 1) }}
      </div>
      <span v-if="$auth.user"
        >{{ $auth.user.first_name }} {{ $auth.user.last_name }}</span
      >
      <span class="light"> {{ currentWorkspace.title }}</span>
    </div>
    <button class="settings-button" @click="openSettings()">
      <i class="las la-ellipsis-h"></i>
    </button>
    <button class="settings-button sync" @click="$store.dispatch('loadData')">
      <i class="las la-sync" :class="{ 'is-loading': loading }"></i>
    </button>
    <userSettings v-if="userSettingsOpen" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import userSettings from "@/components/userSettings";
export default {
  components: {
    userSettings
  },
  props: {
    settingsOpen: Boolean
  },
  data() {
    return {
      userSettingsOpen: false
    };
  },
  computed: {
    ...mapState(["currentWorkspace", "loading"])
  },
  methods: {
    openSettings() {
      this.settingsOpen = !this.settingsOpen;
      this.$emit("update:settingsOpen", this.settingsOpen);
    }
  }
};
</script>

<style></style>
