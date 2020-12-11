<template>
  <section class="settings">
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
export default {
  components: {},
  props: {
    project: Object,
    index: Number
  },
  data() {
    return {
      safeDeleteInput: ""
    };
  },
  mounted() {},
  methods: {
    deleteProject(index) {
      if (this.safeDeleteInput === this.project.title) {
        this.$parent.deleteProject(index);
      }
    }
  }
};
</script>

<style></style>
