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
import {GenericNotificationConfig} from "../../../entities/genericNotificationConfig";
import PortalNotificationService from "../../../services/GenericNotification.service";
import NotificationService from "../../../services/notification.service";
import GenericNotificationService from "../../../services/genericNotification.service";
import {Notifier} from "../../../entities/notifier";
import {HookScope} from "../../../entities/hookScope";

const GenericNotificationSettingsComponent: ng.IComponentOptions = {
  bindings: {
    resolvedHooks: '<',
    resolvedNotifiers: '<',
    resolvedGenericNotification: '<'
  },
  template: require('./genericnotificationsettings.html'),
  controller: function(PortalNotificationService: PortalNotificationService,
                       GenericNotificationService: GenericNotificationService,
                       NotificationService: NotificationService,
                       $stateParams: ng.ui.IStateParamsService) {
    'ngInject';
    const vm = this;

    vm.$onInit = () => {
      vm.selectedNotifier = this.resolvedNotifiers[0];
      vm.selectGenericNotification(vm.resolvedGenericNotification);
    };

    vm.showConfig = () => {
      GenericNotificationService
        .getGenericNotifications(vm.selectedNotifier.id, HookScope.API, $stateParams.apiId)
        .then((response) => {
          vm.selectGenericNotification(response.data);
        });
    };

    vm.selectGenericNotification = (cfg: GenericNotificationConfig) => {
      vm.selectedGenericNotificationConfig = cfg;
      vm.hookStatus = {};
      _.forEach(vm.resolvedHooks,  (hook: Hook) => {
        vm.hookStatus[hook.id] = cfg.hooks.indexOf(hook.id) >= 0;
      });
    };

    vm.save = () => {
      let cfg = new GenericNotificationConfig();
      cfg.referenceType = vm.selectedGenericNotificationConfig.referenceType;
      cfg.referenceId = vm.selectedGenericNotificationConfig.referenceId;
      cfg.notifier = vm.selectedNotifier.id;
      cfg.config = vm.selectedGenericNotificationConfig.config;
      cfg.hooks = [];
      _.forEach(vm.hookStatus, (k,v)  => {
        if (k) {
          cfg.hooks.push(v);
        }
      });
      GenericNotificationService.saveConfig(cfg).then( (response) => {
        NotificationService.show('Saved!');
      });
    };

    vm.delete = () => {
      let cfg = new GenericNotificationConfig();
      cfg.referenceType = vm.selectedGenericNotificationConfig.referenceType;
      cfg.referenceId = vm.selectedGenericNotificationConfig.referenceId;
      cfg.notifier = vm.selectedNotifier;
      cfg.config = "";
      cfg.hooks = [];
      GenericNotificationService.saveConfig(cfg).then( (response) => {
        NotificationService.show('Saved!');
      });
    };
  }
};

export default GenericNotificationSettingsComponent;
