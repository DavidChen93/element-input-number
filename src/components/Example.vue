<template>
  <div>
    <el-input-number v-model="input" :precision="2" :setp="0.01"></el-input-number>
    <span>用户输入：{{ input }}</span>
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
