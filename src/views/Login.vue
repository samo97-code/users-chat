<template>
  <div class="messages-wrapper" style="width: 500px; margin: 0 auto">
    <div class="content">
      <h1>Login</h1>
      <div v-if="loading">Working on login</div>
      <div v-if="error">{{ error }}</div>
      <label style="margin-bottom: 20px; display: block" for="login">
        <input
          id="login"
          v-model="login"
          style="width: 100%; height: 50px; background: transparent; padding: 10px"
          type="text"
        />
      </label>
      <br />
      <label style="margin-bottom: 20px; display:block;" for="password">
        <input
          id="password"
          v-model="password"
          type="password"
          style="width: 100%; height: 50px; background: transparent; padding: 10px"
        />
      </label>
      <button
        style="background: bisque; width: 100%; height: 50px;"
        type="submit"
        @click="loginForm"
      >
        Login
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      login: null,
      password: null,
      loading: false,
      error: ""
    };
  },
  methods: {
    async loginForm(e) {
      const loginData = {
        email: this.login,
        password: this.password
      };
      try {
        const resp = await this.$store.dispatch("users/login", loginData);
        await this.$cookies.set("token", resp.data.access_token);
        await localStorage.setItem("token", resp.data.access_token);
        await this.fetchUser();
        window.location.href = "/";
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async fetchUser() {
      try {
        const resp = await this.$store.dispatch("users/profile", {
          token: this.$cookies.get("token")
        });
        await this.$cookies.set("user", resp.data);
      } catch (e) {}
    }
  }
};
</script>
