/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { ApiItem } from "@microsoft/api-extractor-model";
import type { DocDeclarationReference } from "@microsoft/tsdoc";

import type { Link } from "../Link.js";
import { DocumentNode, type SectionNode } from "../documentation-domain/index.js";
import { resolveSymbolicReference } from "../utilities/index.js";

import {
	getDocumentPathForApiItem,
	getLinkForApiItem,
	shouldItemBeIncluded,
} from "./ApiItemTransformUtilities.js";
import type { ApiItemTransformationConfiguration } from "./configuration/index.js";
import { wrapInSection } from "./helpers/index.js";

/**
 * Creates a {@link DocumentNode} representing the provided API item.
 *
 * @param documentItem - The API item to be documented.
 * @param sections - An array of sections to be included in the document.
 * @param config - The transformation configuration for the API item.
 *
 * @returns A {@link DocumentNode} representing the constructed document.
 */
export function createDocument(
	documentItem: ApiItem,
	sections: SectionNode[],
	config: ApiItemTransformationConfiguration,
): DocumentNode {
	const title = config.getHeadingTextForItem(documentItem);

	// Wrap sections in a root section if top-level heading is requested.
	const contents = config.includeTopLevelDocumentHeading
		? [wrapInSection(sections, { title })]
		: sections;

	return new DocumentNode({
		apiItem: documentItem,
		children: contents,
		documentPath: getDocumentPathForApiItem(documentItem, config.hierarchy),
	});
}

/**
 * Resolves a symbolic link and creates a URL to the target.
 *
 * @param contextApiItem - See {@link TsdocNodeTransformOptions.contextApiItem}.
 * @param codeDestination - The link reference target.
 * @param config - See {@link ApiItemTransformationConfiguration}.
 */
export function resolveSymbolicLink(
	contextApiItem: ApiItem,
	codeDestination: DocDeclarationReference,
	config: ApiItemTransformationConfiguration,
): Link | undefined {
	const { apiModel, logger } = config;

	let resolvedReference: ApiItem;
	try {
		resolvedReference = resolveSymbolicReference(contextApiItem, codeDestination, apiModel);
	} catch (error: unknown) {
		logger.warning((error as Error).message);
		return undefined;
	}

	// Return undefined if the resolved API item should be excluded based on release tags
	if (!shouldItemBeIncluded(resolvedReference, config)) {
		logger.verbose("Excluding link to item based on release tags");
		return undefined;
	}

	return getLinkForApiItem(resolvedReference, config);
}

/**
 * Checks for duplicate {@link DocumentNode.documentPath}s among the provided set of documents.
 * @throws If any duplicates are found.
 */
export function checkForDuplicateDocumentPaths(documents: readonly DocumentNode[]): void {
	const documentPathMap = new Map<string, DocumentNode[]>();
	for (const document of documents) {
		let entries = documentPathMap.get(document.documentPath);
		if (entries === undefined) {
			entries = [];
			documentPathMap.set(document.documentPath, entries);
		}
		entries.push(document);
	}

	const duplicates = [...documentPathMap.entries()].filter(
		([, documentsUnderPath]) => documentsUnderPath.length > 1,
	);

	if (duplicates.length === 0) {
		return;
	}

	const errorMessageLines = ["Duplicate output paths found among the generated documents:"];

	for (const [documentPath, documentsUnderPath] of duplicates) {
		errorMessageLines.push(`- ${documentPath}`);
		for (const document of documentsUnderPath) {
			const errorEntry = document.apiItem
				? `${document.apiItem.displayName} (${document.apiItem.kind})`
				: "(No corresponding API item)";
			errorMessageLines.push(`  - ${errorEntry}`);
		}
	}
	errorMessageLines.push(
		"Check your configuration to ensure different API items do not result in the same output path.",
	);

	throw new Error(errorMessageLines.join("\n"));
}
