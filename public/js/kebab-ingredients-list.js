Vue.component(`kebab-ingredients-list`, {
    template: `
    <div>
        <hr><h2 class="subtitle">{{ title }}</h2><hr>
        <div v-for="ingredient in ingredients" style="margin-bottom: 0.5rem;">
            <div class="tags has-addons">
                <span class="tag is-light is-large">{{ ingredient }}</span>
                <button v-on:click="deleteIngredient(ingredient)" class="tag is-delete is-danger is-large" style="border: 0;"></button>
            </div>
        </div>
    </div>
  `,
    data() {
        return {
            title: "Kebab Ingredients List",
            ingredients: [],
            token: null
        }
    },
    methods: {
        populateTheList: function() {
            fetch(`/kebab-ingredients`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': this.token
                }
            })
            .then(response => response.json())
            .then(data => {
                data.forEach(ingredient => this.ingredients.push(ingredient.label));
            })
            .catch(error => {
                console.log(error);
            });
        },
        deleteIngredient: function(ingredient) {
            fetch(`/kebab-ingredients`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "text/plain",
                    "Authorization": "Bearer " + this.token
                },
                body: "label=" + ingredient
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.ingredients = this.ingredients.filter(item => item !== ingredient);
            })
            .catch(error => {
                console.log(error)
            });
        }
    },
    mounted() {
        this.populateTheList()

        this.$root.$on("add-ingredient", (ingredient) => {
            fetch(`/kebab-ingredients`, {
                method: 'POST',
                headers: {
                    "Content-Type": "text/plain",
                    "Authorization": "Bearer " + this.token
                },
                body: "label=" + ingredient
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.ingredients.push(ingredient);
            })
            .catch(error => {
                console.log(error)
            });
        });

        this.$root.$on("login", () => {
            let credentials = JSON.parse(window.localStorage.getItem('my_credentials'));
            this.token = (credentials == null || credentials == undefined)
                ? null
                : credentials.token
        });
    }
})
