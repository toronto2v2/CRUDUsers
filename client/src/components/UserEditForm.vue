<template>
  <div class="container">
    <!-- Adds/removes the "show" class -->
    <div v-bind:class="modalClass" class="modal-container">
      <div class="user-modal">
        <h3  class="text-info">Edit User</h3>
        <form>
          <div class="form-group">
            <label for="">Name</label>
            <input v-bind:value="user.name" required type="text" id="nameEdit" class="form-control"/>
          </div>
            <div class="form-group">
            <label for="">Surname</label>
            <input v-bind:value="user.surname" required type="text" id="surnameEdit" class="form-control"/>
          </div>
          <div class="form-group">
            <label for="">Email</label>
            <input v-bind:value="user.email" required type="text" id="emailEdit" class="form-control"/>
          </div>
          
          <div class="form-group">
            <label for="">Number</label>
            <input v-bind:value="user.number" required type="number" id="numberEdit" class="form-control"/>
          </div>

          <!-- when clicked, "showModal" becomes false -->
          <button v-on:click.prevent="showModal = !showModal" class="btn btn-secondary mr-1">Cancel</button>
          <button v-on:click="updateUser(user._id)" type="submit" class="btn btn-primary">Submit</button> 
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import { EventBus } from '../main.js';

export default {
  name: 'UserEditForm',
  data() {
    return {
      users: [],
      user: '',
      showModal: false
    }
  },
  methods: {
    // PUT request to update user information
    async updateUser(id) {
      await fetch(`http://localhost:3000/api/users/edit/${id}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ 
          name: document.getElementById('nameEdit').value,
          surname: document.getElementById('surnameEdit').value,
          email: document.getElementById('emailEdit').value,
          number: document.getElementById('numberEdit').value,
          events: [...this.user.events]
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        this.users = data;
      })
      .catch((err) => {
        console.error(err);
      });
    },

  },
  // When creating the component, we receive the data emitted from 'EventBus' here in this component
  created() {
    // click event
    EventBus.$on('click', (modal, user) => {
      this.showModal = !modal;
      this.user = user;

    })
  },
  // Function to put or remove the "show" class in Modal
  computed: {
    modalClass() {
      return this.showModal ? 'show' : '';
    }
  }
  
};
</script>

<style>
/* It is using the same stylization as the registration modal */
</style>
