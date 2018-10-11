// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     <https://www.apache.org/licenses/LICENSE-2.0>
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

const config = require("../lib/config.js");
const fakes = require("../lib/fakes-promises.js");

module.exports = function parallel(stream, idOrPath) {
  const queries = new Array(config.parallelQueries);
  const tx = fakes.db.begin();

  for (let index = 0; index < queries.length; ++index) {
    queries[index] = fakes.FileVersion.insert({ index }).execWithin(tx);
  }

  Promise.all(queries)
    .then(_ => {
      return tx.commit();
    })
    .catch(err => {
      return tx.rollback().then(_ => Promise.reject(err));
    });
};
