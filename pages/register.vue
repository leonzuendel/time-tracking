<template>
  <div id="content">
    <h1>Sign up for a new account</h1>
    <form>
      <input
        v-model="rawUserData.first_name"
        type="text"
        placeholder="First Name"
        name="firstname"
      />
      <input
        v-model="rawUserData.last_name"
        type="text"
        placeholder="Last Name"
        name="lastname"
      /><br />
      <input
        v-model="rawUserData.email"
        type="text"
        placeholder="Email"
        name="email"
      /><br />
      <input
        v-model="rawUserData.password"
        type="password"
        placeholder="Password"
        name="password"
      /><br />
      <button @click.prevent="signUp()">Sign up</button>
    </form>
  </div>
</template>

<script>
export default {
  layout: "page",
  data() {
    return {
      rawUserData: {
        first_name: "",
        last_name: "",
        email: "",
        password: ""
      }
    };
  },
  computed: {
    full_name() {
      return this.rawUserData.first_name + " " + this.rawUserData.last_name;
    },
    userData() {
      const data = {
        full_name: this.full_name,
        email: this.rawUserData.email,
        password: this.rawUserData.password
      };
      return data;
    }
  },
  methods: {
    signUp() {
      this.$axios.$post("/users/register", this.userData);
    }
  }
};
</script>

<style></style>
