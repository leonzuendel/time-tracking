<template>
  <!--<div v-if="loading" class="loading-page">
   <div class="loading"></div>
 </div>-->
  <div></div>
</template>
<script>
export default {
  data: () => ({
    loading: true
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
};
</script>
<style></style>
