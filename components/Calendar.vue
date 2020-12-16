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
          <span v-html="view.icon"></span>
        </li>
      </ul>
    </div>
    <client-only>
      <component
        :is="currentViewComponent"
        :project.sync="project"
        :project-times="projectTimes"
      ></component>
    </client-only>
  </section>
</template>

<script>
import { mapState } from "vuex";
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
        {
          title: "Visual",
          component: calendarVisual,
          icon: "<i class='lar la-calendar'></i>"
        },
        {
          title: "List",
          component: calendarList,
          icon: "<i class='las la-th-list'></i>"
        }
      ]
    };
  },
  watch: {
    "$store.state.times": {
      handler(val) {
        this.$store.dispatch("updateTimes", this.$store.state.times);
      },
      deep: true
    }
  },
  computed: {
    ...mapState(["times"]),
    projectTimes() {
      const result = this.times.filter(
        (time) => time.project === this.project._id
      );
      return result;
    }
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
