#!/usr/bin/python3
# coding=utf-8

#   Copyright 2021 getcarrier.io
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

""" Module """
import functools
from pathlib import Path

import flask  # pylint: disable=E0401
import jinja2  # pylint: disable=E0401
from flask import request, render_template, redirect, url_for
from pylon.core.tools import log  # pylint: disable=E0611,E0401
from pylon.core.tools import module  # pylint: disable=E0611,E0401

# from .components import render_toggle, render_integration_card, render_integration_create_modal
from .models.integration_pd import IntegrationModel


class Module(module.ModuleModel):
    """ Galloper module """

    def __init__(self, context, descriptor):
        self.context = context
        self.descriptor = descriptor

    def init(self):
        """ Init module """
        log.info("Initializing module")

        SECTION_NAME = 'scanners'

        self.descriptor.init_blueprint()
        # self.context.slot_manager.register_callback(f"integration_card_{self.descriptor.name}", render_integration_card)
        # self.context.slot_manager.register_callback(f"security_{SECTION_NAME}", render_toggle)

        self.context.rpc_manager.call.integrations_register_section(
            name=SECTION_NAME,
            integration_description='Manage integrations with scanners',
            test_planner_description='Specify scanners to use. You may also set scanners in <a '
                                     'href="{}">Integrations</a> '.format('/-/configuration/integrations/')
        )

        self.context.rpc_manager.call.integrations_register(
            name=self.descriptor.name,
            section=SECTION_NAME,
            settings_model=IntegrationModel,
            # integration_callback=render_integration_create_modal
        )

        self.descriptor.init_rpcs()
        # from .rpc_worker import make_dusty_config
        # self.context.rpc_manager.register_function(
        #     functools.partial(make_dusty_config, self.context),
        #     name=f'dusty_config_{self.descriptor.name}',
        # )

        self.descriptor.init_slots()

    def deinit(self):  # pylint: disable=R0201
        """ De-init module """
        log.info("De-initializing module")
