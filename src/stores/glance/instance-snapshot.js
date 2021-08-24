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

import client from 'client';
import Base from '../base';

export class InstanceSnapshotStore extends Base {
  get client() {
    return client.glance.images;
  }

  get listFilterByProject() {
    return true;
  }

  get fetchListByLimit() {
    return false;
  }

  updateParamsSortPage = (params, sortKey, sortOrder) => {
    if (sortKey && sortOrder) {
      params.sort_key = sortKey;
      params.sort_dir = sortOrder === 'descend' ? 'desc' : 'asc';
    }
  };

  get paramsFunc() {
    return this.paramsFuncPage;
  }

  get paramsFuncPage() {
    return (params, all_projects) => {
      const { id, current, owner, ...rest } = params;
      const newParams = {
        ...rest,
        image_type: 'snapshot',
      };
      if (owner) {
        newParams.owner = owner;
      } else if (!all_projects) {
        newParams.owner = this.currentProjectId;
      }
      return newParams;
    };
  }

  async getCountForPage(params) {
    const { limit, marker, ...rest } = params;
    const result = await this.client.count(rest);
    return result;
  }

  get mapperBeforeFetchProject() {
    return (data) => ({
      ...data,
      project_name: data.owner_project_name || data.project_name,
    });
  }

  async listDidFetch(items, allProjects, filters) {
    if (items.length === 0) {
      return items;
    }
    const { id } = filters;
    if (!id) {
      return items;
    }
    const volumeParams = {};
    const snapshotParams = { all_tenants: allProjects };
    const results = await Promise.all([
      client.cinder.snapshots.list(snapshotParams),
      client.nova.servers.volumeAttachments.list(id, volumeParams),
    ]);
    const snapshotsAll = results[0].snapshots;
    const volumesAll = results[1].volumeAttachments;
    const datas = [];
    items.forEach((data) => {
      const { block_device_mapping: bdm = '[]' } = data;
      const snapshot = JSON.parse(bdm).find((it) => it.boot_index === 0);
      if (snapshot) {
        data.snapshotId = snapshot.snapshot_id;
        const snapshotDetail = snapshotsAll.find(
          (it) => it.id === snapshot.snapshot_id
        );
        if (snapshotDetail) {
          const volumeId = snapshotDetail.volume_id;
          const volume = volumesAll.find((it) => it.volumeId === volumeId);
          if (volume) {
            datas.push(data);
          }
        }
      } else {
        const { instance_uuid: instanceId } = data;
        if (id === instanceId) {
          datas.push(data);
        }
      }
    });
    return datas;
  }

  async detailDidFetch(item) {
    item.originData = { ...item };
    const { block_device_mapping: bdm = '[]' } = item;
    const snapshot = JSON.parse(bdm).find((it) => it.boot_index === 0);
    let instanceId = null;
    let instanceName = '';
    if (snapshot) {
      const { snapshot_id: snapshotId } = snapshot;
      item.snapshotId = snapshotId;
      const snapshotResult = await client.cinder.snapshots.show(snapshotId);
      const snapshotDetail = snapshotResult.snapshot;
      item.snapshotDetail = snapshotDetail;
      const { volume_id: volumeId } = snapshotDetail;
      const volumeResult = await client.cinder.volumes.show(volumeId);
      const volumeDetail = volumeResult.volume;
      item.volumeDetail = volumeDetail;
      instanceId =
        volumeDetail.attachments.length > 0
          ? volumeDetail.attachments[0].server_id
          : '';
    } else {
      // fix for not bfv instance
      const { instance_uuid } = item;
      instanceId = instance_uuid;
    }
    let instanceResult = {};
    try {
      if (instanceId) {
        instanceResult = await client.nova.servers.show(instanceId);
        const { server: { name } = {} } = instanceResult;
        instanceName = name;
      }
    } catch (e) {}
    item.instance = {
      server_id: instanceId,
      server_name: instanceName,
    };
    item.instanceDetail = instanceResult.server || {};
    return item;
  }
}

const globalInstanceSnapshotStore = new InstanceSnapshotStore();
export default globalInstanceSnapshotStore;
