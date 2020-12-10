<template>
  <section class="project">
    <div class="project-tabs">
      <ul>
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          :class="isActive(tab)"
          @click="switchTab(tab)"
        >
          {{ tab.title }}
        </li>
      </ul>
    </div>
    <component :is="currentTabComponent" :project.sync="project"></component>
  </section>
</template>

<script>
import Info from "@/components/Info";
import Calendar from "@/components/Calendar";
export default {
  components: {
    Calendar
  },
  props: {
    project: Object
  },
  data() {
    return {
      currentTabComponent: Info,
      tabs: [
        { title: "Info", component: Info },
        { title: "Times", component: Calendar }
      ]
    };
  },
  methods: {
    switchTab(tab) {
      this.currentTabComponent = tab.component;
    },
    isActive(tab) {
      if (tab.component === this.currentTabComponent) {
        return "active";
      }
    }
  }
};
</script>

<style></style>
