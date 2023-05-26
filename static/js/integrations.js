const ZapIntegration = {
    delimiters: ['[[', ']]'],
    components: {
        SecretFieldInput: SecretFieldInput
    },
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
            <div>
                <div>
                    <p class="font-h5 font-semibold mb-2">Scan Types</p>
                    <div class="d-flex"
                         :class="{ 'is-invalid': error.scan_types }"
                    >
                        <label class="custom-checkbox d-flex align-items-center mr-3">
                            <input class="mr-2.5" type="checkbox"
                                   :indeterminate="scan_types_indeterminate"
                                   @change="handle_select_all"
                                   :checked="scan_types.length === available_scan_types.length"
                            >
                            <p class="font-h5">all</p>
                        </label>
                        <label class="custom-checkbox d-flex align-items-center mr-3" 
                            v-for="st in available_scan_types" :key="st">
                            <input type="checkbox" class="mr-2.5"
                                   @change="e => handleScanTypeCheck(st, e.target.checked)"
                                   :checked="scan_types.includes(st)"
                            >
                            <p class="font-h5">[[ st ]]</p>
                        </label>
                    </div>
                    <div class="invalid-feedback">[[ error.scan_types ]]</div>
                </div>
                <div class="mt-3">
                    <p class="font-h5 font-semibold mb-1">Login<span class="text-gray-600 font-h6 font-weight-400 ml-1">(optional)</span></p>
                    <input type="text" class="form-control form-control-alternative"
                           placeholder="User"
                           v-model="auth_login"
                           :class="{ 'is-invalid': error.auth_login }">
                    <div class="invalid-feedback">[[ error.auth_login ]]</div>
                </div>
                <div class="mt-3">
                    <p class="font-h5 font-semibold mb-1">Password<span class="text-gray-600 font-h6 font-weight-400 ml-1">(optional)</span></p>
                    <SecretFieldInput v-model="auth_password" placeholder="Password"/>
                    <div v-show="error.password" class="invalid-feedback" style="display: block">[[ error.password ]]</div>
                </div>
                <div class="mt-3">
                    <p class="font-h5 font-semibold mb-1">Auth script<span class="text-gray-600 font-h6 font-weight-400 ml-1">(optional)</span></p>
                    <textarea class="form-control"
                              rows="7"
                              placeholder="Auth script"
                              v-model="auth_script"
                              :class="{ 'is-invalid': error.auth_script }"
                    >
                    </textarea>
                    <div class="invalid-feedback">[[ error.auth_script ]]</div>
                </div>
                
                <div class="mt-3">
                    <p class="font-h5 font-semibold mb-1">Java options<span class="text-gray-600 font-h6 font-weight-400 ml-1">(optional)</span></p>
                    <input type="text" class="form-control form-control-alternative"
                           placeholder="Java options"
                           v-model="java_options"
                           :class="{ 'is-invalid': error.java_options }">
                    <div class="invalid-feedback">[[ error.java_options ]]</div>
                </div>
        
                <div class="mt-3 d-flex gap-4">
                    <div class="w-50">
                        <p class="font-h5 font-semibold mb-1">Passive scan wait threshold<span class="text-gray-600 font-h6 font-weight-400 ml-1">(optional)</span></p>
                        <input type="number" class="form-control form-control-alternative"
                               placeholder=""
                               v-model="passive_scan_wait_threshold"
                               :class="{ 'is-invalid': error.passive_scan_wait_threshold }"
                        >
                        <div class="invalid-feedback">[[ error.passive_scan_wait_threshold ]]</div>
                    </div>
                    <div class="w-50 d-flex flex-column justify-content-end">
                        <p class="font-h5 font-semibold mb-1">Passive scan wait limit<span class="text-gray-600 font-h6 font-weight-400 ml-1">(optional)</span></p>
                        <input type="number" class="form-control form-control-alternative"
                               placeholder=""
                               v-model="passive_scan_wait_limit"
                               :class="{ 'is-invalid': error.passive_scan_wait_limit }"
                        >
                        <div class="invalid-feedback">[[ error.passive_scan_wait_limit ]]</div>
                    </div>
                </div>
                <div class="mt-3">
                    <p class="font-h5 font-semibold mb-1">External zap daemon<span class="text-gray-600 font-h6 font-weight-400 ml-1">(optional)</span></p>
                    <input type="text" class="form-control form-control-alternative"
                           placeholder="Url"
                           v-model="external_zap_daemon"
                           :class="{ 'is-invalid': error.external_zap_daemon }">
                    <div class="invalid-feedback">[[ error.external_zap_daemon ]]</div>
                </div>
                <div class="mt-3">
                    <p class="font-h5 font-semibold mb-1">External zap api key<span class="text-gray-600 font-h6 font-weight-400 ml-1">(optional)</span></p>
                    <input type="text" class="form-control form-control-alternative"
                           placeholder=""
                           v-model="external_zap_api_key"
                           :class="{ 'is-invalid': error.external_zap_api_key }">
                    <div class="invalid-feedback">[[ error.external_zap_api_key ]]</div>
                </div>
                
                <div class="my-3">
                    <p class="font-h5 font-semibold mb-1">Save intermediates to<span class="text-gray-600 font-h6 font-weight-400 ml-1">(optional)</span></p>
                    <input type="text" class="form-control form-control-alternative"
                           placeholder=""
                           v-model="save_intermediates_to"
                           :class="{ 'is-invalid': error.save_intermediates_to }">
                    <div class="invalid-feedback">[[ error.save_intermediates_to ]]</div>
                </div>
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
            auth_password: {
                value: '',
                from_secrets: false
            },
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

register_component('ZapIntegration', ZapIntegration)
