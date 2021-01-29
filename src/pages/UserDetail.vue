<template>
  <div class="user-detail">
    <transition name="fade-move" appear>
      <user-profile
        class="user-detail--profile"
        :id="id"
        :nickname="nickname"
      />
    </transition>
    <transition name="fade-move" appear>
      <user-current-pets
        class="user-detail--pets"
        :current-pets="currentPets"
      />
    </transition>
    <b-spinner v-if="userInfoLoading" variant="primary" type="grow" />
    <transition v-else name="fade-move" appear>
      <user-pet-history
        class="user-detail--history"
        :userID="id"
        :userNickname="nickname"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { Pet } from '@/types';
import UserProfile from '@/components/UserProfile.vue';
import UserCurrentPets from '@/components/UserCurrentPets.vue';
import UserPetHistory from '@/components/UserPetHistory.vue';

type PetWithRegisteredAt = Pet & { registeredAt: string };

export default Vue.extend({
  name: 'user-detail',
  components: {
    UserProfile,
    UserCurrentPets,
    UserPetHistory
  },
  data() {
    return {
      id: '',
      nickname: '',
      currentPets: [] as PetWithRegisteredAt[],
      userInfoLoading: true
    };
  },
  async mounted() {
    const { userID } = this.$route.params;

    const result = await this.$apollo.query({
      query: gql`
        query($userID: ID!) {
          user(id: $userID) {
            id
            nickname
            currentPets {
              pet {
                id
                nickname
                species
                imageUrl
              }
              registeredAt
            }
          }
        }
      `,
      variables: { userID }
    });

    const { id, nickname, currentPets } = result?.data?.user || {};
    this.id = id;
    this.nickname = nickname;
    this.currentPets = currentPets.map(
      ({ pet, registeredAt }: { pet: Pet; registeredAt: string }) => ({
        ...pet,
        registeredAt: registeredAt.slice(0, 10)
      })
    );

    this.userInfoLoading = false;
  }
});
</script>

<style scoped lang="scss">
div.user-detail {
  display: grid;
  gap: 16px 16px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-areas:
    'profile  profile  history history history'
    'profile  profile  history history history'
    'profile  profile  history history history'
    'pets     pets     history history history'
    'pets     pets     history history history';

  &--profile {
    grid-area: profile;
  }

  &--pets {
    grid-area: pets;
  }

  &--history {
    grid-area: history;
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      'profile  profile  history history'
      'profile  profile  history history'
      'profile  profile  history history'
      'pets     pets     history history'
      'pets     pets     history history';
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'profile'
      'pets'
      'history';
  }
}
</style>
