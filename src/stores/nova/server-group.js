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

export class ServerGroupStore extends Base {
  get client() {
    return client.nova.serverGroups;
  }

  get fetchListByLimit() {
    return true;
  }

  updateMarkerParams = (limit, marker) => ({
    limit,
    offset: marker,
  });

  parseMarker(datas, result, allDatas) {
    return allDatas.length;
  }
}

const globalServerGroupStore = new ServerGroupStore();
export default globalServerGroupStore;
