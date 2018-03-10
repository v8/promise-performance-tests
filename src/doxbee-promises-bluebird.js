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

Promise = require("bluebird");

const doxbee = require("../lib/doxbee-promises.js");
const measure = require("../lib/measure-promises.js");

measure(doxbee, "b", "c")
  .then(time => console.log(`Time(doxbee-promises-bluebird): ${time} ms.`))
  .catch(reason => console.error(reason));
