<template>
  <b-card no-body>
    <div
      v-if="editing && updateState === UpdateStatus.FINISHED"
      class="control-group"
    >
      <b-button
        class="complete"
        variant="outline-primary"
        pill
        @click="requestNicknameUpdate"
      >
        Save Changes
      </b-button>
      <b-button
        class="cancel"
        variant="outline-primary"
        pill
        @click="cancelEditing"
      >
        Cancel
      </b-button>
    </div>
    <b-spinner v-else-if="editing" variant="primary" type="grow" />
    <b-button
      v-else
      class="edit"
      variant="outline-primary"
      @click="toggleEditAndFocus"
    >
      <b-icon-pencil-square />
    </b-button>
    <b-card-body>
      <b-img rounded="circle" :src="avatarURL(id)" />
      <input
        v-if="editing"
        type="text"
        v-model="editedNickname"
        ref="nickname"
      />
      <h2 v-else class="nickname">
        {{ nickname }}
      </h2>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { getAvatarUrlFromID } from '@/utils';

enum UpdateStatus {
  UPDATING,
  FINISHED
}

export default Vue.extend({
  name: 'user-profile',
  props: {
    id: { type: String, required: true },
    nickname: { type: String, required: true }
  },
  data() {
    return {
      editing: false,
      editedNickname: this.nickname,
      UpdateStatus,
      updateState: UpdateStatus.FINISHED
    };
  },
  methods: {
    avatarURL(id: string) {
      return getAvatarUrlFromID(id);
    },
    toggleEditAndFocus() {
      this.editing = !this.editing;

      this.$nextTick(() => {
        (this.$refs.nickname as HTMLInputElement).focus();
        (this.$refs.nickname as HTMLInputElement).select();
      });
    },
    async requestNicknameUpdate() {
      const { id, editedNickname } = this;

      if (editedNickname === this.nickname) {
        this.editing = !this.editing;

        this.$bvToast.toast('Nickname did not change', {
          title: 'Guardian',
          autoHideDelay: 5000,
          variant: 'primary'
        });
        return;
      }

      this.updateState = UpdateStatus.UPDATING;
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($id: ID!, $nickname: String!) {
            updateUser(input: { id: $id, nickname: $nickname }) {
              id
              nickname
            }
          }
        `,
        variables: {
          id,
          nickname: editedNickname
        }
      });

      await new Promise(res => setTimeout(res, 1000));
      this.updateState = UpdateStatus.FINISHED;

      if (result?.data?.updateUser?.id) {
        this.$bvToast.toast('Your nickname has been successfully updated', {
          title: 'Guardian',
          autoHideDelay: 5000,
          variant: 'primary'
        });

        this.editing = !this.editing;
        this.$emit('update:nickname', editedNickname);
      } else {
        this.$bvToast.toast(
          'An error has occurred while updating your information',
          {
            title: 'Guardian',
            autoHideDelay: 5000,
            variant: 'danger'
          }
        );

        // revert to initial value
        this.editedNickname = this.nickname;
      }
    },
    cancelEditing() {
      this.editedNickname = this.nickname;
      this.editing = !this.editing;
    }
  },
  watch: {
    nickname(val: string) {
      this.editedNickname = val;
    }
  }
});
</script>

<style scoped>
img {
  width: 144px;
  height: 144px;
  margin-bottom: 20px;
}

/* b-card */
div.card {
  align-items: center;
  box-shadow: 1px 3px 8px -3px gray;
  position: relative;
}

div.card-body {
  padding-top: 0px;

  & input {
    font-size: 1.5rem;
    text-align: center;
  }

  & input:focus {
    outline: 0;
    border: 1px solid var(--guardian-primary);
  }
}

/* b-card-body */
div.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;

  & .nickname {
    text-transform: capitalize;
  }
}

button.edit {
  align-self: flex-end;
  background-color: transparent;
  border: none;
  color: var(--guardian-primary);

  margin-top: 10px;
  margin-right: 10px;
}

div.control-group {
  display: flex;
  align-self: flex-end;
  margin-top: 15px;
  margin-bottom: 10px;
  align-items: center;

  & > * {
    margin-right: 10px;
  }

  & > button.complete {
    background-color: var(--guardian-primary);
    border: 1px solid var(--guardian-primary);
    color: white;
    font-size: 0.8rem;

    &:active {
      background-color: white;
      color: var(--guardian-primary);
    }
  }

  & > button.cancel {
    background-color: transparent;
    border: 1px solid var(--guardian-primary);
    color: var(--guardian-primary);
    font-size: 0.8rem;
  }
}
</style>
