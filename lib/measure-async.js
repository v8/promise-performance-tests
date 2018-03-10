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

const driver = require("../lib/driver.js");
const config = require("../lib/config.js");

module.exports = async function measure(fn, ...args) {
  // Warmup pass.
  await driver(Math.min(350, config.iterations), fn, ...args);

  // Perform K runs with N promises.
  let time = 0;
  for (let k = 0; k < config.runs; ++k) {
    time += await driver(config.iterations, fn, ...args);
  }
  return time / config.runs;
};
