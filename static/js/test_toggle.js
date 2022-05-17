const ZapIntegration = {
    delimiters: ['[[', ']]'],
    props: ['instance_name', 'project_integrations', 'integration_name'],
    data() {
        return {
            pluginName: 'security_scanner_zap',
            ...zapInitialState()
        }
    },
    mounted() {
        window[`scanners_${this.pluginName}`] = {
            get_data: () => this.toggle && this.body_data,
            // set_data: this.loadSettings,
            clear_data: this.clear,
        }
        this.handleIntegrationSelect({target: this.zap_selectpicker})
    },
    computed: {
        zap_selectpicker() {
            return $(`#selector_${this.pluginName} .selectpicker`)
        },
        body_data() {
            const {
                description,
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
            } = this
            return {
                description,
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
        toggle(newState, oldState) {
            $(`#selector_${this.pluginName}`).collapse(~~newState ? 'show' : 'hide')
        },
    },
    methods: {
        handle_select_all(e) {
            if (this.scan_types_indeterminate || !e.target.checked) {
                this.scan_types = []
                e.target.checked = false
            } else {
                this.scan_types = [...this.available_scan_types]
            }
        },
        clear() {
            this.zap_selectpicker[0]?.options.forEach(item =>
                item.dataset.is_default && this.zap_selectpicker.val(item.value).selectpicker('refresh')
            )
            this.handleIntegrationSelect({target: this.zap_selectpicker})
            this.toggle = false
            $(`#settings_${this.pluginName}`).collapse('hide')

        },
        loadIntegration(stateData) {
            Object.assign(this.$data, {
                ...this.$data,
                ...stateData,
            })
        },
        set_data(stateData) {
            Object.assign(this.$data, {
                ...this.$data,
                ...stateData,
                toggle: true
            })
            this.zap_selectpicker.val(stateData.id)
            this.zap_selectpicker.selectpicker && this.zap_selectpicker.selectpicker('refresh')
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
                alertCreateTest.add(e, 'danger-overlay')
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
        handleIntegrationSelect(e, doToggle = true) {
            const target = $(e.target)
            const {id, description, settings} = JSON.parse(
                target.find(`option[value=${target.val()}]`)[0].dataset.data
            )
            this.loadIntegration({id, description, ...settings})
        },
        initialState: () => ({
            toggle: false,

            id: null,
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
<div>
    <div class="row">
            <div class="collapse col-12 mb-3 pl-0" id="selector_{{ integration_name }}">
                <select class="selectpicker" data-style="btn-secondary"
                        @change="handleIntegrationSelect"
                >
                    {% for i in config['project_integrations'] %}
                        <option
                                value="{{ i.id }}"
                                {% if i.is_default %} selected data-is_default="true"{% endif %}
                                title="{{ i.description }} {% if i.is_default %} - default {% endif %}"
                                data-data="{{ i.json() }}"
                        >
                            {{ i.description }} {% if i.is_default %} - default {% endif %}
                        </option>
                    {% endfor %}
                </select>
            </div>
        </div>

        <div class="row">
            <div class="collapse col-12 mb-3 p-0" id="settings_{{ integration_name }}">
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

                </div>
            </div>
        </div>
    </div>
    `
}

// zapApp.config.compilerOptions.isCustomElement = tag => ['h9', 'h13', 'h7'].includes(tag)
// const zapVm = zapApp.mount('#security_scanner_zap')

register_component('scanner-zap', ZapIntegration)