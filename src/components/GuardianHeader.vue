<template>
  <div id="nav">
    <router-link to="/" class="logo-container router-link">
      <PetLogo width="30px" height="30px" />
      <div>Guardian</div>
    </router-link>
    <router-link to="/pets" class="router-link">
      All Pets
    </router-link>
    <a class="router-link my-page" @click="navigateToMyPage">
      My Page
    </a>
    <router-link to="/users/register" class="router-link">
      Sign Up
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PetLogo from '@/assets/pet.svg';

export default Vue.extend({
  name: 'guardian-header',
  components: {
    PetLogo
  },
  methods: {
    navigateToMyPage() {
      const { userID } = this.$store.state;

      if (userID !== null) this.$router.push(`/users/${userID}`);
    }
  }
});
</script>

<style scoped>
#nav {
  align-items: flex-end;
  display: flex;
  min-height: 5rem;
  padding: 30px 20px;
}

.router-link {
  color: var(--guardian-primary);
  font-size: calc(0.8rem + 0.5vw);
  margin-right: 20px;
  text-decoration: none;
  text-align: center;

  &.my-page:hover {
    cursor: pointer;
  }
}

.logo-container {
  align-items: flex-end;
  display: flex;
  font-weight: bold;
  font-size: 1.8rem;
  line-height: 1;
  margin-right: 30px;

  & > svg {
    margin-right: 4px;
    margin-bottom: 2px;
    fill: var(--guardian-primary);
  }

  & :hover {
    text-decoration: none;
  }
}
</style>
