<template>
  <div>
    <h1>Logging out</h1>
    <hr />

    <p>Please wait...</p>
  </div>
</template>

<script>
export default {
  middleware: "auth",

  async asyncData(context) {
    if (process.client) {
      if (window.gapi.auth2) {
        const auth2 = window.gapi.auth2.getAuthInstance();
        await auth2.signOut().then(function () {
          console.log("User signed out.");
        });
      }
    }

    await context.$auth.logout();
  }
};
</script>
