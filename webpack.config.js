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

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

module.exports = fs
  .readdirSync("src")
  .filter(filename => filename.endsWith(".js"))
  .map(filename => ({
    context: path.resolve("src"),
    entry: `./${filename}`,
    output: {
      filename,
      path: path.resolve("dist")
    },
    optimization: {
      minimize: false
    },
    plugins: [
      new webpack.BannerPlugin({
        banner:
          "// Required for JavaScript engine shells.\n" +
          "if (typeof console === 'undefined') {\n" +
          "  console = {log: print};\n" +
          "}",
        raw: true
      })
    ]
  }));
