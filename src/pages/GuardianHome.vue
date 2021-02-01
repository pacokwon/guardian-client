<template>
  <div class="home">
    <h1>Guardian</h1>
    <user-login-status />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UserLoginStatus from '@/components/UserLoginStatus'

export default Vue.extend({
  name: 'guardian-home',
  components: {
    UserLoginStatus
  }
});
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  margin-bottom: 24px;
}
</style>
