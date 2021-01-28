<template>
  <b-card no-body>
    <b-card-body>
      <h4 class="card-title">
        Guardian History of
        <span style="text-transform: capitalize;">{{ petNickname }}</span>
      </h4>
      <section>
        <div class="history-row-header">
          <b-button-group>
            <b-button
              class="pagination-button"
              :disabled="page === 1 && !hasNextPage"
              @click="fetchNextPage"
            >
              <b-icon-chevron-right />
            </b-button>
          </b-button-group>
          <div>Guardian</div>
          <div>Duration</div>
        </div>
        <div
          class="history-row"
          v-for="{ id, user, registeredAt, releasedAt, released } in history"
          :key="id"
        >
          <div class="avatar">
            <b-img thumbnail rounded="circle" :src="avatarURL(user.id)" />
          </div>
          <div class="nickname">
            {{ user.nickname }}
          </div>
          <div class="duration" v-if="released">
            {{ registeredAt.toISOString().slice(0, 10) }} ~
            {{ releasedAt.toISOString().slice(0, 10) }}
          </div>
          <div class="duration" v-else>
            {{ registeredAt.toISOString().slice(0, 10) }} ~
            <strong style="color: var(--guardian-primary)">Current</strong>
          </div>
        </div>
      </section>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { getAvatarUrlFromID } from '@/utils';
import { UserPetHistory, Node } from '@/types';

type UserPetHistoryInput = Omit<
  UserPetHistory,
  'releasedAt' | 'registeredAt'
> & {
  releasedAt: string; // ISO String
  registeredAt: string; // ISO String
};

const fetchHistoryQuery = gql`
  query($petID: ID!, $first: Int!, $cursor: String) {
    pet(id: $petID) {
      id
      userHistory(first: $first, after: $cursor) {
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
`;

export default Vue.extend({
  name: 'pet-guardian-history',
  props: {
    petID: {
      type: String,
      required: true
    },
    petNickname: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      page: 1,
      pageSize: 4,
      cursor: null as null | string,
      hasNextPage: true,
      history: [] as UserPetHistory[]
    };
  },
  async mounted() {
    const { petID } = this;
    const result = await this.$apollo.query({
      query: fetchHistoryQuery,
      variables: { petID, first: this.pageSize }
    });

    const { userHistory = [] } = result?.data?.pet || {};
    this.history = (userHistory?.edges || []).map(
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
    this.hasNextPage = hasNextPage;
    this.cursor = endCursor;
  },
  methods: {
    avatarURL(id: string) {
      return getAvatarUrlFromID(id);
    },
    async fetchNextPage() {
      this.page = this.hasNextPage ? this.page + 1 : 1;

      const { petID } = this;
      const result = await this.$apollo.query({
        query: fetchHistoryQuery,
        variables: {
          petID,
          first: this.pageSize,
          cursor: this.hasNextPage ? this.cursor : undefined
        }
      });

      const { userHistory = [] } = result?.data?.pet || {};
      this.history = (userHistory?.edges || []).map(
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
      this.hasNextPage = hasNextPage;
      this.cursor = endCursor;
    }
  }
});
</script>

<style scoped>
div.card {
  box-shadow: 1px 3px 8px -3px gray;
}

h4.card-title {
  margin-bottom: 32px;
}

div.history-row,
div.history-row-header {
  font-size: 1.1rem;
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  max-width: 600px;
  margin-bottom: 16px;
  align-items: center;
  justify-items: center;

  & .avatar {
    & > img {
      height: 50px;
      width: 50px;
    }
  }

  & .nickname {
    text-transform: capitalize;
  }

  & .duration {
    font-size: 0.9rem;
  }
}

div.history-row-header {
  font-weight: bold;
}

div.history-row {
  transition: transform 0.2s ease;

  &:hover {
    background-color: #f9f9f9;
    transform: translate(0, -3px);
  }
}

button.pagination-button {
  /* override bootstrap styles for reduced button size */
  --point-color: #8a90eb;
  --active-color: #767de8;
  --border-color: #a7abeb;

  padding: 0.2rem 0.5rem;
  font-size: 0.6rem;
  color: var(--point-color);
  border-color: var(--border-color);
  background-color: white;

  &:hover:enabled {
    background-color: var(--point-color);
    color: white;
  }

  &:active:enabled {
    background-color: var(--active-color) !important;
    border-color: var(--border-color) !important;
    color: white;
  }

  &[disabled],
  &:disabled {
    cursor: not-allowed;
  }
}
</style>
