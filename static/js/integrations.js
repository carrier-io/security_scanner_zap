const Zap = {
    edit: data => {
        console.log('editIntegration', data)
        const {description, is_default, id, settings} = data
        zapVm.load({...settings, description, is_default, id})
        zapVm.modal.modal('show')
    },
    delete: id => {
        zapVm.load({id})
        zapVm.delete()
    },
    defaultTemplate: '',
    initialState: () => ({
        description: '',
        is_default: false,
        is_fetching: false,
        error: {},
        test_connection_status: 0,
        id: null,


    })
}


const zapApp = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            pluginName: 'scanner_zap',
            modal: $('#scanner_zap_integration'),
            ...Zap.initialState()
        }
    },
    mounted() {
        this.modal.on('hidden.bs.modal', e => {
            this.clear()
        })
    },
    computed: {
        apiPath() {
            return `/api/v1/integrations/${this.pluginName}/`
        },
        project_id() {
            return getSelectedProjectId()
        },
        body_data() {
            const {
                host,
                port,
                user,
                password: passwd,
                sender,
                description,
                is_default,
                project_id,
                base64Template: template
            } = this
            return {host, port, user, passwd, sender, description, is_default, project_id, template}
        },
        test_connection_class() {
            if (200 <= this.test_connection_status && this.test_connection_status < 300) {
                return 'btn-success'
            } else if (this.test_connection_status > 0) {
                return 'btn-warning'
            } else {
                return 'btn-secondary'
            }
        },
    },
    watch: {
        is_fetching(newState, oldState) {
            if (newState) {
                this.test_connection_status = 0
            }
        }
    },
    methods: {
        loadBase64(b64text) {
            if (b64text === '') return ''
            try {
                return atob(b64text)
            } catch (e) {
                console.error(e)
                this.error.template = 'Only files of data:text/html;base64 are supported'
                this.template = ''
                this.fileName = ''
                return ''
            }
        },
        test_connection() {
            this.is_fetching = true
            fetch(this.apiPath + 'check_settings', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.body_data)
            }).then(response => {
                console.log(response)
                this.is_fetching = false
                this.test_connection_status = response.status
                if (!response.ok) {
                    this.handleError(response)
                }
            })
        },
        clear() {
            Object.assign(this.$data, {
                ...this.$data,
                ...Zap.initialState(),
            })
        },
        load(stateData) {
            Object.assign(this.$data, {
                ...this.$data,
                ...stateData,
                template: this.loadBase64(stateData.template)
            })
        },
        create() {
            this.is_fetching = true
            fetch(this.apiPath, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.body_data)
            }).then(response => {
                this.is_fetching = false
                if (response.ok) {
                    this.modal.modal('hide')
                    location.reload()
                } else {
                    this.handleError(response)
                }
            })
        },
        handleError(response) {
            try {
                response.json().then(
                    errorData => {
                        console.log(errorData)
                        errorData.forEach(item => {
                            console.log('item error', item)
                            this.error = {[item.loc[0]]: item.msg}
                        })
                    }
                )
            } catch (e) {
                alertMain.add(e, 'danger-overlay')
            }
        },
        update() {
            this.is_fetching = true
            fetch(this.apiPath + this.id, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.body_data)
            }).then(response => {
                this.is_fetching = false
                if (response.ok) {
                    this.modal.modal('hide')
                    location.reload()
                } else {
                    this.handleError(response)
                }
            })
        },
        delete() {
            this.is_fetching = true
            fetch(this.apiPath + this.id, {
                method: 'DELETE',
            }).then(response => {
                this.is_fetching = false
                if (response.ok) {
                    location.reload()
                } else {
                    this.handleError(response)
                    alertMain.add(`Deletion error. <button class="btn btn-primary" @click="modal.modal('show')">Open modal<button>`)
                }
            })
        },
    }
})

zapApp.config.compilerOptions.isCustomElement = tag => ['h9', 'h13'].includes(tag)

const zapVm = zapApp.mount('#scanner_zap_integration')
