<template>
  <div>
    <el-input-number v-model="input"></el-input-number>
    <span>{{ input }}</span>
  </div>
</template>

<script>
export default {
  name: 'Example',

  data() {
    return {
      input: ''
    }
  }
}
</script>
