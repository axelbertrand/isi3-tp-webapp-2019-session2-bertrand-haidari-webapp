Vue.component(`login`, {
    template: `
    <nav class="navbar has-background-grey-dark is-space">
        <div class="container">
            <div class="navbar-menu">
                <div class="navbar-start">
                    <template v-if="token === null">
                        <div class="navbar-item">
                            <input v-model="username" type="text" placeholder="Username" class="input">
                        </div>
                        <div class="navbar-item">
                            <input v-model="password" type="password" placeholder="Password" class="input">
                        </div>
                        <div class="navbar-item">
                            <button v-on:click="login" class="button is-info">
                                Log in
                            </button>
                        </div>
                        </template>
                        <template v-else>
                            <div class="navbar-item" style="color: lightgray">
                                {{ username }}
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  `,
    data() {
        return {
            username: null,
            password: null,
            token: null
        }
    },
    methods: {
        login(event) {
            fetch(`/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.username, pwd: this.password
                }), // body data type must match "Content-Type" header
            })
            .then(response => {
                return response.json()
            })
            .then(data =>  {
                this.token = (!data.jwt)
                    ? null
                    : JSON.stringify({token: data.jwt, user: this.username});

                window.localStorage.setItem('my_credentials', this.token);
                this.$root.$emit("login");
            })
            .catch(error => {});
        }
    }
})
