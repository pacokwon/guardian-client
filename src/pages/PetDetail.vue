<template>
  <div class="pet-detail">
    <transition name="fade-move" appear>
      <pet-profile
        class="pet-detail--profile"
        :id="id"
        :imageUrl.sync="imageUrl"
        :nickname.sync="nickname"
        :species.sync="species"
      />
    </transition>
    <transition name="fade-move" appear>
      <pet-guardian
        class="pet-detail--guardian"
        :petID="id"
        :guardian="guardian"
        @update:guardian="updateGuardian"
      />
    </transition>
    <b-spinner v-if="petInfoLoading" variant="primary" type="grow" />
    <transition v-else name="fade-move" appear>
      <pet-guardian-history
        class="pet-detail--history"
        :petID="id"
        :petNickname="nickname"
        :key="historyRerenderFlag"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import PetProfile from '@/components/PetProfile.vue';
import PetGuardian from '@/components/PetGuardian.vue';
import PetGuardianHistory from '@/components/PetGuardianHistory.vue';

export default Vue.extend({
  name: 'pet-detail',
  components: {
    PetProfile,
    PetGuardian,
    PetGuardianHistory
  },
  data() {
    return {
      id: '',
      nickname: '',
      species: '',
      imageUrl: 'https://via.placeholder.com/300', // default placeholder
      guardian: null,
      petInfoLoading: true,
      historyRerenderFlag: true // hacky way to rerender history component
    };
  },
  async created() {
    const { petID } = this.$route.params;

    const result = await this.$apollo.query({
      query: gql`
        query($petID: ID!) {
          pet(id: $petID) {
            id
            nickname
            species
            imageUrl
            guardian {
              id
              nickname
            }
          }
        }
      `,
      variables: { petID },
      errorPolicy: 'all'
    });

    if (result?.errors) this.$router.replace('/not-found');

    const { id, nickname, species, imageUrl, guardian } =
      result?.data?.pet || {};

    this.id = id;
    this.nickname = nickname;
    this.species = species;
    this.imageUrl = imageUrl;
    this.guardian = guardian;

    this.petInfoLoading = false;
  },
  methods: {
    async updateGuardian() {
      const { petID } = this.$route.params;

      const result = await this.$apollo.query({
        query: gql`
          query($petID: ID!) {
            pet(id: $petID) {
              id
              guardian {
                id
                nickname
              }
            }
          }
        `,
        variables: { petID }
      });

      if (result?.errors) {
        this.$bvToast.toast(
          'An error has occurred while updating guardian information',
          {
            title: 'Guardian',
            autoHideDelay: 5000,
            variant: 'danger'
          }
        );

        return;
      }

      this.guardian = result?.data?.pet?.guardian;
      this.historyRerenderFlag = !this.historyRerenderFlag;
    }
  }
});
</script>

<style scoped lang="scss">
.pet-detail {
  display: grid;
  gap: 16px 16px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-areas:
    'profile  profile  history history history'
    'profile  profile  history history history'
    'profile  profile  history history history'
    'guardian guardian history history history'
    'guardian guardian history history history';

  &--profile {
    grid-area: profile;
  }

  &--guardian {
    grid-area: guardian;
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
      'guardian guardian history history'
      'guardian guardian history history';
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'profile'
      'guardian'
      'history';
  }
}
</style>
