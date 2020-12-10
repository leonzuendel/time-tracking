<template>
  <div class="calendar-list-view">
    <ul>
      <li class="time headline">
        <div>Title</div>
        <div>Description</div>
        <div>Start Date</div>
        <div>Start Time</div>
        <div>End Date</div>
        <div>End Time</div>
        <div>Duration</div>
      </li>
      <li v-for="(time, index) in project.times" :key="index" class="time">
        <div v-if="time.title" class="time-title">{{ time.title }}</div>
        <div v-else class="time-title">Untitled</div>
        <div v-if="time.content">{{ time.content }}</div>
        <div v-else>No Description</div>
        <div v-if="time.start">{{ time.start.toLocaleDateString() }}</div>
        <div v-else></div>
        <div v-if="time.start">{{ time.start.toLocaleTimeString() }}</div>
        <div v-else></div>
        <div v-if="time.end">{{ time.end.toLocaleDateString() }}</div>
        <div v-else></div>
        <div v-if="time.end">{{ time.end.toLocaleTimeString() }}</div>
        <div v-else></div>
        <div class="time-duration">{{ getDuration(time.start, time.end) }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    project: Object
  },
  methods: {
    getDuration(startDate, endDate) {
      const duration = Math.abs(endDate - startDate);
      return this.timeConversion(duration);
    },
    timeConversion(millisec) {
      const seconds = (millisec / 1000).toFixed(1);

      const minutes = (millisec / (1000 * 60)).toFixed(1);

      const hours = (millisec / (1000 * 60 * 60)).toFixed(1);

      const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

      if (seconds < 60) {
        return seconds + " Sec";
      } else if (minutes < 60) {
        return minutes + " Min";
      } else if (hours < 24) {
        return hours + " Hrs";
      } else {
        return days + " Days";
      }
    },
    updateEvents() {
      const events = this.$refs.calendar.mutableEvents;
      this.project.times = events;
      this.$emit("update:project", this.project);
    }
  }
};
</script>

<style></style>
