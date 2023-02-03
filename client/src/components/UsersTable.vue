<template>
  <div class="container">
    <h3 class="mt-2 mb-3 float-left text-primary">Users</h3>
    <!-- Users Table -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Surname</th>
          <!-- <th scope="col">User ID</th> -->
          <th scope="col">Name</th>
          <th scope="col">E-mail</th>
          <th scope="col">PhoneNumber</th>
          <th scope="col">Event Count</th>
          <th scope="col">Closest Event</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <!-- "v-for" directive to get API users -->
        <tr @click="onUserClick(user._id, $event, $router)" v-for="(user, index) in users.users" :key="user._id"  class="m-5 sectionHover">
          <th class="index" scope="row">{{ index + 1 }}</th>
          <!-- <td>{{ user._id }}</td> -->
          <td class="surname">{{ user.surname }}</td>
          <td class="name">{{ user.name }}</td>
          <td class="email">{{ user.email }}</td>
          <td class="number">{{ user.number }}</td>
          <td class="count" >{{ user.events.length }}</td>
          <td class="data"  >{{ getNearestData(user.events) }}</td>

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

export default {
  name: 'UsersTable',
  data() {
    return {
      users: [],
      showModal: false
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

    getNearestData(dataArr){
        if(!dataArr){
            return
        }

        if(dataArr.length == 0){
            return 'N/A'
        }
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const index = dataArr
            .map(({eventStart}, orginalIndex) => {
            const [y, m, d] = eventStart.split('-');
            return { sorter: new Date(y, m - 1, d), orginalIndex };
            })
            .sort((a, b) => a.sorter - b.sorter)
            .find(item => item.sorter >= today)
            ?.orginalIndex;

        return dataArr[index].eventStart ;
    }
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
