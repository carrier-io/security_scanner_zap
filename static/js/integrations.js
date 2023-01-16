// const Zap = {
//     edit: data => {
//
//     },
//     delete: id => {
//         zapVm.load({id})
//         zapVm.delete()
//     },
//     defaultTemplate: '',
//
//     pluginName: 'security_scanner_zap'
// }


const ZapIntegration = {
    delimiters: ['[[', ']]'],
    props: ['instance_name', 'display_name', 'default_template', 'logo_src', 'section_name'],
    emits: ['update'],
    template: `
<div
    :id="modal_id"
    class="modal modal-small fixed-left fade shadow-sm" tabindex="-1" role="dialog"
>
    <ModalDialog
            v-model:description="description"
            v-model:is_default="is_default"
            @update="update"
            @create="create"
            :display_name="display_name"
            :id="id"
            :is_fetching="is_fetching"
            :is_default="is_default"
    >
        <template #body>
            <div class="form-group">
                <div class="form-group">
                    <h9>Scan Types</h9>
                    <div class="form-check"
                         :class="{ 'is-invalid': error.scan_types }"
                    >
                        <label class="mr-5">
                            <input class="form-check-input" type="checkbox"
                                   :indeterminate="scan_types_indeterminate"
                                   @change="handle_select_all"
                                   :checked="scan_types.length === available_scan_types.length"
                            >
                            <h9>
                                all
                            </h9>
                        </label>
                        <label class="mr-5" v-for="st in available_scan_types" :key="st">
                            <input class="form-check-input" type="checkbox"
                                   @change="e => handleScanTypeCheck(st, e.target.checked)"
                                   :checked="scan_types.includes(st)"
                            >
                            <h9>
                                [[ st ]]
                            </h9>
                        </label>
                    </div>
                    <div class="invalid-feedback">[[ error.scan_types ]]</div>
                </div>
        
                <div class="form-group form-row">
                    <div class="col-6">
                        <h9>Login</h9>
                        <p>
                            <h13>Optional</h13>
                        </p>
                        <input type="text" class="form-control form-control-alternative"
                               placeholder="User"
                               v-model="auth_login"
                               :class="{ 'is-invalid': error.auth_login }">
                        <div class="invalid-feedback">[[ error.auth_login ]]</div>
                    </div>
                    <div class="col-6">
        
                        <h9>Password</h9>
                        <p>
                            <h13>Optional</h13>
                        </p>
                        <input type="password" class="form-control form-control-alternative"
                               placeholder="Password"
                               v-model="auth_password"
                               :class="{ 'is-invalid': error.password }">
                        <div class="invalid-feedback">[[ error.password ]]</div>
                    </div>
                    <div class="col-12">
                        <h9>Auth script</h9>
                        <p>
                            <h13>Optional</h13>
                        </p>
                        <textarea class="form-control"
                                  rows="7"
                                  placeholder="Auth script"
                                  v-model="auth_script"
                                  :class="{ 'is-invalid': error.auth_script }"
                        >
                        </textarea>
                        <div class="invalid-feedback">[[ error.auth_script ]]</div>
                    </div>
                </div>
                
                
<!--                 <div class="form-check">-->
<!--                    <label>-->
<!--                        <input class="form-check-input" type="checkbox"-->
<!--                               v-model="bind_all_interfaces">-->
<!--                        <h9>-->
<!--                            Bind all interfaces-->
<!--                        </h9>-->
<!--                    </label>-->
<!--                </div>-->
<!--                <div class="form-check">-->
<!--                    <label>-->
<!--                        <input class="form-check-input" type="checkbox"-->
<!--                               v-model="daemon_debug">-->
<!--                        <h9>-->
<!--                            Daemon debug-->
<!--                        </h9>-->
<!--                    </label>-->
<!--                </div>-->
<h9>Java options</h9>
        <p>
            <h13>Optional</h13>
        </p>
        <input type="text" class="form-control form-control-alternative"
               placeholder="Java options"
               v-model="java_options"
               :class="{ 'is-invalid': error.java_options }">
        <div class="invalid-feedback">[[ error.java_options ]]</div>
        
<!--                <div class="form-check">-->
<!--                    <label>-->
<!--                        <input class="form-check-input" type="checkbox"-->
<!--                               v-model="split_by_endpoint">-->
<!--                        <h9>-->
<!--                            Split by endpoint-->
<!--                        </h9>-->
<!--                    </label>-->
<!--                </div>-->
<div class="form-group form-row">
            <div class="col-6">


                <h9>Passive scan wait threshold</h9>
                <p>
                    <h13>Optional</h13>
                </p>
                <input type="number" class="form-control form-control-alternative"
                       placeholder=""
                       v-model="passive_scan_wait_threshold"
                       :class="{ 'is-invalid': error.passive_scan_wait_threshold }"
                >
                <div class="invalid-feedback">[[ error.passive_scan_wait_threshold ]]</div>
            </div>
            <div class="col-6">
                <h9>Passive scan wait limit</h9>
                <p>
                    <h13>Optional</h13>
                </p>
                <input type="number" class="form-control form-control-alternative"
                       placeholder=""
                       v-model="passive_scan_wait_limit"
                       :class="{ 'is-invalid': error.passive_scan_wait_limit }"
                >
                <div class="invalid-feedback">[[ error.passive_scan_wait_limit ]]</div>
            </div>
        </div>
              <h9>External zap daemon</h9>
                <p>
                    <h13>Optional</h13>
                </p>
                <input type="text" class="form-control form-control-alternative"
                       placeholder="Url"
                       v-model="external_zap_daemon"
                       :class="{ 'is-invalid': error.external_zap_daemon }">
                <div class="invalid-feedback">[[ error.external_zap_daemon ]]</div>

                <h9>External zap api key</h9>
                <p>
                    <h13>Optional</h13>
                </p>
                <input type="text" class="form-control form-control-alternative"
                       placeholder=""
                       v-model="external_zap_api_key"
                       :class="{ 'is-invalid': error.external_zap_api_key }">
                <div class="invalid-feedback">[[ error.external_zap_api_key ]]</div>

                <h9>Save intermediates to</h9>
                <p>
                    <h13>Optional</h13>
                </p>
                <input type="text" class="form-control form-control-alternative"
                       placeholder=""
                       v-model="save_intermediates_to"
                       :class="{ 'is-invalid': error.save_intermediates_to }">
                <div class="invalid-feedback">[[ error.save_intermediates_to ]]</div>
</div>

        </template>
        <template #footer>
            <test-connection-button
                    :apiPath="api_base + 'check_settings'"
                    :error="error.check_connection"
                    :body_data="body_data"
                    v-model:is_fetching="is_fetching"
                    @handleError="handleError"
            >
            </test-connection-button>
        </template>

    </ModalDialog>
</div>
    `,
    data() {
        return this.initialState()
    },
    mounted() {
        this.modal.on('hidden.bs.modal', e => {
            this.clear()
        })
    },
    computed: {
        apiPath() {
            return this.api_base + 'integration/'
        },
        project_id() {
            return getSelectedProjectId()
        },
        body_data() {
            const {
                description,
                is_default,
                project_id,

                scan_types,
                auth_login,
                auth_password,
                auth_script,
                bind_all_interfaces,
                daemon_debug,
                java_options,
                split_by_endpoint,
                passive_scan_wait_threshold,
                passive_scan_wait_limit,
                external_zap_daemon,
                external_zap_api_key,
                save_intermediates_to,
                status
            } = this
            return {
                description,
                is_default,
                project_id,

                scan_types,
                auth_login,
                auth_password,
                auth_script,
                bind_all_interfaces,
                daemon_debug,
                java_options,
                split_by_endpoint,
                passive_scan_wait_threshold,
                passive_scan_wait_limit,
                external_zap_daemon,
                external_zap_api_key,
                save_intermediates_to,
                status
            }
        },
        // test_connection_class() {
        //     if (200 <= this.test_connection_status && this.test_connection_status < 300) {
        //         return 'btn-success'
        //     } else if (this.test_connection_status > 0) {
        //         return 'btn-warning'
        //     } else {
        //         return 'btn-secondary'
        //     }
        // },
        scan_types_indeterminate() {
            return !(this.scan_types.length === 0 || this.scan_types.length === this.available_scan_types.length)
        },
        modal() {
            return $(this.$el)
        },
        modal_id() {
            return `${this.instance_name}_integration`
        }
    },
    // watch: {
    //     is_fetching(newState, oldState) {
    //         if (newState) {
    //             this.test_connection_status = 0
    //         }
    //     },
    // },
    methods: {
        handle_select_all(e) {
            if (this.scan_types_indeterminate || !e.target.checked) {
                this.scan_types = []
                e.target.checked = false
            } else {
                this.scan_types = [...this.available_scan_types]
            }
        },
        // test_connection() {
        //     this.is_fetching = true
        //     fetch(this.apiPath + 'check_settings', {
        //         method: 'POST',
        //         headers: {'Content-Type': 'application/json'},
        //         body: JSON.stringify(this.body_data)
        //     }).then(response => {
        //         console.log(response)
        //         this.is_fetching = false
        //         this.test_connection_status = response.status
        //         if (!response.ok) {
        //             this.handleError(response)
        //         }
        //     })
        // },
        clear() {
            Object.assign(this.$data, {
                ...this.$data,
                ...this.initialState(),
            })
        },
        load(stateData) {
            Object.assign(this.$data, {
                ...this.$data,
                ...stateData
            })
        },
        handleEdit(data) {
            console.debug('ZAP editIntegration', data)
            const {description, is_default, id, settings} = data
            this.load({...settings, description, is_default, id})
            this.modal.modal('show')
        },
        handleDelete(id) {
            this.load({id})
            this.delete()
        },
        create() {
            this.is_fetching = true
            fetch(this.apiPath + this.pluginName, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.body_data)
            }).then(response => {
                this.is_fetching = false
                if (response.ok) {
                    this.modal.modal('hide')
                     this.$emit('update', {...this.$data, section_name: this.section_name})
                } else {
                    this.handleError(response)
                }
            })
        },
        handleError(response) {
            try {
                response.json().then(
                    errorData => {
                        errorData.forEach(item => {
                            console.debug('ZAP item error', item)
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
                     this.$emit('update', {...this.$data, section_name: this.section_name})
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
                     this.$emit('update', {...this.$data, section_name: this.section_name})
                } else {
                    this.handleError(response)
                    alertMain.add(`Deletion error. <button class="btn btn-primary" @click="modal.modal('show')">Open modal<button>`)
                }
            })
        },
        handleScanTypeCheck(value, checked) {
            if (checked) {
                this.scan_types.push(value)
            } else {
                const i = this.scan_types.indexOf(value)
                this.scan_types.splice(i, 1)
            }
        },
        initialState: () => ({
            description: '',
            is_default: false,
            is_fetching: false,
            error: {},
            test_connection_status: 0,
            id: null,

            available_scan_types: ['xss', 'sqli'],
            scan_types: ['xss', 'sqli'],

            auth_login: 'user',
            auth_password: 'P@ssw0rd',
            auth_script: "- {command: open, target: '%Target%/login', value: ''}\n" +
                "- {command: waitForElementPresent, target: id=login_login, value: ''}\n" +
                "- {command: waitForElementPresent, target: id=login_password, value: ''}\n" +
                "- {command: waitForElementPresent, target: id=login_0, value: ''}\n" +
                "- {command: type, target: id=login_login, value: '%Username%'}\n" +
                "- {command: type, target: id=login_password, value: '%Password%'}\n" +
                "- {command: clickAndWait, target: id=login_0, value: ''}",
            bind_all_interfaces: true,
            daemon_debug: false,
            java_options: '-Xmx1g',
            split_by_endpoint: false,
            passive_scan_wait_threshold: 0,
            passive_scan_wait_limit: 600,

            external_zap_daemon: 'http://192.168.0.2:8091',
            external_zap_api_key: 'dusty',
            save_intermediates_to: '/data/intermediates/dast',

            pluginName: 'security_scanner_zap',
            api_base: '/api/v1/integrations/',

            status: integration_status.success,
        }),
    }
}

// const zapVm = zapApp.mount(`#${Zap.pluginName}_integration`)

// vueApp.component('ZapIntegration', ZapIntegration)
register_component('ZapIntegration', ZapIntegration)
