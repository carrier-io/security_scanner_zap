window['scanners_security_scanner_zap'] = {
    get_data: () => {
        if ($('#integration_checkbox_zap').prop('checked')) {
            console.log('Getting data for zap')
            return {}
        }
    },
    set_data: data => {
        console.log('Setting data for zap', data)
        $('#integration_checkbox_zap').prop('checked', true)
        zapVm.set_data(data)

    },
    clear_data: () => {
        console.log('Clearing data for zap')
        $('#integration_checkbox_zap').prop('checked', false)
        zapVm.clear()
    }
}

const zapInitialState = () => ({
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

const zapApp = Vue.createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            pluginName: 'security_scanner_zap',
            ...zapInitialState()
        }
    },
    mounted() {

    },
    computed: {
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
            }
        },
        scan_types_indeterminate() {
            return !(this.scan_types.length === 0 || this.scan_types.length === this.available_scan_types.length)
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
                ...zapInitialState(),
            })
        },
        load(stateData) {
            Object.assign(this.$data, {
                ...this.$data,
                ...stateData
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
        handleIntegrationSelect(e) {
            console.log('selected', e.target)
            console.log('selected', e.target.value)
            console.log('selected', $(e.target).prop('data-data'))
            console.log('selected', $(e.target).attr('data-data'))
        }
    }
})

zapApp.config.compilerOptions.isCustomElement = tag => ['h9', 'h13', 'h7'].includes(tag)
const zapVm = zapApp.mount('#security_scanner_zap')

$(document).ready(() => {

})