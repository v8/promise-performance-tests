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

const fakes = require("../lib/fakes-async.js");

module.exports = async function doxbee(stream, idOrPath) {
  const blob = fakes.blobManager.create(fakes.account);
  const tx = fakes.db.begin();

  try {
    const blobId = await blob.put(stream);
    const file = await fakes.self.byUuidOrPath(idOrPath).get();
    const previousId = file ? file.version : null;
    const version = {
      userAccountId: fakes.userAccount.id,
      date: new Date(),
      blobId: blobId,
      creatorId: fakes.userAccount.id,
      previousId: previousId
    };
    version.id = fakes.Version.createHash(version);
    await fakes.Version.insert(version).execWithin(tx);

    let fileId;
    if (!file) {
      const splitPath = idOrPath.split("/");
      const fileName = splitPath[splitPath.length - 1];
      fileId = fakes.uuid.v1();
      const q = await fakes.self.createQuery(idOrPath, {
        id: fileId,
        userAccountId: fakes.userAccount.id,
        name: fileName,
        version: version.id
      });
      await q.execWithin(tx);
    } else {
      fileId = file.id;
    }
    await fakes.FileVersion.insert({
      fileId: fileId,
      versionId: version.id
    }).execWithin(tx);

    await fakes.File.whereUpdate(
      { id: fileId },
      { version: version.id }
    ).execWithin(tx);
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }
};
