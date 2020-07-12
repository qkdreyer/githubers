<template>
  <div class="flex">
    <div class="flex-item">
      <a target="_blank" href="https://github.com/qkdreyer/githubers">
        <div class="flex">
          <div class="flex-item img-container">
            <img class="flex" alt="githubers" src="githubers.png" />
          </div>
          <div class="flex-item">
            <h1>Githubers</h1>
          </div>
        </div>
      </a>
    </div>
    <div class="flex-grow text-right">
      <Multiselect
        v-model="model"
        placeholder="Add a repository"
        tagPlaceholder="Press ENTER to add this repository"
        deselectLabel="Press ENTER to remove this repository"
        selectedLabel="Selected repository"
        :options="options"
        :multiple="true"
        :taggable="true"
        @input="onChange"
        @tag="addTag"
      />
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'Header',
  components: {
    Multiselect,
  },
  props: {
    repos: Array,
  },
  data() {
    return {
      model: this.repos,
      options: this.repos,
    }
  },
  methods: {
    onChange(value) {
      this.$emit('change', value)
    },
    addTag(value) {
      this.repos.push(value)
    },
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
hr {
  opacity: 0.5;
}
img {
  width: 100%;
  height: 100%;
}
a {
  text-decoration: none;
}
.img-container {
  flex-basis: 80px;
  padding: 0 10px;
}
</style>
