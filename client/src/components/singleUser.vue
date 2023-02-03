<template>
    <div class="container">
      <a href="http://localhost:8080" class="btn btn-primary mr-1">Back home</a>

        <h3 v-if='this.users[0]' class="mt-5 mb-5 text-center text-primary">{{`${users[0].name} ${users[0].surname}`}}</h3>
        <h4 class="mt-2 mb-3 float-left text-primary">Events</h4>
        <button v-on:click="showModal = !showModal" class="btn btn-lg btn-outline-primary float-right">Add new event</button>

        <table class="table table-striped">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            <th scope="col"></th>
            </tr>
        </thead>
        <tbody v-if="users[0]">
            <!-- "v-for" directive to get API users -->
            <tr v-for="(user, index) in users[0].events" :key="user._id" class="m-5">
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
          <div class="form-group">
            <label for="titleRegister">Title</label>
            <input required value="" type="text" id="titleRegister" class="form-control"/>
          </div>

          <div class="form-group">
            <label for="descriptionRegister">Description</label>
            <input required value="" name='surname' type="text" id="descriptionRegister" class="form-control"/>
          </div>
    
          <div class="form-group">
            <label for="startRegister">Start date</label>
            <input required value="" type="date" id="startRegister" class="form-control"/>
          </div>
          
          <div class="form-group">
            <label for="endRegister">End date</label>
            <input required value="" type="date" id="endRegister" class="form-control"/>
          </div>
          
          <!-- when clicked, "showModal" becomes false -->
          <button v-on:click.prevent="showModal = !showModal" class="btn btn-secondary mr-1">Cancel</button>
          <button v-on:click="updateUser()"  type="submit" class="btn btn-primary">Submit</button> 
        </form>
      </div>
    </div>
    </div>
    

</template>

<script>
export default{
    name: 'SingleUser',
    data(){
        return{
            users:[],
            showModal: false,
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
            eventCount: this.users[0].eventCount + 1
            
        
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
    computed: {
        modalClass() {
            return this.showModal ? 'show' : '';
        }
    }
}

</script>

<style>
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