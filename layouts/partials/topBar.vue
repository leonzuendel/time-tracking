<template>
  <div id="top-bar">
    <div class="app-title">
      <i class="las la-stopwatch"></i
      ><b v-if="$auth.user">{{ $auth.user.full_name }}</b>
    </div>
    <button class="settings-button" @click="openSettings()">
      <i class="las la-cog"></i>Settiings
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
