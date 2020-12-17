<template>
  <div id="top-bar">
    <div class="app-title">
      <div class="profile-color">
        {{ $auth.user.first_name.slice(0, 1)
        }}{{ $auth.user.last_name.slice(0, 1) }}
      </div>
      <span v-if="$auth.user"
        >{{ $auth.user.first_name }} {{ $auth.user.last_name }}</span
      >
    </div>
    <button class="settings-button" @click="openSettings()">
      <i class="las la-ellipsis-h"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    settingsOpen: Boolean
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
