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
        @click="requestPetUpdate"
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
    <b-modal id="delete-modal" title="Delete Pet?" ref="delete-modal">
      Are you sure you want to delete this pet?
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
    <b-card-body v-if="editing" class="edit-container">
      <b-overlay :show="imageUpdateStatus === UpdateStatus.UPDATING">
        <b-img
          rounded="circle"
          :src="editedFields.imageUrl"
          @error="setAltImage"
        />
      </b-overlay>
      <input
        class="edit-nickname"
        type="text"
        v-model="editedFields.nickname"
        ref="nickname"
      />
      <input
        class="edit-image"
        type="text"
        v-model="editedFields.imageUrl"
        @focus="imageUpdateStatus = UpdateStatus.UPDATING"
        @blur="imageUpdateStatus = UpdateStatus.FINISHED"
      />
      <div class="badge-group">
        <species-badge
          class="selectable-badge"
          species="cat"
          :disabled="editedFields.species !== 'cat'"
          @click.native="editedFields.species = 'cat'"
        />
        <species-badge
          class="selectable-badge"
          species="dog"
          :disabled="editedFields.species !== 'dog'"
          @click.native="editedFields.species = 'dog'"
        />
      </div>
    </b-card-body>
    <b-card-body v-else>
      <b-img rounded="circle" :src="imageUrl" @error="setAltImage" />
      <h2 class="nickname">
        {{ nickname }}
      </h2>
      <species-badge :species="species" />
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import SpeciesBadge from '@/components/SpeciesBadge.vue';
import { getAltImage } from '@/utils';

enum UpdateStatus {
  UPDATING,
  FINISHED
}

export default Vue.extend({
  name: 'pet-profile',
  components: {
    SpeciesBadge
  },
  props: {
    id: { type: String, required: true },
    nickname: { type: String, required: true },
    species: { type: String, required: true },
    imageUrl: { type: String, required: true }
  },
  data() {
    return {
      editing: false,
      editedFields: {
        nickname: this.nickname,
        species: this.species,
        imageUrl: this.imageUrl
      },
      UpdateStatus,
      updateState: UpdateStatus.FINISHED,
      imageUpdateStatus: UpdateStatus.FINISHED
    };
  },
  methods: {
    setAltImage(event: ErrorEvent) {
      (event.target as HTMLImageElement).src = getAltImage(this.id);
    },
    cancelEditing() {
      this.editing = !this.editing;
    },
    toggleEditAndFocus() {
      this.editing = !this.editing;

      this.$nextTick(() => {
        (this.$refs.nickname as HTMLInputElement).focus();
        (this.$refs.nickname as HTMLInputElement).select();
      });
    },
    async requestPetUpdate() {
      const { id } = this;
      const { nickname, imageUrl, species } = this.editedFields;

      if (
        nickname === this.nickname &&
        imageUrl === this.imageUrl &&
        species === this.species
      ) {
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
          mutation(
            $id: ID!
            $nickname: String
            $imageUrl: String
            $species: String
          ) {
            updatePet(
              input: {
                id: $id
                nickname: $nickname
                imageUrl: $imageUrl
                species: $species
              }
            ) {
              id
              nickname
              imageUrl
              species
            }
          }
        `,
        variables: { id, nickname, imageUrl, species }
      });

      await new Promise(res => setTimeout(res, 1000));
      this.updateState = UpdateStatus.FINISHED;

      if (result?.data?.updatePet?.id) {
        this.$bvToast.toast('Pet info has been successfully updated', {
          title: 'Guardian',
          autoHideDelay: 5000,
          variant: 'primary'
        });

        this.editing = !this.editing;
        this.$emit('update:nickname', nickname);
        this.$emit('update:imageUrl', imageUrl);
        this.$emit('update:species', species);
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
        this.editedFields.nickname = this.nickname;
        this.editedFields.imageUrl = this.imageUrl;
        this.editedFields.species = this.species;
      }
    },
    async handleDelete(bvModalEvent) {
      bvModalEvent.preventDefault();

      const { id } = this;
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($id: ID!) {
            deletePet(id: $id) {
              success
            }
          }
        `,
        variables: { id }
      });

      this.$refs['delete-modal'].hide();

      if (result?.data?.deletePet?.success) {
        this.$bvToast.toast(
          'Pet has been successfully deleted. Navigating to the pets tab...',
          {
            title: 'Guardian',
            autoHideDelay: 2000,
            variant: 'primary'
          }
        );

        await new Promise(res => setTimeout(res, 2000)).then(() => {
          this.$router.push('/pets');
        });
      } else {
        this.$bvToast.toast('Error has occurred while deleting pet!', {
          title: 'Guardian',
          autoHideDelay: 5000,
          variant: 'danger'
        });
      }
    }
  },
  watch: {
    nickname(val: string) {
      this.editedFields.nickname = val;
    },
    imageUrl(val: string) {
      this.editedFields.imageUrl = val;
    },
    species(val: string) {
      this.editedFields.species = val;
    }
  }
});
</script>

<style scoped>
img {
  object-fit: cover;
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
}

/* b-card */
div.card {
  align-items: center;
  box-shadow: 1px 3px 8px -3px gray;
}

/* b-card-body */
div.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0px;

  & .nickname {
    text-transform: capitalize;
  }
}

div.card-body.edit-container {
  & > * {
    margin-bottom: 10px;
  }

  & > .edit-nickname {
    font-size: 1.5rem;
    text-align: center;
  }

  & > .edit-nickname:focus {
    outline: 0;
    border: 1px solid var(--guardian-primary);
  }

  & > .edit-image {
    font-size: 1rem;
    text-align: center;
    width: 100%;
  }

  & > .edit-image:focus {
    outline: 0;
    border: 1px solid var(--guardian-primary);
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

div.badge-group {
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  width: 100%;
}

span.selectable-badge {
  font-size: 1rem;

  &:hover {
    cursor: pointer;
  }

  &[disabled] {
    opacity: 0.4;
  }
}
</style>
