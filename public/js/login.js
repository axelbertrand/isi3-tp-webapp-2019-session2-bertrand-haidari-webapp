Vue.component(`login`, {
    template: `
    <div class="control">
        <input v-model="username" type="text" id="username" name="username" placeholder="Username" class="input">
    </div>
    <div class="control">
        <input v-model="password" type="password" id="password" name="password" placeholder="Password" class="input">
    </div>
    <div class="control">
        <button v-on:click="login" class="button is-info">
            Log in
        </button>
    </div>
  `,
    data() {
        return {
            username: "",
            password: ""
        }
    },
    methods: {
        login: function() {
            fetch(`/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username, pwd: password
                }), // body data type must match "Content-Type" header
            })
            .then(response => {
                return response.json()
            })
            .then(data =>  {
                if(!data.token) {
                    window.localStorage.setItem('my_credentials', null)
                } else {
                    window.localStorage.setItem('my_credentials', JSON.stringify({token: data.token, user: username}))
                }
            })
            .catch(error => {});
        }
    }
})
