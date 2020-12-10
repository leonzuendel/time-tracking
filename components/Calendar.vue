<template>
  <section class="calendar times">
    <div class="view-switch">
      <ul>
        <li
          v-for="(view, index) in views"
          :key="index"
          :class="isActive(view)"
          @click="switchView(view)"
        >
          {{ view.title }}
        </li>
      </ul>
    </div>
    <client-only>
      <component :is="currentViewComponent" :project.sync="project"></component>
    </client-only>
  </section>
</template>

<script>
import calendarVisual from "@/components/calendarVisual";
import calendarList from "@/components/calendarList";
export default {
  components: { calendarVisual, calendarList },
  props: {
    project: Object
  },
  data() {
    return {
      currentViewComponent: calendarVisual,
      views: [
        { title: "Visual", component: calendarVisual },
        { title: "List", component: calendarList }
      ]
    };
  },
  methods: {
    switchView(view) {
      this.currentViewComponent = view.component;
    },
    isActive(view) {
      if (view.component === this.currentViewComponent) {
        return "active";
      }
    }
  }
};
</script>

<style></style>
