/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import _ = require('lodash');
import {Hook} from "../../../entities/hook";
import {PortalNotificationConfig} from "../../../entities/portalNotificationConfig";
import PortalNotificationService from "../../../services/PortalNotification.service";
import NotificationService from "../../../services/notification.service";

const PortalNotificationSettingsComponent: ng.IComponentOptions = {
  bindings: {
    resolvedHooks: '<',
    resolvedPortalNotifications: '<'
  },
  template: require('./portalnotificationsettings.html'),
  controller: function(PortalNotificationService: PortalNotificationService,
                       NotificationService: NotificationService) {
    'ngInject';
    const vm = this;

    vm.$onInit = () => {
      vm.hookStatus = {};
      _.forEach(vm.resolvedHooks,  (hook: Hook) => {
        vm.hookStatus[hook.id] = vm.resolvedPortalNotifications.hooks.indexOf(hook.id) >= 0;
      });
    };

    vm.saveHooks = () => {
      let cfg = new PortalNotificationConfig();
      cfg.referenceType = vm.resolvedPortalNotifications.referenceType;
      cfg.referenceId = vm.resolvedPortalNotifications.referenceId;
      cfg.user = vm.resolvedPortalNotifications.user;
      cfg.hooks = [];
      _.forEach(vm.hookStatus, (k,v)  => {
        if (k) {
          cfg.hooks.push(v);
        }
      });
      PortalNotificationService.saveConfig(cfg).then( (response) => {
        NotificationService.show('Saved!');
      });
    };
  }
};

export default PortalNotificationSettingsComponent;
