// Copyright 2021 99cloud
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import { inject, observer } from 'mobx-react';
import Base from 'components/Form';
import FlavorSelectTable from 'src/pages/compute/containers/Instance/components/FlavorSelectTable';
import { defaultTip } from 'resources/magnum/cluster';

export class StepNodeSpec extends Base {
  get title() {
    return t('Node Spec');
  }

  get name() {
    return t('Node Spec');
  }

  allowed = () => Promise.resolve();

  getFlavorComponent() {
    return <FlavorSelectTable onChange={this.onFlavorChange} />;
  }

  onFlavorChange = (value) => {
    this.updateContext({
      flavor: value,
    });
  };

  get defaultValue() {
    return {
      master_count: 1,
      node_count: 1,
    };
  }

  get formItems() {
    const { context: { clusterTemplate = {} } = {} } = this.props;
    const { selectedRows = [] } = clusterTemplate;
    const { master_flavor_id, flavor_id } = selectedRows[0] || {};

    return [
      {
        name: 'master_count',
        label: t('Number of Master Nodes'),
        type: 'input-int',
        min: 1,
        required: true,
      },
      {
        name: 'masterFlavor',
        label: t('Flavor of Master Nodes'),
        type: 'select-table',
        component: this.getFlavorComponent(),
        required: !master_flavor_id,
        tip: defaultTip,
      },
      {
        type: 'divider',
      },
      {
        name: 'node_count',
        label: t('Number of Nodes'),
        type: 'input-int',
        min: 1,
        required: true,
      },
      {
        name: 'flavor',
        label: t('Flavor of Nodes'),
        type: 'select-table',
        component: this.getFlavorComponent(),
        required: !flavor_id,
        tip: defaultTip,
      },
    ];
  }
}

export default inject('rootStore')(observer(StepNodeSpec));
