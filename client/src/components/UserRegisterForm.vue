<template>
  <div class="container">
    <!-- "showModal" becomes true -->
    <button v-on:click="showModal = !showModal" 
            class="btn btn-lg btn-outline-primary float-right">
            Add new user
    </button>
    
    <!-- Adds/removes the "show" class -->
    <div v-bind:class="modalClass" class="modal-container">
      <div class="user-modal">
        <h3 class="text-primary">Add new user</h3>
        <form novalidate="true">
          <div class="form-group form-group_modifyed">
            <label for="nameRegister" >Name</label>
            <input required v-model="nameInput"  
                   @input="validateInput" 
                   type="text" 
                   name="name" 
                   id="nameRegister" 
                   class="form-control"/>
            <div v-if="nameInputValid" class="validationWarning">{{nameInputValid}}</div>
          </div>

          <div class="form-group form-group_modifyed">
            <label for="surnameRegister">Surname</label>
            <input required v-model="surnameInput" 
                   @input="validateInput" 
                   name='surname' 
                   type="text" 
                   id="surnameRegister" 
                   class="form-control"/>
            <div v-if="surnameInputValid" class="validationWarning">{{surnameInputValid}}</div>

          </div>
            
    
          <div class="form-group form-group_modifyed">
            <label for="emailRegister">Email</label>
            <input required v-model="emailInput"  
                   @input="validateInput" 
                   name='email' 
                   type="text" 
                   id="emailRegister" 
                   class="form-control"/>
            <div v-if="emailInputValid" class="validationWarning">{{emailInputValid}}</div>

          </div>
          
          <div class="form-group form-group_modifyed">
            <label for="numberRegister">Phone Number</label>
            <input required v-model="numberInput"  
                   @input="validateInput" 
                   name="number" 
                   type="number" 
                   id="numberRegister" 
                   class="form-control"/>
            <div v-if="numberInputValid" class="validationWarning">{{numberInputValid}}</div>
          </div>
            
          
          <!-- when clicked, "showModal" becomes false -->
          <div class="btn-group">
            <button v-on:click.prevent="showModal = !showModal, 
                    onModalCancel()" 
                    class="btn btn-secondary mr-1">
                    Cancel
            </button>
            <button v-on:click="createUser()" 
                    :disabled="isSubmitDisabled" 
                    type="submit" 
                    class="btn btn-primary">
                    Submit
            </button> 
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'UserRegisterForm',
  data() {
    return {
      users: [],
      showModal: false,

      nameInput:'',
      nameInputValid:false,

      surnameInput:'',
      surnameInputValid:false,

      emailInput: '',
      emailInputValid:false,

      numberInput: '',
      numberInputValid:false,

      isSubmitDisabled: true,
      
    };
  },
  methods: {
    // POST request to create a new user
    async createUser() {
      await fetch('http://localhost:3000/api/users/', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          name: document.getElementById('nameRegister').value,
          surname:document.getElementById('surnameRegister').value,
          email: document.getElementById('emailRegister').value,
          number: document.getElementById('numberRegister').value,

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
                    this.nameInputValid = /[^a-zа-яё ]/iu.test(this.nameInput) 
                                        ? 'Please use only letters' : false
                }else{
                    this.nameInputValid = ''
                }
            }
            break;

            case 'surname': {
                if(this.surnameInput.length == 0 && this.surnameInput.length < 2 ){
                    this.surnameInputValid = 'Please write more than 2 letters'
                }else if(this.surnameInput){
                    this.surnameInputValid = /[^a-zа-яё ]/iu.test(this.surnameInput) 
                                           ? 'Please use only letters' : false
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
  // Function to put or remove the "show" class in Modal
  computed: {
    modalClass() {
      return this.showModal ? 'show' : '';
    },




  }
};
</script>

<style>
.btn-group{
    margin-top: 5px;
}
.form-group_modifyed{
    position: relative;
    margin-bottom: 25px;
}
.validationWarning{
    color: rgba(192, 57, 33, 0.856);
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
}
.modal-container {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.3);
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;

  display: flex;
  align-items: center;
  justify-content: center;
  
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
}

.modal-container.show {
  opacity: 1;
  pointer-events: auto;
}

.user-modal {
  color: #535353;
  background-color: #fff;
  background-image: url("../assets/background.jpg");
  width: 450px;
  padding: 40px 50px;
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.user-modal h1 {
  margin: 0;
}

.user-modal p {
  opacity: 0.9;
}
</style>
