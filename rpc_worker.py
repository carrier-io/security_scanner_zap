from pylon.core.tools import log  # pylint: disable=E0611,E0401


def make_dusty_config(context, test_params, scanner_params):
    """ Prepare dusty config for this scanner """
    #
    log.info("Test params: %s", test_params)
    log.info("Scanner params: %s", scanner_params)
    #
    result = {
        "target": test_params["urls_to_scan"][0],
    }
    #
    log.info("Result: %s", result)
    #
    return result
