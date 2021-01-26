<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from '@/components/Header.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Header
  }
});
</script>

<style>
:root {
  --guardian-primary: var(--primary);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}

.fade-move-enter,
.fade-move-leave-to {
  transform: translate(0, 15px);
  opacity: 0;
}

.fade-move-enter-active,
.fade-move-leave-active {
  transition: all 0.8s ease;
}
</style>
