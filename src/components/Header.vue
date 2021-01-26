<template>
  <div id="nav">
    <router-link to="/" class="logo-container">
      <PetLogo />
      Guardian
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PetLogo from '@/assets/pet.svg';

export default Vue.extend({
  components: {
    PetLogo
  },
  data() {
    return { foo: 'bar' };
  }
});
</script>

<style scoped>
#nav {
  align-items: center;
  display: flex;
  font-size: 2rem;
  padding: 30px;

  & > * {
    margin-right: 10px;
  }
}

.logo-container {
  align-items: center;
  color: var(--guardian-primary);
  display: flex;
  font-weight: bold;
  text-decoration: none;

  & > svg {
    height: 100%;
    margin-right: 5px;
    fill: var(--guardian-primary);
  }

  & :hover {
    text-decoration: none;
  }
}
</style>
