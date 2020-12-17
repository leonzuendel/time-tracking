<template>
  <section class="full-height grey">
    <div class="center-box">
      <h1>Sign up</h1>

      <form action="" method="post" @submit.prevent="submitForm()">
        <label for="">First Name</label>
        <input
          v-model="fist_name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors && errors.fist_name }"
        />
        <div v-if="errors && errors.fist_name" class="invalid-feedback">
          {{ errors.fist_name.msg }}
        </div>

        <label for="">Last Name</label>
        <input
          v-model="last_name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors && errors.last_name }"
        />
        <div v-if="errors && errors.last_name" class="invalid-feedback">
          {{ errors.last_name.msg }}
        </div>

        <label for="">Email</label>
        <input
          v-model="email"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors && errors.email }"
        />
        <div v-if="errors && errors.email" class="invalid-feedback">
          {{ errors.email.msg }}
        </div>

        <label for="">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors && errors.password }"
        />
        <div v-if="errors && errors.password" class="invalid-feedback">
          {{ errors.password.msg }}
        </div>

        <input type="submit" value="Sign up" class="button color" />
      </form>
      <br />
      Already signed up?
      <nuxt-link to="/user/login">Sign in here.</nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  layout: "page",
  middleware: "auth",
  auth: "guest",
  data() {
    return {
      errors: null,
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      status: false
    };
  },

  methods: {
    submitForm() {
      this.$axios
        .post("/api/users/register", {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          password: this.password
        })
        .then((response) => {
          console.log(response);

          if (response.data._id) {
            this.$router.push({
              name: "user-login",
              params: { registered: "yes" }
            });
            // log in if successfully registered
            this.$auth
              .loginWith("local", {
                data: {
                  email: this.email,
                  password: this.password
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.errors) {
            this.errors = error.response.data.errors;
          }
        });
    }
  }
};
</script>
