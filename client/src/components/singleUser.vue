<template>
    <div class="container">
      <router-link :to="{path:'/'}" class="btn btn-primary mr-1">Back home</router-link>

        <h3 v-if='this.users[0]' 
            class="mt-5 mb-5 text-center text-primary">
            {{`${users[0].name} ${users[0].surname}`}}
        </h3>

        <h4 class="mt-2 mb-3 float-left text-primary">Events</h4>
        <button v-on:click="showModal = !showModal" 
                class="btn btn-lg btn-outline-primary float-right">
                Add new event
        </button>

        <table class="table table-striped">
        <thead>
            <tr @click="onFiltersClick($event)">
                <th :data-filter='"default"' scope="col">#</th>
                <th :data-filter='"eventTitle"' scope="col">Title</th>
                <th :data-filter='"eventDescr"' scope="col">Description</th>
                <th :data-filter='"eventStart"' scope="col">Start Date</th>
                <th :data-filter='"eventEnd"' scope="col">End Date</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody v-if="users[0] && !filteredEvents">
            <!-- "v-for" directive to get API users -->
            <tr v-for="(user, index) in users[0].events" 
                :key="user._id" class="m-5"
                >
                <th scope="row">{{ index + 1 }}</th>
                    <td>{{user.eventTitle}}</td>
                    <td>{{user.eventDescr}}</td>
                    <td>{{user.eventStart}}</td>
                    <td>{{user.eventEnd}}</td>
                <td></td>            
            </tr>
        </tbody>

        <tbody v-if="users[0] && filteredEvents">
            <!-- "v-for" directive to get API users -->
            <tr v-for="(user, index) in filteredEvents[0].events" 
                :key="user._id" class="m-5"
                >
                <th scope="row">{{ index + 1 }}</th>
                    <td>{{user.eventTitle}}</td>
                    <td>{{user.eventDescr}}</td>
                    <td>{{user.eventStart}}</td>
                    <td>{{user.eventEnd}}</td>
                <td></td>

            

            </tr>
        </tbody>
    </table>

        <div v-bind:class="modalClass" class="modal-container">
      <div class="user-modal">
        <h3 class="text-primary">Add new event</h3>
        <form>
          <div class="form-group form-group_modifyed">
            <label for="titleRegister">Title</label>
            <input required value="" 
                   type="text" 
                   id="titleRegister" 
                   class="form-control"
                   name="title"
                   v-model="titleInput"
                   @input="validateInput"/>
                   <div v-if="titleInputValid" class="validationWarning">{{titleInputValid}}</div>
          </div>

          <div class="form-group form-group_modifyed">
            <label for="descriptionRegister">Description</label>
            <input required value="" 
                   type="text" id="descriptionRegister" 
                   class="form-control"
                   name="descr"
                   v-model="descrInput"
                   @input="validateInput"/>
                   <div v-if="descrInputValid" class="validationWarning">{{descrInputValid}}</div>
          </div>
    
          <div class="form-group form-group_modifyed">
            <label for="startRegister">Start date</label>
            <input required value="" 
                   type="date" 
                   id="startRegister" 
                   class="form-control"
                   name="startDate"
                   v-model="startDateInput"
                   @input="validateInput"/>
                   <div v-if="startDateInputValid" class="validationWarning">{{startDateInputValid}}</div>
          </div>
          
          <div class="form-group form-group_modifyed">
            <label for="endRegister">End date</label>
            <input required value="" 
                   type="date" 
                   id="endRegister" 
                   class="form-control"
                   name="endDate"
                   @input="validateInput"
                   v-model="endDateInput"/>
                   <div v-if="endDateInputValid" class="validationWarning">{{endDateInputValid}}</div>
          </div>
          
          <!-- when clicked, "showModal" becomes false -->
          <button v-on:click.prevent="showModal = !showModal
                  onModalCancel()" 
                  class="btn btn-secondary mr-1"
                  >Cancel
          </button>
          <button v-on:click="updateUser()"  
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="isSubmitDisabled"
                  >Submit
          </button> 
        </form>
      </div>
    </div>
    </div>
    

</template>

<script>

const filterByDateEvent = (activeFilter, originalUsers, current) => {
        const filteredUsers = [{
            ...originalUsers, 
            events: originalUsers.events.map(iv =>  ({...iv})) 
            }];

    if(activeFilter){

        filteredUsers[0].events.sort(
            (a,b) => +a[current].replace(/\D/g, '') - +b[current].replace(/\D/g, '')
        )

    }else{
        filteredUsers[0].events.sort(
            (a,b) => +b[current].replace(/\D/g, '') - +a[current].replace(/\D/g, '')
        )
    }
    return filteredUsers
}

const filterByLetters = (activeFilter, originalUsers, curent) =>{

    const filteredUsers = [{
        ...originalUsers, 
        events: originalUsers.events.map(iv =>  ({...iv}))
        }];


    if(activeFilter){

        filteredUsers[0].events.sort(function (a,b){
            if (a[curent] < b[curent]) {
                    return 1;
                }
                if (a[curent] > b[curent]) {
                    return -1;
                }
                return 0;
        })
    }else{

        filteredUsers[0].events.sort(function (a,b){
            if (a[curent] > b[curent]) {
                    return 1;
                }
                if (a[curent] < b[curent]) {
                    return -1;
                }
                return 0;
        })

    }
    return filteredUsers
}

