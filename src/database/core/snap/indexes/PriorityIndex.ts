/**
* Copyright 2017 Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { Index } from './Index';
import { nameCompare, MAX_NAME } from "../../util/util";
import { NamedNode } from "../Node";
import { LeafNode } from "../LeafNode";

let nodeFromJSON;
let MAX_NODE;

export function setNodeFromJSON(val) {
  nodeFromJSON = val;
}

export function setMaxNode(val) {
  MAX_NODE = val;
}


/**
 * @constructor
 * @extends {Index}
 * @private
 */
export class PriorityIndex extends Index {

  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  compare(a, b) {
    var aPriority = a.node.getPriority();
    var bPriority = b.node.getPriority();
    var indexCmp = aPriority.compareTo(bPriority);
    if (indexCmp === 0) {
      return nameCompare(a.name, b.name);
    } else {
      return indexCmp;
    }
  };


  /**
   * @inheritDoc
   */
  isDefinedOn(node) {
    return !node.getPriority().isEmpty();
  };


  /**
   * @inheritDoc
   */
  indexedValueChanged(oldNode, newNode) {
    return !oldNode.getPriority().equals(newNode.getPriority());
  };


  /**
   * @inheritDoc
   */
  minPost() {
    return (NamedNode as any).MIN;
  };


  /**
   * @inheritDoc
   */
  maxPost() {
    return new NamedNode(MAX_NAME, new LeafNode('[PRIORITY-POST]', MAX_NODE));
  };


  /**
   * @param {*} indexValue
   * @param {string} name
   * @return {!NamedNode}
   */
  makePost(indexValue, name) {
    var priorityNode = nodeFromJSON(indexValue);
    return new NamedNode(name, new LeafNode('[PRIORITY-POST]', priorityNode));
  };


  /**
   * @return {!string} String representation for inclusion in a query spec
   */
  toString() {
    return '.priority';
  };
};

export const PRIORITY_INDEX = new PriorityIndex();