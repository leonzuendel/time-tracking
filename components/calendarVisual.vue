<template>
  <vue-cal
    ref="calendar"
    :watch-real-time="true"
    :today-button="true"
    resize-x
    :active-view="'week'"
    :events-on-month-view="'short'"
    :events-count-on-year-view="true"
    :transitions="false"
    :snap-to-time="10"
    :editable-events="{
      title: true,
      drag: true,
      resize: true,
      delete: false,
      create: true
    }"
    :events="project.times"
    @view-change="updateEvents()"
    @event-change="updateEvents()"
    @event-deleted="updateEvents()"
    @event-drop="updateEvents()"
  >
  </vue-cal>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import "vue-cal/dist/drag-and-drop.js";
export default {
  components: { VueCal },
  props: {
    project: Object
  },
  methods: {
    updateEvents() {
      const events = this.$refs.calendar.mutableEvents;
      if (events) {
        this.project.times = events;
      } else {
        this.project.times = [];
      }
      this.$emit("update:project", this.project);
    }
  }
};
</script>

<style></style>
