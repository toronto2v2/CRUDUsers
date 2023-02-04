<template>
  <div class="container">
    <h3 class="mt-2 mb-3 float-left text-primary">Users</h3>
    <!-- Users Table -->
    <table class="table table-striped">
      <thead>
        <tr  @click="onFiltersClick($event) ">
          <th :data-filter='"default"' scope="col">#</th>
          <th :data-filter='"surname"' scope="col">Surname</th>
          <th :data-filter='"name"' scope="col">Name</th>
          <th :data-filter='"email"' scope="col">E-mail</th>
          <th :data-filter='"number"' scope="col">PhoneNumber</th>
          <th :data-filter='"eventCount"' scope="col">Event Count</th>
          <th :data-filter='"closestEvent"'  scope="col">Closest Event</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody v-if="!filteredUsers" key="firstPlate">
        <!-- "v-for" directive to get API users -->
        <tr @click="onUserClick(user._id, $event, $router)"  v-for="(user, index) in users.users" :key="user._id"  class="m-5 sectionHover">
          <th class="index" scope="row">{{ index + 1 }}</th>
          <!-- <td>{{ user._id }}</td> -->
          <td class="surname">{{ user.surname }}</td>
          <td  class="name">{{ user.name }}</td>
          <td class="email">{{ user.email }}</td>
          <td class="number">{{ user.number }}</td>
          <td class="count" >{{ user.events.length }}</td>
          <td class="data"  >{{ user.closestEvent.toString()}}</td>

          <td>
            <form>
              <button v-on:click.prevent="emitShowModal(user)" class="btn btn-sm btn-info mr-1">Edit</button>
              <button v-on:click="deleteUser(user._id)" type="submit" class="btn btn-sm btn-danger">Delete</button>
            </form>
          </td>
          
        </tr>
      </tbody>

      <tbody v-if="filteredUsers" key="secondPlate">
        <!-- "v-for" directive to get API users -->
        <tr @click="onUserClick(user._id, $event, $router)"  v-for="(user, index) in filteredUsers" :key='user._id'  class="m-5 sectionHover">
          <th class="index" scope="row">{{ index + 1 }}</th>
          <!-- <td>{{ user._id }}</td> -->
          <td class="surname">{{ user.surname }}</td>
          <td class="name">{{ user.name }}</td>
          <td class="email">{{ user.email }}</td>
          <td class="number">{{ user.number }}</td>
          <td class="count" >{{ user.events.length }}</td>
          <td class="data"  >{{ user.closestEvent.toString() }}</td>

          <td>
            <form>
              <button v-on:click.prevent="emitShowModal(user)" class="btn btn-sm btn-info mr-1">Edit</button>
              <button v-on:click="deleteUser(user._id)" type="submit" class="btn btn-sm btn-danger">Delete</button>
            </form>
          </td>
          
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { EventBus } from '../main.js';

const filterByLetters = (activeFilter, originalUsers, curent) =>{
    if(activeFilter === 'default') return originalUsers

    const filteredUsers = [...originalUsers];


    if(activeFilter){

        filteredUsers.sort(function (a,b){
            if (a[activeFilter] < b[activeFilter]) {
                    return 1;
                }
                if (a[activeFilter] > b[activeFilter]) {
                    return -1;
                }
                return 0;
        })
    }else{

        filteredUsers.sort(function (a,b){
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

const filterByPhone = (activeFilter, originalUsers) => {
        const filteredUsers = [...originalUsers];

    if(activeFilter){

        filteredUsers.sort((a,b) => a.number - b.number)

    }else{
        filteredUsers.sort((a,b) => b.number - a.number)
    }
    return filteredUsers
}

const filterByEventCount = (activeFilter, originalUsers) => {
    const filteredUsers = [...originalUsers];
    if(activeFilter){
        filteredUsers.sort((a,b) => a.events.length - b.events.length)
    }else{
        filteredUsers.sort((a,b) => b.events.length - a.events.length)
    }
    return  filteredUsers
}

const filterByClosestEvent = (activeFilter, originalUsers) => {
        const filteredUsers = [...originalUsers];

    if(activeFilter){

        filteredUsers.sort((a,b) => a.number - b.number)

    }else{
        filteredUsers.sort((a,b) => b.number - a.number)
    }
    return filteredUsers
}
export default {
  name: 'UsersTable',
  data() {
    return {
      users: [],
      filteredUsers: false,
      showModal: false,
      activeFilter: ''
    }
  },
  // When creating the component, a GET request is made to the backend API
  async created() {
    await fetch('http://localhost:3000/api/users/')
    .then(response => response.json())
    .then(data => {
      this.users = data;
    })
    .catch(err => {
      console.error(err);
    });
  },
  methods: {
    // DELETE request to delete the user
    async deleteUser(id) {
      await fetch(`http://localhost:3000/api/users/delete/${id}`, {
        method: 'DELETE'
      })
      .then((response) => response.json())
      .catch((err) => {
        console.error(err);
      });
    },
     // Method uses 'EventBus' to be able to send data globally
     // --> Output data from "user" and "showModal"
    emitShowModal(user) {
      this.user = user;
      EventBus.$emit('click', this.showModal, this.user);
      
    },

    onUserClick(id, event, router){
        if(event.target.classList.contains('btn')){
            return
        }else{
            router.push(`/user/${id}`)
        }
    },

    onFiltersClick(e){
        
        if(this.activeFilter !== e.target.dataset.filter) this.activeFilter = '';
        
        this.activeFilter ? this.activeFilter = '' : this.activeFilter = e.target.dataset.filter;
        // this.filteredUsers = filter(this.activeFilter, this.users.users, e.target.dataset.filter);
        switch(e.target.dataset.filter){
            case 'phone' :
                this.filteredUsers = filterByPhone(this.activeFilter, this.users.users);
                break;
            case 'eventCount' :
                this.filteredUsers = filterByEventCount(this.activeFilter, this.users.users);
                break;
            case 'closestEvent' :
                this.filteredUsers = filterByClosestEvent(this.activeFilter, this.users.users);
                break;
            default:
                this.filteredUsers = filterByLetters(this.activeFilter, this.users.users, e.target.dataset.filter);
                break;
        }
        

    //    if (e.target.dataset.filter ==='phone'){
    //     this.filteredUsers = filterByPhone(this.activeFilter, this.users.users)
    //    }else if(e.target.dataset.filter ==='eventCount'){
    //         this.filteredUsers = filterByEventCount(this.activeFilter, this.users.users, e.target.dataset.filter)
    //    }else if () {

    //    }else{
    //         this.filteredUsers = filterByLetters(this.activeFilter, this.users.users, e.target.dataset.filter)
    //    }
    },


    },

}
</script>

<style scoped>
th {
  padding-left: 1.2rem;
}
.name, .surname, .number, .email, .data, .count, .index{
    cursor: pointer;
    transition:all .2s linear;
}

.sectionHover:hover .surname{
    background-color: rgba(44, 149, 236, 0.616);
}
.sectionHover:hover .name{
    background-color: rgba(44, 149, 236, 0.616);
}
.sectionHover:hover .number{
    background-color: rgba(44, 149, 236, 0.616);
}
.sectionHover:hover .email{
    background-color: rgba(44, 149, 236, 0.616);
}
.sectionHover:hover .data{
    background-color: rgba(44, 149, 236, 0.616);
}
.sectionHover:hover .count{
    background-color: rgba(44, 149, 236, 0.616);
}
.sectionHover:hover .index{
    background-color: rgba(44, 149, 236, 0.616);
}
</style>


