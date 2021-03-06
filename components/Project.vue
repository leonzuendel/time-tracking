<template>
  <section class="project">
    <StopWatch :project="project" />
    <div v-if="dataReady" class="project-tabs">
      <ul>
        <draggable v-model="tabs" handle=".handle" ghost-class="ghost">
          <li
            v-for="(tab, index) in tabs"
            :key="index"
            :class="isActive(tab)"
            @click="switchTab(tab)"
          >
            <i class="las la-braille handle"></i>
            <span class="icon-span" v-html="tab.icon"></span>
            {{ tab.title }}
          </li>
        </draggable>
      </ul>
    </div>
    <component
      :is="getComponent(currentTabComponent)"
      :project.sync="project"
      :index="index"
    ></component>
  </section>
</template>

<script>
import ProjectSettings from "@/components/ProjectSettings";
import Info from "@/components/Info";
import Calendar from "@/components/Calendar";
import ToDos from "@/components/ToDos";
import StopWatch from "@/components/StopWatch";
export default {
  components: {
    Calendar,
    ToDos,
    Info,
    ProjectSettings,
    StopWatch
  },
  props: {
    project: Object,
    index: Number
  },
  data() {
    return {
      currentTabComponent: "Info",
      tabs: [
        {
          title: "Info",
          component: "Info",
          icon: "<i class='lar la-edit'></i>"
        },
        {
          title: "Times",
          component: "Calendar",
          icon: "<i class='las la-stopwatch'></i>"
        },
        {
          title: "ToDos",
          component: "ToDos",
          icon: "<i class='lar la-list-alt'></i>"
        },
        {
          title: "Project Settings",
          component: "ProjectSettings",
          icon: "<i class='las la-sliders-h'></i>"
        }
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
    if (tabs) {
      this.currentTabComponent = tabs[0].component;
    }
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
        case "ToDos":
          component = ToDos;
          break;
        case "ProjectSettings":
          component = ProjectSettings;
          break;
      }
      return component;
    },
    switchTab(tab) {
      this.currentTabComponent = tab.component;
      this.$store.dispatch("loadData");
    },
    isActive(tab) {
      if (tab.component === this.currentTabComponent) {
        return "active";
      }
    },
    async saveTabsOrder() {
      await this.$localForage.setItem("TabsOrder", this.tabs);
      console.log("Tabs Order saved");
    },
    deleteProject(index, project) {
      this.$parent.deleteProject(index, project);
    }
  }
};
</script>

<style></style>
