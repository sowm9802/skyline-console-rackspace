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
import { ShareTypeStore } from 'stores/manila/share-type';
import Base from 'containers/TabDetail';
import Share from 'pages/share/containers/Share';
import ExtraSpec from './ExtraSpec';
import actionConfigs from '../actions';

export class Detail extends Base {
  get name() {
    return t('share type');
  }

  get policy() {
    return 'manila:share_type:show';
  }

  get listUrl() {
    return this.getRoutePath('shareType');
  }

  get actionConfigs() {
    return actionConfigs;
  }

  get detailInfos() {
    return [
      {
        title: t('Name'),
        dataIndex: 'name',
      },
      {
        title: t('Description'),
        dataIndex: 'description',
      },
      {
        title: t('Public'),
        dataIndex: 'is_public',
        isHideable: true,
        valueRender: 'yesNo',
      },
    ];
  }

  get tabs() {
    return [
      {
        title: t('Extra Spec'),
        key: 'ExtraSpec',
        component: ExtraSpec,
      },
      {
        title: t('Share'),
        key: 'share',
        component: Share,
      },
    ];
  }

  init() {
    this.store = new ShareTypeStore();
  }
}

export default inject('rootStore')(observer(Detail));
