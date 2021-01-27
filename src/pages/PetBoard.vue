<template>
  <div>
    <div v-for="pet in petsList" :key="pet.id">
      <pet-card v-bind="pet" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import PetCard from '@/components/PetCard.vue';
import { User, Pet, Node } from '@/types';

type PetWithGuardian = Pet & {
  user: User | null;
};

export default Vue.extend({
  name: 'pet-board',
  components: {
    PetCard
  },
  data() {
    return {
      petsList: [] as PetWithGuardian[],
      result: 'hello world'
    };
  },
  async mounted() {
    const result = await this.$apollo.query({
      query: gql`
        query {
          pets {
            edges {
              node {
                id
                nickname
                species
                imageUrl
                guardian {
                  nickname
                }
              }
            }
          }
        }
      `
    });

    this.petsList = (
      result?.data?.pets?.edges || []
    ).map(({ node }: Node<PetWithGuardian>) => ({ ...node }));
  }
});
</script>
