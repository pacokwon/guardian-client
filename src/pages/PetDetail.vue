<template>
  <div class="pet-detail">
    <pet-profile
      class="pet-detail--profile"
      :id="id"
      :imageUrl="imageUrl"
      :nickname="nickname"
      :species="species"
    />
    <pet-guardian class="pet-detail--guardian" :guardian="guardian" />
    <pet-guardian-history
      class="pet-detail--history"
      :history="userHistory"
      :petNickname="nickname"
      :hasNextPage="historyHasNextPage"
      @next-page="fetchNextPage"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { UserPetHistory, Node } from '@/types';
import PetProfile from '@/components/PetProfile.vue';
import PetGuardian from '@/components/PetGuardian.vue';
import PetGuardianHistory from '@/components/PetGuardianHistory.vue';

type UserPetHistoryInput = Omit<
  UserPetHistory,
  'releasedAt' | 'registeredAt'
> & {
  releasedAt: string; // ISO String
  registeredAt: string; // ISO String
};

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
      userHistory: [] as UserPetHistory[],
      historyCursor: null as null | string,
      historyHasNextPage: true
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
            guardian {
              id
              nickname
            }
            userHistory(first: 2) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges {
                node {
                  id
                  user {
                    id
                    nickname
                  }
                  releasedAt
                  registeredAt
                  released
                }
              }
            }
          }
        }
      `,
      variables: { petID: petID.toString() }
    });

    const { id, nickname, species, imageUrl, guardian, userHistory } =
      result?.data?.pet || {};

    this.id = id;
    this.nickname = nickname;
    this.species = species;
    this.imageUrl = imageUrl;
    this.guardian = guardian;
    this.userHistory = (userHistory?.edges || []).map(
      ({ node }: Node<UserPetHistoryInput>) => {
        const { releasedAt, registeredAt, ...rest } = node;
        return {
          releasedAt: new Date(releasedAt),
          registeredAt: new Date(registeredAt),
          ...rest
        };
      }
    );

    const { hasNextPage, endCursor } =
      result?.data?.pet?.userHistory?.pageInfo || {};
    this.historyHasNextPage = hasNextPage;
    this.historyCursor = endCursor;
    console.log(this.historyCursor);
    console.log(this.historyHasNextPage);
  },
  methods: {
    async fetchNextPage() {
      console.log(this.historyCursor);
      const { petID } = this.$route.params;
      const result = await this.$apollo.query({
        query: gql`
          query($petID: ID!, $cursor: String) {
            pet(id: $petID) {
              id
              userHistory(first: 2, after: $cursor) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                edges {
                  node {
                    id
                    user {
                      id
                      nickname
                    }
                    releasedAt
                    registeredAt
                    released
                  }
                }
              }
            }
          }
        `,
        variables: {
          petID: petID.toString(),
          cursor: this.historyCursor
        }
      });

      const { userHistory = [] } = result?.data?.pet || {};
      const { hasNextPage, endCursor } =
        result?.data?.pet?.userHistory?.pageInfo || {};

      this.userHistory = (userHistory?.edges || []).map(
        ({ node }: Node<UserPetHistoryInput>) => {
          const { releasedAt, registeredAt, ...rest } = node;
          return {
            releasedAt: new Date(releasedAt),
            registeredAt: new Date(registeredAt),
            ...rest
          };
        }
      );
      this.historyHasNextPage = hasNextPage;
      this.historyCursor = endCursor;
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

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'profile'
      'guardian'
      'history';
  }
}
</style>
