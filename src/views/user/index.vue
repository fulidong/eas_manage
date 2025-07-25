<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { getUserList } from '@/api/user.js'
export default {
  name: 'UserBase',
  data() {
    return {
      params: {
        key_word: '',
        user_status: -1,
        user_type: -1,
        page_index: 1,
        page_size: 10
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