export default{
    name: 'SingleUser',
    data(){
        return{
            users:[],
            showModal: false,
            filteredEvents: false,
            activeFilter:'',

            titleInput:'',
            titleInputValid:false,

            descrInput:'',
            descrInputValid:false,

            startDateInput: '',
            startDateInputValid:false,

            endDateInput: '',
            endDateInputValid:false,

            isSubmitDisabled: true,
        }
    },

    async created() {
    await fetch('http://localhost:3000/api/users/')
    .then(response => response.json())
    .then(data => {
      this.users = data.users.filter(item => item._id == this.$route.params.id);
    })
    .catch(err => {
      console.error(err);
    });
    },
methods: {
    // PUT request to update user information
    
    async updateUser() {
      await fetch(`http://localhost:3000/api/users/edit/${this.$route.params.id}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            ...this.users[0],
            events:[...this.users[0].events,
            {
                eventTitle: document.getElementById('titleRegister').value,
                eventDescr: document.getElementById('descriptionRegister').value,
                eventStart: document.getElementById('startRegister').value,
                eventEnd: document.getElementById('endRegister').value
            }],
            eventCount: this.users[0].eventCount + 1,
            closestEvent: this.users[0].closestEvent === 'N/A' ? 
                          [document.getElementById('startRegister').value] : 
                          this.getNearestData([...this.users[0].closestEvent, 
                            document.getElementById('startRegister').value])
            
        
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

    getNearestData(dataArr){
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const index = dataArr
                .map((data, orginalIndex) => {
                    const [y,m,d] = data.split('-');
                    return{ sorter: new Date(y, m - 1, d), orginalIndex };
                })
                .sort((a, b) => a.sorter - b.sorter)
                .find(item => item.sorter >= today)
                ?.orginalIndex;
            return dataArr[index] ;
    },

    onFiltersClick(e){
        
        if(this.activeFilter !== e.target.dataset.filter) this.activeFilter = '';
        
        this.activeFilter ? 
            this.activeFilter = '' : 
            this.activeFilter = e.target.dataset.filter;

        switch(e.target.dataset.filter){
            case 'default':
                this.filteredEvents =[{
                    ...this.users[0], 
                    events: this.users[0].events.map( 
                        ivent => ({...ivent}) ) 
                    }];
                break;
            case 'eventStart':
                this.filteredEvents = filterByDateEvent(this.activeFilter, this.users[0], e.target.dataset.filter);
                break;
            case 'eventEnd':
                this.filteredEvents = filterByDateEvent(this.activeFilter, this.users[0], e.target.dataset.filter)
                break;
            default:
                console.log(e.target.dataset.filter);
                this.filteredEvents = filterByLetters (this.activeFilter, this.users[0], e.target.dataset.filter);
                break;
        }
        
    },

    validateInput(e){
        switch(e.target.name){
            case 'startDate':{
                if(this.startDateInput.length == 0 && this.startDateInput.length < 8 ){
                    this.startDateInputValid = 'Please write correct date'
                }else if(this.startDateInput){
                    const status = this.users[0].events.some(
                        el => (+el.eventStart.replace(/-/g, '') <= +this.startDateInput.replace(/-/g, '') 
                              && +this.startDateInput.replace(/-/g, '') <= +el.eventEnd.replace(/-/g, ''))
                    
                    )
                    console.log(`status`);
                    this.startDateInputValid = status ? 'You already have event for this date' : false
                }else{
                    this.startDateInputValid = ''
                }
            }
            break;

            case 'endDate': {
                console.log(`end`);
                if(this.endDateInput.length == 0 && this.endDateInput.length < 8 ){
                    this.endDateInputValid = 'Please write correct date'
                }else if(this.endDateInput){
                        const status = this.users[0].events.some(
                        el => (+el.eventEnd.replace(/-/g, '') >= +this.endDateInput.replace(/-/g, '') 
                              && +this.endDateInput.replace(/-/g, '') >= +el.eventStart.replace(/-/g, ''))
                              
                    )
                    console.log(`status2`);
                    this.endDateInputValid = status ? 'You already have event for this date' : false
                }else{
                    this.endDateInputValid = ''
                }
            }
            break;

            case 'title':{
                if(this.titleInput.length == 0 || this.titleInput.length < 5 ){
                    this.titleInputValid = 'Please write longer title'
                }else{
                    this.titleInputValid = ''
                }
            }
            break;

            case 'descr':{
                if(this.descrInput.length == 0 || this.descrInput.length < 10 ){
                    this.descrInputValid = 'Please write longer description'
                }else{
                    this.descrInputValid = ''
                }
            }
            
        }

        this.isSubmitDisabled = (!this.titleInputValid && this.titleInput) 
                              && (!this.descrInputValid && this.descrInput)
                              &&(!this.startDateInputValid && this.startDateInput) 
                              && (!this.endDateInputValid && this.endDateInput) 
                              ? false : true;

    },

    onModalCancel(){
        this.titleInputValid = false;
        this.descrInputValid = false;
        this.startDateInputValid = false;
        this.endDateInputValid = false;

    }
  },
    computed: {
        modalClass() {
            return this.showModal ? 'show' : '';
        }
    }
}

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
    th {
    padding-left: 1.2rem;
    cursor: pointer;
    transition: all .2s linear;
    }
    th:hover{
        background-color: antiquewhite;
    }
    .test{
        margin-top: 100px;
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