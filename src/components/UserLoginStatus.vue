<template>
  <section>
    <div class="user-grid">
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
        <div class="pagination-title">
          Log in as:
        </div>
      </div>
      <div
        v-for="({ id, nickname }, index) in users"
        class="history-row"
        :class="userRowClass(index)"
        :key="id"
        @click="selectUser(index)"
      >
        <div class="avatar">
          <b-img thumbnail rounded="circle" :src="avatarURL(id)" />
        </div>
        <div class="nickname">
          {{ nickname }}
        </div>
      </div>
    </div>
    <div v-if="selectedIndex !== null" class="confirm-group">
      <div class="confirm-message">
        Log in as {{ users[selectedIndex].nickname }}?
      </div>
      <b-button class="confirm" @click="requestLogin">
        Confirm
      </b-button>
    </div>
    <div v-else-if="isUserLoggedIn" class="confirm-group">
      <div class="confirm-message">
        Log out?
      </div>
      <b-button class="confirm" @click="requestLogout">
        Log Out
      </b-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { User, Node } from '@/types';
import { getAvatarUrlFromID } from '@/utils';

const fetchUsersQuery = gql`
  query($first: Int!, $cursor: String) {
    users(first: $first, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          nickname
        }
      }
    }
  }
`;

export default Vue.extend({
  name: 'user-login-status',
  async created() {
    await this.fetchNextPage();
  },
  data() {
    return {
      users: [] as User[],
      page: 1,
      pageSize: 8,
      cursor: null as null | string,
      hasNextPage: false,
      selectedIndex: null as null | number
    };
  },
  methods: {
    avatarURL(id: string) {
      return getAvatarUrlFromID(id);
    },
    async fetchNextPage() {
      this.page = this.hasNextPage ? this.page + 1 : 1;

      const result = await this.$apollo.query({
        query: fetchUsersQuery,
        variables: {
          first: this.pageSize,
          cursor: this.hasNextPage ? this.cursor : undefined
        }
      });

      const { users = [] } = result?.data || {};
      this.users = (users?.edges || []).map(({ node }: Node<User>) => ({
        ...node
      }));

      const { hasNextPage, endCursor } = result?.data?.users?.pageInfo || {};
      this.hasNextPage = hasNextPage;
      this.cursor = endCursor;

      this.selectedIndex = null;
    },
    isCurrentUser(id: string): boolean {
      return this.$store.state.userID === id;
    },
    selectUser(index: number) {
      // user is logged in as the selected user OR user selected an already selected user
      if (
        this.isCurrentUser(this.users[index].id) ||
        this.selectedIndex === index
      )
        this.selectedIndex = null;
      else this.selectedIndex = index;
    },
    userRowClass(index: number): string {
      if (this.isCurrentUser(this.users[index].id)) return 'user-current';

      if (this.selectedIndex === index) return 'user-selected';

      return '';
    },
    requestLogin() {
      if (this.selectedIndex === null) return;
      const { id } = this.users[this.selectedIndex];
      this.$store.dispatch('login', id);
    },
    requestLogout() {
      this.$store.dispatch('logout');
    }
  },
  computed: {
    isUserLoggedIn(): boolean {
      return this.$store.state.userID !== null;
    }
  }
});
</script>

<style scoped>
div.user-grid {
  display: grid;
  gap: 16px;
  grid-template-rows: repeat(4, auto);
  grid-template-columns: 1fr 1fr;
}

div.history-row {
  font-size: 1.1rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  max-width: 600px;
  align-items: center;
  justify-items: center;
  padding: 8px;
  border-radius: 8px;

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
    text-align: center;
  }

  &.user-current {
    border: 1px solid var(--guardian-green-100);
    background-color: var(--guardian-green-50);

    &:hover {
      background-color: var(--guardian-green-50);
    }
  }

  &.user-selected {
    border: 1px solid var(--guardian-indigo-100);
    background-color: var(--guardian-indigo-50);

    &:hover {
      background-color: var(--guardian-indigo-50);
    }
  }

  transition: transform 0.2s ease;

  &:hover {
    background-color: #f9f9f9;
    transform: translate(0, -3px);
    cursor: pointer;
  }
}

div.history-row-header {
  grid-column: 1 / 3;

  display: flex;
  justify-content: center;

  & > div.pagination-title {
    flex: 1;
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-left: 16px;
  }
}

button.pagination-button {
  /* override bootstrap styles for reduced button size */
  --point-color: #8a90eb;
  --active-color: #767de8;
  --border-color: #a7abeb;

  padding: 0.2rem 0.5rem;
  font-size: 0.6rem;
  border-color: var(--border-color);
  background-color: var(--point-color);
  color: white;

  &:active:enabled {
    background-color: var(--active-color) !important;
    border-color: var(--border-color) !important;
    color: white;
  }

  &[disabled],
  &:disabled {
    background-color: white;
    color: var(--point-color);
    cursor: not-allowed;
  }
}

div.confirm-group {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 16px;

  & > .confirm-message {
    font-size: 1.2rem;
    font-weight: bold;
  }

  & > button.confirm {
    background-color: var(--guardian-primary);
    border: none;

    &:active {
      background-color: var(--guardian-primary);
    }
  }
}
</style>
