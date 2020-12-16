<template>
  <section v-if="!loggedIn" class="full-height grey">
    <div class="center-box">
      <h1>Sign in</h1>

      <div v-if="$route.params.registered == 'yes'">
        You have registered successfully
      </div>

      <form action="" method="post" @submit.prevent="submitForm()">
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

        <div v-if="login_error" class="alert alert-danger">
          {{ login_error }}
        </div>

        <input type="submit" value="Sign in" class="button color" />
      </form>
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
      login_error: null,
      email: null,
      password: null,
      status: false,
      loggedIn: true
    };
  },

  mounted() {
    if (this.$auth.user) {
      this.$router.push("/");
    } else {
      this.loggedIn = false;
    }
  },

  methods: {
    submitForm() {
      this.$auth
        .loginWith("local", {
          data: {
            email: this.email,
            password: this.password
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.message) {
            this.login_error = error.response.data.message;
          }
        });
    }
  }
};
</script>
