Vue.component(`login`, {
    template: `
    <nav class="navbar has-background-grey-dark is-space">
        <div class="container">
            <div class="navbar-menu">
                <div class="navbar-start">
                    <template v-if="!connected">
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
                            <div class="navbar-item">
                                <button v-on:click="logout" class="button is-danger">
                                    Log out
                                </button>
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
            connected: false
        }
    },
    methods: {
        login() {
            fetch(`/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.username, pwd: this.password
                }), // body data type must match "Content-Type" header
            })
            .then(response => response.json())
            .then(data =>  {
                let token = (!data.jwt)
                    ? null
                    : JSON.stringify({token: data.jwt, user: this.username});

                window.localStorage.setItem('my_credentials', token);
                this.connected = true;
                this.$root.$emit("log-action");
            })
            .catch(error => {});
        },
        logout() {
            window.localStorage.setItem('my_credentials', null);
            this.connected = false;
            this.username = null;
            this.password = null;
            this.$root.$emit("log-action");
        }
    }
})
