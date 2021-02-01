<template>
  <div class="home">
    <transition name="fade-move" appear>
      <h1>Guardian</h1>
    </transition>
    <transition name="fade-move" appear>
      <user-login-status />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UserLoginStatus from '@/components/UserLoginStatus.vue';

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
