Vue.component(`add-ingredient`, {
    template: `  
    <div class="field has-addons">
      <div class="control">
        <input v-model="ingredient" class="input" type="text" placeholder="Type ingredient">
      </div>
      <div class="control">
        <button v-on:click="addIngredient" class="button is-link">Add ingredient</button>
      </div>
    </div>
  `,
    data() {
        return {
            ingredient: null
        }
    },
    methods: {
        // Click button
        addIngredient(event) {
            this.$root.$emit("add-ingredient", this.ingredient)
            this.ingredient = null
        }
    }

});