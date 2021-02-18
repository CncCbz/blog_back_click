<template>
  <div class="login">
    <register-login />
  </div>
</template>

<script>
  import registerLogin from '@/components/register-login/register-login.vue';
  export default {
    name: 'Login',
    components: {
      registerLogin
    }
  };
</script>
