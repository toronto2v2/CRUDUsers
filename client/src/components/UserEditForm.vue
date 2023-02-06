<template>
  <div class="container">
    <!-- Adds/removes the "show" class -->
    <div v-bind:class="modalClass" class="modal-container">
      <div class="user-modal">
        <h3  class="text-info">Edit User</h3>
        <form novalidate="true">
          <div class="form-group form-group_modifyed">
            <label for="">Name</label>
            <input v-model="nameInput" 
                   required type="text" 
                   id="nameEdit"
                   name='name' 
                   class="form-control"
                   @input="validateInput"/>
            <div v-if="nameInputValid" class="validationWarning">{{nameInputValid}}</div>
          </div>
            <div class="form-group form-group_modifyed">
            <label for="">Surname</label>
            <input v-model="surnameInput" 
                   required type="text" 
                   name='surname' 
                   id="surnameEdit" 
                   class="form-control"
                   @input="validateInput"/>
            <div v-if="surnameInputValid" class="validationWarning">{{surnameInputValid}}</div>
          </div>
          <div class="form-group form-group_modifyed">
            <label for="">Email</label>
            <input v-model="emailInput" 
                   required type="text" 
                   name='email' 
                   id="emailEdit" 
                   class="form-control"
                   @input="validateInput"/>
            <div v-if="emailInputValid" class="validationWarning">{{emailInputValid}}</div>
          </div>
          
          <div class="form-group form-group_modifyed">
            <label for="">Number</label>
            <input v-model="numberInput"
                   required type="number"
                   name='number'  
                   id="numberEdit" 
                   class="form-control"
                   @input="validateInput"/>
            <div v-if="numberInputValid" class="validationWarning">{{numberInputValid}}</div>
          </div>

          <!-- when clicked, "showModal" becomes false -->
          <button v-on:click.prevent="showModal = !showModal" 
                  class="btn btn-secondary mr-1">
                  Cancel
          </button>
          <button v-on:click="updateUser(user._id); onModalCancel()" 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="isSubmitDisabled">
                  Submit
          </button> 
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
      showModal: false,

      nameInput:'',
      nameInputValid:false,

      surnameInput:'',
      surnameInputValid:false,

      emailInput: '',
      emailInputValid:false,

      numberInput: '',
      numberInputValid:false,

      isSubmitDisabled: false,
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

    
    validateInput(e){
        switch(e.target.name){
            case 'name':{
                if(this.nameInput.length == 0 && this.nameInput.length < 2 ){
                    this.nameInputValid = 'Please write more than 2 letters'
                }else if(this.nameInput){
                    this.nameInputValid = /[^a-zа-яё ]/iu.test(this.nameInput) ? 'Please use only letters' : false
                }else{
                    this.nameInputValid = ''
                }
            }
            break;

            case 'surname': {
                if(this.surnameInput.length == 0 && this.surnameInput.length < 2 ){
                    this.surnameInputValid = 'Please write more than 2 letters'
                }else if(this.surnameInput){
                    this.surnameInputValid = /[^a-zа-яё ]/iu.test(this.surnameInput) ? 'Please use only letters' : false
                }else{
                    this.surnameInputValid = ''
                }
            }
            break;

            case 'email': {
                if(this.emailInput.length == 0){
                    this.emailInputValid = 'Write your email';
                }else if (this.emailInput){
                    this.emailInputValid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                          .test(this.emailInput) ? 
                                           false : 'Please write valid email'
                }else{
                    this.emailInputValid = ''
                }
            }
            break;

            case 'number':{
                if(this.numberInput.length >= 0 && this.numberInput.length < 10){
                    this.numberInputValid = 'Your number is too short';
                }else if (this.numberInput){
                    this.numberInputValid = /^\d+$/.test(this.numberInput) ? 
                                            false : 'Please use only numbers'
                }else{
                    this.numberInputValid = ''
                }
            }
            break;
            default: return
        }

        this.isSubmitDisabled = (!this.nameInputValid && this.nameInput) 
                              && (!this.surnameInputValid && this.surnameInput)
                              &&(!this.numberInputValid && this.numberInput) 
                              && (!this.emailInputValid && this.emailInput) 
                              ? false : true;

    },

    onModalCancel(){
        this.nameInputValid = false;
        this.surnameInputValid = false;
        this.emailInputValid = false;
        this.numberInputValid = false;

    }

  },

  // When creating the component, we receive the data emitted 
  //   from 'EventBus' here in this component
  created() {
    // click event
    EventBus.$on('click', (modal, user) => {
      this.showModal = !modal;
      this.nameInput = user.name;
      this.surnameInput = user.surname;
      this.emailInput = user.email;
      this.numberInput = user.number;


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
</style>
