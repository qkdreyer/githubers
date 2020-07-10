<template>
  <div class="flex">
    <div class="flex-item">
      <h1>Githubers</h1>
    </div>
    <div class="flex-item">
      <input type="text" :value="repo" @change="onChange" @keyup.13="onChange" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Header',
  props: {
    repo: String,
  },
  methods: {
    onChange({ target: { value } }) {
      this.$emit('change', value);
    }
  }
}
</script>

<style scoped>
hr {
  opacity: 0.5;
}
input {
  padding: 10px 5px;
  width: 250px;
}
.flex {
  margin: 0 3%;
}
</style>
