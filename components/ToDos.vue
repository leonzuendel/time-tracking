<template>
  <section class="todos">
    <button class="add-todo" @click="addToDo()">
      <i class="las la-plus-circle"></i>Add ToDo
    </button>
    <ul>
      <li class="todo headline">
        <div></div>
        <div>Title</div>
        <div>Status</div>
        <div>Description</div>
        <div>Category</div>
      </li>
      <draggable
        v-model="project.toDos"
        handle=".handle"
        ghost-class="ghost-childs"
      >
        <li
          v-for="(toDo, index) in project.toDos"
          :key="toDo.id"
          class="todo"
          :class="{ done: toDo.done }"
        >
          <div class="delete-todo" @click="deleteToDo(index)">
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
          <div>
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
export default {
  props: {
    project: Object
  },
  data() {
    return {
      toDoIdCount: 1,
      toDoBoilerplate: {
        title: "",
        content: "",
        category: 0,
        status: 0,
        done: false,
        id: 1
      },
      status: ["ToDo", "Done"],
      categories: ["Uncategorized"]
    };
  },
  async mounted() {
    this.toDoIdCount = await this.$localForage.getItem("ToDoIdCount");
  },
  methods: {
    checkToDo(toDo, index) {
      if (toDo.done) {
        toDo.status = 0;
        this.project.toDos.splice(index, 1);
        this.project.toDos.unshift(toDo);
      } else {
        toDo.status = 1;
        this.project.toDos.push(this.project.toDos.splice(index, 1)[0]);
      }
    },
    async addToDo() {
      // Boilerplate not working
      const newToDo = {
        title: "",
        content: "",
        category: 0,
        status: 0,
        done: false,
        id: 1
      };
      newToDo.id = this.toDoIdCount;
      this.toDoIdCount++;
      this.project.toDos.unshift(newToDo);
      await this.$localForage.setItem("ToDoIdCount", this.toDoIdCount);
    },
    deleteToDo(index) {
      if (index > -1) {
        this.project.toDos.splice(index, 1);
      }
    }
  }
};
</script>

<style></style>
