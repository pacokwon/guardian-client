<template>
  <div class="pet-detail">
    <pet-profile
      :id="id"
      :imageUrl="imageUrl"
      :nickname="nickname"
      :species="species"
      class="pet-detail--profile"
    />
    <div class="pet-detail--guardian">Guardian</div>
    <div class="pet-detail--history">History</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { UserPetHistory, Node } from '@/types';
import PetProfile from '@/components/PetProfile.vue';

export default Vue.extend({
  name: 'pet-detail',
  components: {
    PetProfile
  },
  data() {
    return {
      id: '',
      nickname: '',
      species: '',
      imageUrl: 'https://via.placeholder.com/300', // default placeholder
      guardian: null,
      userHistory: [] as UserPetHistory[]
    };
  },
  async mounted() {
    const { petID } = this.$route.params;

    const result = await this.$apollo.query({
      query: gql`
        query($petID: ID!) {
          pet(id: $petID) {
            id
            nickname
            species
            imageUrl

            userHistory {
              edges {
                node {
                  user {
                    nickname
                  }
                  releasedAt
                  released
                }
              }
            }
          }
        }
      `,
      variables: { petID: petID.toString() }
    });

    const { id, nickname, species, imageUrl, userHistory } =
      result?.data?.pet || {};

    this.id = id;
    this.nickname = nickname;
    this.species = species;
    this.imageUrl = imageUrl;

    this.userHistory = (userHistory?.edges || []).map(
      ({ node }: Node<UserPetHistory>) => ({
        ...node
      })
    );
  }
});
</script>

<style scoped lang="scss">
.pet-detail {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-areas:
    'profile  profile  history history history'
    'profile  profile  history history history'
    'profile  profile  history history history'
    'guardian guardian history history history'
    'guardian guardian history history history';

  &--profile {
    grid-area: profile;
    border: 1px solid black;
  }

  &--guardian {
    grid-area: guardian;
    border: 1px solid tomato;
  }

  &--history {
    grid-area: history;
    border: 1px solid cyan;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'profile'
      'guardian'
      'history';
  }
}
</style>
