const ZapIntegration = {
    delimiters: ['[[', ']]'],
    props: ['instance_name', 'section', 'selected_integration', 'is_selected', 'integration_data'],
    emits: ['set_data', 'clear_data'],
    data() {
        return this.initialState()
    },
    components: {
        SecretFieldInput: SecretFieldInput
    },
    computed: {
        body_data() {
            const {
                config,
                is_default,
                selected_integration: id,

                scan_types,
                auth_login,
                auth_password,
                auth_script,
                bind_all_interfaces,
                daemon_debug,
                java_options,
                passive_scan_wait_threshold,
                passive_scan_wait_limit,
            } = this
            return {
                config,
                is_default,
                id,

                scan_types,
                auth_login,
                auth_password,
                auth_script,
                bind_all_interfaces,
                daemon_debug,
                java_options,
                passive_scan_wait_threshold,
                passive_scan_wait_limit,
            }
        },
        scan_types_indeterminate() {
            return !(this.scan_types.length === 0 || this.scan_types.length === this.available_scan_types.length)
        }
    },
    watch: {
        selected_integration(newState, oldState) {
            console.debug('watching selected_integration: ', oldState, '->', newState, this.integration_data)
            this.set_data(this.integration_data.settings, false)
        }
    },
    methods: {
        get_data() {
            if (this.is_selected) {
                return this.body_data
            }
        },
        set_data(data, emit = true) {
            Object.assign(this.$data, data)
            emit&& this.$emit('set_data', data)
        },
        clear_data() {
            Object.assign(this.$data, this.initialState())
            this.$emit('clear_data')
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
                alertCreateTest.add(e, 'danger-overlay')
            }
        },


        handle_select_all(e) {
            if (this.scan_types_indeterminate || !e.target.checked) {
                this.scan_types = []
                e.target.checked = false
            } else {
                this.scan_types = [...this.available_scan_types]
            }
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
            // toggle: false,
            config: {},
            error: {},

            available_scan_types: ['xss', 'sqli'],
            scan_types: [],

            auth_login: '',
            auth_password: '',
            auth_script: '',
            bind_all_interfaces: true,
            daemon_debug: false,
            java_options: '',
            passive_scan_wait_threshold: 0,
            passive_scan_wait_limit: 600,
        })
    },
    template: `
        <div class="mt-3">
            <div class="row">
                <div class="col">
                    <h7>Advanced Settings</h7>
                    <p>
                        <h13>Integration default settings can be overridden here</h13>
                    </p>
                </div>
            </div>

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

                <p>
                  <label class="custom-checkbox align-items-center mr-3">
                    <input type="checkbox" v-model="use_auth">
                    <h9 class="ml-1">
                        Use auth
                    </h9>
                  </label>
                </p>

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
                        <SecretFieldInput
                               placeholder="Password"
                               v-model="auth_password"
                        />
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
                                  v-model="auth_script">
            </textarea>
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-check">
                        <label>
                            <input class="form-check-input" type="checkbox"
                                   v-model="bind_all_interfaces">
                            <h9>
                                Bind all interfaces
                            </h9>
                        </label>
                    </div>
                    <div class="form-check">
                        <label>
                            <input class="form-check-input" type="checkbox"
                                   v-model="daemon_debug">
                            <h9>
                                Daemon debug
                            </h9>
                        </label>
                    </div>
                </div>

                <h9>Java options</h9>
                <p>
                    <h13>Optional</h13>
                </p>
                <input type="text" class="form-control form-control-alternative"
                       placeholder="Java options"
                       v-model="java_options"
                       :class="{ 'is-invalid': error.java_options }">
                <div class="invalid-feedback">[[ error.java_options ]]</div>

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

                <p>
                <label class="custom-checkbox align-items-center mr-3">
                  <input type="checkbox" v-model="use_external_zap">
                  <h9 class="ml-1">
                      Use external ZAP daemon
                  </h9>
                </label>
                </p>

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


            </div>
        </div>
    `
}


register_component('scanner-zap', ZapIntegration)
