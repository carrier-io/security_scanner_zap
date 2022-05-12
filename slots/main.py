from pylon.core.tools import log, web
from flask import g


# self.context.slot_manager.register_callback(
#     f'integrations_{form_data.section}',
#     form_data.integration_callback
# )
class Slot:
    name = 'security_scanner_zap'
    section_name = 'scanners'

    @web.slot(f'security_{section_name}')
    def toggle(self, context, slot, payload):
        integrations = context.rpc_manager.call.integrations_get_project_integrations_by_name(
            g.project.id,
            'security_scanner_zap'
        )
        # payload['project_integrations'] = integrations
        with context.app.app_context():
            return self.descriptor.render_template(
                'zap_test_toggle.html',
                integrations=integrations
            )

    @web.slot(f'integrations_{section_name}')
    def integration_create_modal(self, context, slot, payload):
        with context.app.app_context():
            return self.descriptor.render_template(
                'zap_integration.html',
            )

    @web.slot(f'integration_card_{name}')
    def integration_card(self, context, slot, payload):
        with context.app.app_context():
            return self.descriptor.render_template(
                'zap_integration_card.html',
            )
