<template>
  <section class="todos">
    <!--<el-button class="add-todo" @click="addToDo()">
      <i class="las la-plus-circle"></i>Add ToDo
    </el-button>-->
    <ul>
      <li class="todo headline">
        <div></div>
        <div>Title</div>
        <div><span v-if="projectToDos.length > 0">Status</span></div>
        <div>Description</div>
        <div><span v-if="projectToDos.length > 0">Category</span></div>
      </li>
      <li class="todo new">
        <div>
          <el-button class="create-todo" @click="addToDo()">
            <i class="las la-plus-circle"></i>
          </el-button>
        </div>
        <div>
          <input
            v-model="newToDo.title"
            placeholder="Enter Title"
            @keyup.enter="addToDo()"
          />
        </div>
        <div></div>
        <div>
          <input
            v-model="newToDo.description"
            placeholder="Enter Description"
            @keyup.enter="addToDo()"
          />
        </div>
        <div></div>
      </li>
      <draggable
        v-model="projectToDos"
        handle=".handle"
        ghost-class="ghost-childs"
      >
        <li
          v-for="(toDo, index) in projectToDos"
          :key="toDo.id"
          class="todo"
          :class="{ done: toDo.done }"
        >
          <div class="delete-todo" @click="deleteToDo(index, toDo)">
            <i class="lar la-trash-alt"></i>
          </div>
          <div class="todo-done">
            <i class="las la-braille handle"></i>
            <div class="checkbox">
              <input
                :id="'todo' + index"
                v-model="toDo.done"
                type="checkbox"
                @click="checkToDo(toDo, index)"
              /><label :for="'todo' + index"></label>
            </div>
          </div>
          <div class="todo-title">
            <div class="profile-color" :class="{ other: otherUser(toDo.user) }">
              {{
                $store.getters
                  .getWorkspaceUserInfo(toDo.user)
                  .first_name.slice(0, 1)
              }}{{
                $store.getters
                  .getWorkspaceUserInfo(toDo.user)
                  .last_name.slice(0, 1)
              }}
            </div>
            <input v-model="toDo.title" type="text" placeholder="A new task" />
          </div>
          <div class="todo-status">
            {{ status[toDo.status] }}
          </div>
          <div>
            <input
              v-model="toDo.content"
              type="text"
              placeholder="Describe your new task"
            />
          </div>
          <div class="todo-category">
            {{ categories[toDo.category] }}
          </div>
        </li>
      </draggable>
    </ul>
  </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    project: Object
  },
  computed: {
    ...mapState(["settings", "currentWorkspace"]),
    projectToDos() {
      const result = this.currentWorkspace.toDos.filter(
        (toDo) => toDo.project === this.project._id
      );
      return result;
    }
  },
  data() {
    return {
      toDoIdCount: 1,
      newToDo: {
        title: "",
        description: ""
      },
      toDoBoilerplate: {
        title: "",
        content: "",
        category: 0,
        status: 0,
        done: false,
        id: 1,
        imported: false,
        importedFrom: ""
      },
      status: ["ToDo", "Done"],
      categories: ["Uncategorized", "ToDoist"]
    };
  },
  watch: {
    "$store.state.currentWorkspace.toDos": {
      handler(val) {
        this.$store.dispatch("updateToDos", this.$store.state.toDos);
      },
      deep: true
    }
  },
  async mounted() {},
  methods: {
    checkToDo(toDo, index) {
      // this.$store.dispatch("checkToDo", { toDo, index });
    },
    async addToDo() {
      if (this.newToDo.title === "") {
        return;
      }
      // Boilerplate not working
      const newToDo = {
        title: this.newToDo.title,
        content: this.newToDo.description,
        category: 0,
        status: 0,
        done: false,
        imported: false,
        importedFrom: "",
        user: this.$auth.user._id,
        project: this.project._id
      };
      await this.$store.dispatch("createToDo", newToDo);
      this.newToDo.title = "";
      this.newToDo.description = "";
    },
    deleteToDo(index, toDo) {
      if (index > -1) {
        this.$store.dispatch("deleteToDo", {
          toDoId: toDo._id,
          index
        });
      }
    },
    otherUser(id) {
      return id !== this.$auth.user._id;
    }
  }
};
</script>

<style></style>
