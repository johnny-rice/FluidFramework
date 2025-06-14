/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { assert } from "@fluidframework/core-utils/internal";

import type { MinimalMapTreeNodeView } from "../../feature-libraries/index.js";
import type { FieldKey } from "../schema-stored/index.js";

import type { NodeData } from "./types.js";

/**
 * This module provides a simple in-memory tree format.
 */

/**
 * Simple in-memory tree representation based on Maps.
 * @remarks MapTrees should not store empty fields.
 */
export interface MapTree extends NodeData {
	readonly fields: ReadonlyMap<FieldKey, readonly MapTree[]>;
}

/**
 * A {@link MapTree} which is owned by a single reference, and therefore allowed to be mutated.
 *
 * @remarks
 * To ensure unexpected mutations, this object should have a single owner/context.
 * Though this type does implement MapTree, it should not be used as a MapTree while it can possibly be mutated.
 * If it is shared to other contexts, it should first be upcast to a {@link MapTree} and further mutations should be avoided.
 */
export interface ExclusiveMapTree extends NodeData, MapTree {
	fields: Map<FieldKey, ExclusiveMapTree[]>;
}

/**
 * Returns a deep copy of the given {@link MapTree}.
 * @privateRemarks This is implemented iteratively (rather than recursively, which is much simpler)
 * to avoid the possibility of a stack overflow for very deep trees.
 */
export function deepCopyMapTree(mapTree: MinimalMapTreeNodeView): ExclusiveMapTree {
	type Next = [
		fields: ExclusiveMapTree["fields"],
		sourceFields: MinimalMapTreeNodeView["fields"],
	];
	function create(
		child: MinimalMapTreeNodeView,
		fields: ExclusiveMapTree["fields"],
	): ExclusiveMapTree {
		return {
			type: child.type,
			...(child.value !== undefined ? { value: child.value } : {}),
			fields,
		};
	}

	const rootFields: ExclusiveMapTree["fields"] = new Map();
	const nexts: Next[] = [[rootFields, mapTree.fields]];
	for (let next = nexts.pop(); next !== undefined; next = nexts.pop()) {
		const [fields, sourceFields] = next;
		for (const [key, field] of sourceFields) {
			assert(field.length > 0, 0xbb3 /* invalid map tree: empty field */);
			if (field.length > 0) {
				const newField: ExclusiveMapTree[] = [];
				for (const child of field) {
					const childClone = create(child, new Map());
					newField.push(childClone);
					nexts.push([childClone.fields, child.fields]);
				}
				fields.set(key, newField);
			}
		}
	}

	return create(mapTree, rootFields);
}
