from flask import render_template


def render_toggle(context, slot, payload):
    return render_template(
        "security_scanner_zap:zap_reporter_toggle.html",
        config=payload
    )
