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

import { inject, observer } from 'mobx-react';
import { adminState } from 'resources/neutron/firewall';
import Base from 'containers/BaseDetail';

export class BaseDetail extends Base {
  get leftCards() {
    const cards = [this.baseInfoCard];
    return cards;
  }

  get baseInfoCard() {
    const options = [
      {
        label: t('Ingress Policy ID'),
        dataIndex: 'ingress_firewall_policy_id',
      },
      {
        label: t('Ingress Policy Name'),
        dataIndex: 'ingress',
        render: (value) => (value ? value.name : '-'),
      },
      {
        label: t('Egress Policy ID'),
        dataIndex: 'egress_firewall_policy_id',
      },
      {
        label: t('Egress Policy Name'),
        dataIndex: 'egress',
        render: (value) => (value ? value.name : '-'),
      },
      {
        label: t('Admin State'),
        dataIndex: 'admin_state_up',
        valueMap: adminState,
      },
    ];
    return {
      title: t('Base Info'),
      options,
    };
  }
}

export default inject('rootStore')(observer(BaseDetail));
