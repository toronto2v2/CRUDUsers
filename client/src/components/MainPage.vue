<template>
    <div class="MainWrapper">
        <Header />
        <UserRegisterForm />
        <UserEditForm />
        <UsersTable />
    </div>
</template>

<script>
import Header from './Header.vue';
import UserRegisterForm from './UserRegisterForm.vue';
import UserEditForm from './UserEditForm.vue';
import UsersTable from './UsersTable.vue';


export default {
  name: 'MainPage',
  components: {
    Header,
    UserRegisterForm,
    UsersTable,
    UserEditForm
  }
}
</script>

<style>
    
</style>