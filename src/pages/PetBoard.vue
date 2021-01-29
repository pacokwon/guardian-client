<template>
  <section class="petboard-container">
    <div
      class="masonry-container"
      v-masonry
      transition-duration="0.4s"
      gutter="15"
      item-selector=".masonry-item"
      :column-width="cardWidth"
      fit-width="true"
    >
      <pet-card
        v-masonry-tile
        v-for="pet in petsList"
        :key="pet.id"
        v-bind="pet"
        class="masonry-item"
        style="margin-bottom: 20px;"
        :style="{ width: `${cardWidth}px` }"
      />
    </div>
    <b-spinner v-if="fetching" variant="primary" type="grow" />
    <span v-if="!hasNextPage" class="no-more-message">
      No More Pets!
    </span>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import PetCard from '@/components/PetCard.vue';
import { User, Pet, Node } from '@/types';

type PetWithGuardian = Pet & {
  user: User | null;
};

const petListQuery = gql`
  query($cursor: String) {
    pets(after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
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
`;

export default Vue.extend({
  name: 'pet-board',
  components: {
    PetCard
  },
  data() {
    return {
      petsList: [] as PetWithGuardian[],
      endCursor: null as null | string,
      hasNextPage: true,
      fetching: false,
      cardWidth: 250
    };
  },
  async mounted() {
    // send without cursor, to fetch from the start
    const result = await this.$apollo.query({
      query: petListQuery
    });

    this.petsList = (
      result?.data?.pets?.edges || []
    ).map(({ node }: Node<PetWithGuardian>) => ({ ...node }));

    const { hasNextPage, endCursor } = result?.data?.pets?.pageInfo || {};
    this.hasNextPage = hasNextPage;
    this.endCursor = endCursor;

    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async handleScroll() {
      // no need to handle scrolling with no pages left
      if (!this.hasNextPage || this.fetching) return;

      const FETCH_THRESHOLD = 5;

      // the current vertical amount of scroll
      const currentHeight = window.scrollY;

      // the entire scrollable height including invisible areas
      const { scrollHeight } = window.document.body;

      // (effectively) the height of the browser
      const { clientHeight } = window.document.documentElement;

      // the amount we can scroll through
      const maxPossibleHeight = scrollHeight - clientHeight;

      /* console.log({ maxPossibleHeight, currentHeight, scrollHeight, clientHeight }) */
      if (maxPossibleHeight - currentHeight <= FETCH_THRESHOLD) {
        this.fetching = true;
        await new Promise(res => setTimeout(res, 1000));
        await this.fetchMorePets();
        this.fetching = false;
      }
    },
    async fetchMorePets() {
      // send without cursor, to fetch from the start
      const result = await this.$apollo.query({
        query: petListQuery,
        variables: {
          cursor: this.endCursor
        }
      });

      const { hasNextPage, endCursor } = result?.data?.pets?.pageInfo || {};
      this.hasNextPage = hasNextPage;
      this.endCursor = endCursor;

      const extraPets = (
        result?.data?.pets?.edges || []
      ).map(({ node }: Node<PetWithGuardian>) => ({ ...node }));

      this.petsList.push(...extraPets);
    }
  }
});
</script>

<style scoped>
section.petboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
}

div.masonry-container {
  margin: 0 auto;
}

span.no-more-message {
  font-size: 1.2rem;
  font-weight: strong;
}
</style>
