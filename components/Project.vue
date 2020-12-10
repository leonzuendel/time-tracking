<template>
  <section class="project">
    <div v-if="dataReady" class="project-tabs">
      <ul>
        <draggable v-model="tabs" handle=".handle">
          <li
            v-for="(tab, index) in tabs"
            :key="index"
            :class="isActive(tab)"
            @click="switchTab(tab)"
          >
            <i class="las la-grip-vertical handle"></i>
            {{ tab.title }}
          </li>
        </draggable>
      </ul>
    </div>
    <component
      :is="getComponent(currentTabComponent)"
      :project.sync="project"
    ></component>
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
      currentTabComponent: "",
      tabs: [
        { title: "Info", component: "Info" },
        { title: "Times", component: "Calendar" }
      ],
      dataReady: false
    };
  },
  watch: {
    tabs: {
      handler(val) {
        this.saveTabsOrder();
      },
      deep: true
    }
  },
  async mounted() {
    const tabs = await this.$localForage.getItem("TabsOrder");
    if (tabs) {
      this.tabs = tabs;
    }
    this.dataReady = true;
    console.log("TabsOrder loaded");
    this.currentTabComponent = tabs[0].component;
  },
  methods: {
    getComponent(componentString) {
      let component = null;
      switch (componentString) {
        case "Info":
          component = Info;
          break;
        case "Calendar":
          component = Calendar;
          break;
      }
      return component;
    },
    switchTab(tab) {
      this.currentTabComponent = tab.component;
    },
    isActive(tab) {
      if (tab.component === this.currentTabComponent) {
        return "active";
      }
    },
    async saveTabsOrder() {
      await this.$localForage.setItem("TabsOrder", this.tabs);
      console.log("Tabs Order saved");
    }
  }
};
</script>

<style></style>
