<template>
  <div class="flex">
    <div class="flex-item">
      <div class="flex">
        <div class="flex-item img-container">
          <img class="flex" alt="githubers" src="githubers.png" />
        </div>
        <div class="flex-item">
          <h1>Githubers</h1>
        </div>
      </div>
    </div>
    <div class="flex-grow text-right">
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
  margin-right: 30px;
}
img {
  width: 100%;
  height: 100%;
}
.img-container {
  flex-basis: 80px;
  padding: 0 10px;
}
</style>
