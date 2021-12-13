window['scanners_zap'] = {
    get_data: () => {
        if ($('#integration_checkbox_zap').prop('checked')) {
            console.log('Getting data for zap')
            return {}
        }
    },
    set_data: data => {
        console.log('Setting data for zap', data)
        $('#integration_checkbox_zap').prop('checked', true)
    },
    clear_data: () => {
        console.log('Clearing data for zap')
        $('#integration_checkbox_zap').prop('checked', false)
    }
}
