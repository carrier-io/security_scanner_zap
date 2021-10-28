from flask import render_template


def render_qualys_reporter_toggle(context, slot, payload):
    return render_template(
        "zap_reporter_toggle.html",
        config=payload
    )
