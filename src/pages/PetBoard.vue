<template>
  <div>
    <div>This is PetBoard</div>
    <ul>
      <li v-for="pet in petsList" :key="pet.id">
        {{ pet.nickname }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { User, Pet } from '@/types';

type PetWithGuardian = Pet & {
  user: User | null;
};

type PetWithGuardianNode = { node: PetWithGuardian };

export default Vue.extend({
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
    ).map(({ node }: PetWithGuardianNode) => ({ ...node }));
  }
});
</script>
