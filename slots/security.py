from pylon.core.tools import log, web
from flask import g


# self.context.slot_manager.register_callback(
#     f'integrations_{form_data.section}',
#     form_data.integration_callback
# )
class Slot:
    integration_name = 'security_scanner_zap'
    section_name = 'scanners'

    @web.slot(f'security_{section_name}_content')
    def toggle_content(self, context, slot, payload):
        project_id = self.context.rpc_manager.call.project_get_id()
        project_integrations = context.rpc_manager.call.integrations_get_all_integrations_by_name(
            project_id,
            Slot.integration_name
        )
        with context.app.app_context():
            return self.descriptor.render_template(
                'test_toggle/content.html',
                project_integrations=project_integrations
            )

    @web.slot(f'security_{section_name}_scripts')
    def toggle_scripts(self, context, slot, payload):
        with context.app.app_context():
            return self.descriptor.render_template(
                'test_toggle/scripts.html',
            )
