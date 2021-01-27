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

<style lang="scss">
:root {
  --guardian-primary: var(--primary);
  --guardian-grey-50: #fafafa;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.fade {
  &-enter,
  &-leave-to {
    opacity: 0;
  }

  &-enter-active,
  &-leave-active {
    transition: all 0.5s ease;
  }

  &-enter-to,
  &-leave {
    opacity: 1;
  }
}

.fade-move {
  &-enter,
  &-leave-to {
    transform: translate(0, 15px);
    opacity: 0;
  }

  &-enter-active,
  &-leave-active {
    transition: all 0.8s ease;
  }
}
</style>
