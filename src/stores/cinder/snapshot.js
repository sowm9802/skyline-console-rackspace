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

import { action } from 'mobx';
import client from 'client';
import Base from '../base';

export class SnapshotStore extends Base {
  get client() {
    return client.cinder.snapshots;
  }

  get listResponseKey() {
    return 'volume_snapshots';
  }

  listFetchByClient(params) {
    return this.skylineClient.extension.volumeSnapshots(params);
  }

  get paramsFunc() {
    return (params) => {
      const { id, withPrice, ...rest } = params;
      return rest;
    };
  }

  async listDidFetch(items, allProjects, filters) {
    if (items.length === 0) {
      return items;
    }
    const { id } = filters;
    const datas = id ? items.filter((it) => it.volume_id === id) : items;
    return datas;
  }

  async detailDidFetch(item) {
    const { volume_id } = item;
    const { volume } = await client.cinder.volumes.show(volume_id);
    item.volume = volume;
    return item;
  }

  updateParamsSortPage = (params, sortKey, sortOrder) => {
    if (sortKey && sortOrder) {
      params.sort_keys = sortKey;
      params.sort_dirs = sortOrder === 'descend' ? 'desc' : 'asc';
    }
  };

  @action
  update(id, data) {
    const body = { [this.responseKey]: data };
    return this.submitting(this.client.update(id, body));
  }
}
const globalSnapshotStore = new SnapshotStore();
export default globalSnapshotStore;
