from pylon.core.tools import log  # pylint: disable=E0611,E0401
from pylon.core.tools import web

from tools import rpc_tools, VaultClient


class RPC:
    integration_name = 'security_scanner_zap'

    @web.rpc(f'dusty_config_{integration_name}')
    @rpc_tools.wrap_exceptions(RuntimeError)
    def make_dusty_config(self, context, test_params, scanner_params):
        """ Prepare dusty config for this scanner """
        # log.info("Test params: %s", test_params)
        # log.info("Scanner params: %s", scanner_params)
        #
        vault_client = VaultClient.from_project(test_params["project_id"])
        scanner_params = scanner_params.copy()
        #
        if "xss" in scanner_params["scan_types"] and "sqli" in scanner_params["scan_types"]:
            scanner_params["scan_types"] = "all"
        else:
            scanner_params["scan_types"] = ",".join(list(scanner_params["scan_types"]))
        #
        if not scanner_params["auth_password"]["from_secrets"]:
            scanner_params["auth_password"] = scanner_params["auth_password"]["value"]
        else:
            scanner_params["auth_password"] = vault_client.unsecret(
                scanner_params["auth_password"]["value"]
            )
        #
        drop_keys = ["config", "id", "use_auth", "use_external_zap"]
        #
        if not scanner_params["use_auth"]:
            drop_keys.append("auth_login")
            drop_keys.append("auth_password")
            drop_keys.append("auth_script")
        #
        if not scanner_params["use_external_zap"]:
            drop_keys.append("external_zap_daemon")
            drop_keys.append("external_zap_api_key")
        #
        for key in drop_keys:
            scanner_params.pop(key)
        #
        result = {
            "target": test_params["urls_to_scan"][0],
            **scanner_params,
        }
        log.info("Result: %s", result)
        return "zap", result
