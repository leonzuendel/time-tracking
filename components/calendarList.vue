<template>
  <div class="calendar-list-view">
    <button class="add-time" @click="addTime()">
      <i class="las la-plus-circle"></i>Add Entry
    </button>
    <ul>
      <li class="time headline">
        <div>Title</div>
        <div>Description</div>
        <div>ToDo</div>
        <div>Start Date/Time</div>
        <div>End Date/Time</div>
        <div>
          Duration <span class="light">({{ totalDuration }})</span>
        </div>
      </li>
      <li v-for="(time, index) in projectTimes" :key="index" class="time">
        <div class="delete-time" @click="deleteTime(index, time)">
          <i class="lar la-trash-alt"></i>
        </div>
        <div class="time-title">
          <div class="profile-color" :class="{ other: otherUser(time.user) }">
            {{
              $store.getters
                .getWorkspaceUserInfo(time.user)
                .first_name.slice(0, 1)
            }}{{
              $store.getters
                .getWorkspaceUserInfo(time.user)
                .last_name.slice(0, 1)
            }}
          </div>
          <input v-model="time.title" type="text" placeholder="Untitled" />
        </div>
        <div class="time-description">
          <input
            v-model="time.content"
            type="text"
            placeholder="No Description"
          />
        </div>
        <div class="time-todo">None</div>
        <div v-if="time.start" class="time-start-date">
          <client-only
            ><date-picker
              v-model="time.start"
              mode="dateTime"
              color="blue"
              is24hr
            >
              <template v-slot="{ inputValue, inputEvents }">
                <input :value="inputValue" v-on="inputEvents" />
              </template>
            </date-picker>
          </client-only>
        </div>
        <div v-else class="time-start-date"></div>
        <div v-if="time.end" class="time-end-date">
          <client-only
            ><date-picker
              v-model="time.end"
              mode="dateTime"
              color="blue"
              is24hr
            >
              <template v-slot="{ inputValue, inputEvents }">
                <input :value="inputValue" v-on="inputEvents" />
              </template>
            </date-picker>
          </client-only>
        </div>
        <div v-else class="time-end-date"></div>
        <div class="time-duration">{{ getDuration(time.start, time.end) }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    project: Object,
    projectTimes: Array
  },
  computed: {
    totalDuration() {
      let duration = 0;
      this.projectTimes.forEach((time) => {
        duration += Math.abs(time.end - time.start);
      });
      return this.timeConversion(duration);
    }
  },
  async mounted() {},
  methods: {
    getDuration(startDate, endDate) {
      const duration = Math.abs(endDate - startDate);
      return this.timeConversion(duration);
    },
    deleteTime(index, time) {
      if (index > -1) {
        this.$store.dispatch("deleteTime", {
          timeId: time._id,
          index
        });
      }
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
      this.projectTimes = events;
      this.$emit("update:project", this.project);
    },
    async addTime() {
      // Boilerplate not working
      const newTime = {
        start: new Date(),
        end: new Date(),
        title: "",
        content: "",
        deletable: true,
        deleting: false,
        titleEditable: true,
        resizable: true,
        resizing: false,
        draggable: true,
        dragging: false,
        draggingStatic: false,
        focused: false,
        class: "",
        split: null,
        user: this.$auth.user._id,
        project: this.project._id
      };
      await this.$store.dispatch("createTime", newTime);
    },
    otherUser(id) {
      return id !== this.$auth.user._id;
    }
  }
};
</script>

<style></style>
