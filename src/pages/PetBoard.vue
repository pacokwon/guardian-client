<template>
  <div
    class="masonry-container"
    v-masonry
    transition-duration="0.4s"
    gutter="20"
    item-selector=".masonry-item"
    column-width="300"
    fit-width="true"
  >
    <pet-card
      v-masonry-tile
      v-for="pet in petsList"
      :key="pet.id"
      v-bind="pet"
      class="masonry-item"
      style="margin-bottom: 20px;"
    />
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
      petsList: [] as PetWithGuardian[]
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
                  id
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

<style scoped>
div.masonry-container {
  margin: 0 auto;
}
</style>
