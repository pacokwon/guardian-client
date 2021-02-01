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
    <div v-else class="edit-button-group">
      <b-button class="delete" variant="outline-primary" v-b-modal.delete-modal>
        <b-icon-trash-fill />
      </b-button>
      <b-button
        class="edit"
        variant="outline-primary"
        @click="toggleEditAndFocus"
      >
        <b-icon-pencil-square />
      </b-button>
    </div>
    <b-modal id="delete-modal" title="Delete User?" ref="delete-modal">
      Are you sure you want to delete this user?
      <template #modal-footer="{ cancel }">
        <div>
          <b-button
            class="modal-delete"
            variant="outline-primary"
            @click="handleDelete"
          >
            Delete
          </b-button>
          <b-button
            class="modal-cancel"
            variant="outline-primary"
            @click="cancel()"
          >
            Cancel
          </b-button>
        </div>
      </template>
    </b-modal>
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
import { BvEvent } from 'bootstrap-vue';
import { BModal } from 'bootstrap-vue/src/components/modal';
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
    },
    async handleDelete(bvModalEvent: BvEvent) {
      bvModalEvent.preventDefault();

      const { id } = this;
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteUser(id: $id) {
              success
            }
          }
        `,
        variables: { id }
      });

      (this.$refs['delete-modal'] as BModal).hide();

      if (result?.data?.deleteUser?.success) {
        this.$bvToast.toast(
          'User has been successfully updated. Navigating to home...',
          {
            title: 'Guardian',
            autoHideDelay: 2000,
            variant: 'primary'
          }
        );

        await new Promise(res => setTimeout(res, 2000)).then(() => {
          this.$router.push('/');
        });
      } else {
        this.$bvToast.toast('Error has occurred while deleting user!', {
          title: 'Guardian',
          autoHideDelay: 5000,
          variant: 'danger'
        });
      }
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

div.edit-button-group {
  align-self: flex-end;
  margin-top: 10px;
  margin-right: 10px;
}

button.edit {
  background-color: transparent;
  border: none;
  color: var(--guardian-primary);
}

button.delete {
  background-color: transparent;
  border: none;
  color: var(--guardian-red-400);

  &:active {
    background-color: var(--guardian-red-400) !important;
    color: white !important;
  }

  &:focus {
    box-shadow: none; /* remove bootstrap style */
  }
}

#delete-modal {
  & button.modal-delete {
    color: var(--guardian-red-400);
    border: none;

    &:hover,
    &:active {
      background-color: var(--guardian-red-400);
      color: white;
    }
  }
}

button.modal-cancel {
  border: none;
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
