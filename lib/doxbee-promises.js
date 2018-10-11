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

const fakes = require("../lib/fakes-promises.js");

module.exports = function doxbee(stream, idOrPath) {
  const blob = fakes.blobManager.create(fakes.account);
  const tx = fakes.db.begin();
  let version, blobId, fileId, file;

  return blob
    .put(stream)
    .then(blobIdV => {
      blobId = blobIdV;
      return fakes.self.byUuidOrPath(idOrPath).get();
    })
    .then(fileV => {
      file = fileV;
      const previousId = file ? file.version : null;
      version = {
        userAccountId: fakes.userAccount.id,
        date: new Date(),
        blobId: blobId,
        creatorId: fakes.userAccount.id,
        previousId: previousId
      };
      version.id = fakes.Version.createHash(version);
      return fakes.Version.insert(version).execWithin(tx);
    })
    .then(_ => {
      if (!file) {
        const splitPath = idOrPath.split("/");
        const fileName = splitPath[splitPath.length - 1];
        const newId = fakes.uuid.v1();
        return fakes.self
          .createQuery(idOrPath, {
            id: newId,
            userAccountId: fakes.userAccount.id,
            name: fileName,
            version: version.id
          })
          .then(q => {
            return q.execWithin(tx);
          })
          .then(_ => {
            return newId;
          });
      } else {
        return file.id;
      }
    })
    .then(fileIdV => {
      fileId = fileIdV;
      return fakes.FileVersion.insert({
        fileId: fileId,
        versionId: version.id
      }).execWithin(tx);
    })
    .then(_ => {
      return fakes.File.whereUpdate(
        { id: fileId },
        { version: version.id }
      ).execWithin(tx);
    })
    .then(_ => {
      return tx.commit();
    })
    .catch(err => {
      return tx.rollback().then(_ => Promise.reject(err));
    });
};
