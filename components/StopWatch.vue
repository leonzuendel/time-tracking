<template>
  <div class="stop-watch">
    <div v-if="started" class="elapsed-time">{{ time }}</div>
    <button
      class="watch-button"
      :class="{ started: running }"
      @click="startStop()"
    >
      <i v-if="!running" class="fas fa-play"></i>
      <i v-else class="fas fa-stop"></i>
    </button>
    <button v-if="running" class="pause-button" @click="pause()">
      <i class="fas fa-pause"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    times: Array
  },
  data() {
    return {
      timeElapsed: null,
      currentTime: null,
      started: null,
      time: "00:00:00",
      timeBegan: null,
      timeStopped: null,
      stoppedDuration: 0,
      running: false,
      timeIdCount: 1
    };
  },
  async mounted() {
    const timeIDCount = await this.$localForage.getItem("TimeIdCount");
    if (timeIDCount) {
      this.timeIdCount = await this.$localForage.getItem("TimeIdCount");
    }
  },
  methods: {
    startStop() {
      if (!this.running) {
        this.start();
      } else {
        this.stop();
      }
    },
    start() {
      if (this.running) return;

      if (this.timeBegan === null) {
        this.reset();
        this.timeBegan = new Date();
      }

      if (this.timeStopped !== null) {
        this.stoppedDuration += new Date() - this.timeStopped;
      }

      this.started = setInterval(this.clockRunning, 10);
      this.running = true;
    },

    pause() {
      this.running = false;
      this.timeStopped = new Date();
      clearInterval(this.started);
    },

    stop() {
      this.addTime(this.timeBegan, new Date() - this.stoppedDuration);
      this.reset();
    },

    reset() {
      this.running = false;
      clearInterval(this.started);
      this.stoppedDuration = 0;
      this.timeBegan = null;
      this.timeStopped = null;
      this.time = "00:00:00";
      this.started = null;
    },

    clockRunning() {
      this.currentTime = new Date();
      this.timeElapsed = new Date(
        this.currentTime - this.timeBegan - this.stoppedDuration
      );
      const hour = this.timeElapsed.getUTCHours();
      const min = this.timeElapsed.getUTCMinutes();
      const sec = this.timeElapsed.getUTCSeconds();

      this.time =
        this.zeroPrefix(hour, 2) +
        ":" +
        this.zeroPrefix(min, 2) +
        ":" +
        this.zeroPrefix(sec, 2);
    },

    zeroPrefix(num, digit) {
      let zero = "";
      for (let i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },
    async addTime(start, end) {
      // Boilerplate not working
      const newTime = {
        start,
        end,
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
        id: this.timeIdCount
      };
      newTime.id = this.timeIdCount;
      this.timeIdCount++;
      this.times.unshift(newTime);
      await this.$localForage.setItem("TimeIdCount", this.timeIdCount);
    }
  }
};
</script>

<style></style>
