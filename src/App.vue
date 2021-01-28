<template>
  <div id="app">
    <guardian-header />
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GuardianHeader from '@/components/GuardianHeader.vue';

export default Vue.extend({
  name: 'App',
  components: {
    GuardianHeader
  }
});
</script>

<style lang="scss">
:root {
  --guardian-primary: var(--primary);
  --guardian-grey-50: #fafafa;
}

@media screen and (min-width: 1200px) {
  :root {
    --screen-max-width: 1100px;
  }
}

@media screen and (min-width: 992px) and (max-width: 1199px) {
  :root {
    --screen-max-width: 900px;
  }
}

@media screen and (min-width: 768px) and (max-width: 992px) {
  :root {
    --screen-max-width: 700px;
  }
}

@media screen and (min-width: 576px) and (max-width: 767px) {
  :root {
    --screen-max-width: 520px;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  max-width: var(--screen-max-width);
  margin: 0 auto;
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
    transform: translate(0, 16px);
    opacity: 0;
  }

  &-enter-active,
  &-leave-active {
    transition: all 0.8s ease;
  }
}

/* --breakpoint-sm: 576px; */
/* --breakpoint-md: 768px; */
/* --breakpoint-lg: 992px; */
/* --breakpoint-xl: 1200px; */
</style>
