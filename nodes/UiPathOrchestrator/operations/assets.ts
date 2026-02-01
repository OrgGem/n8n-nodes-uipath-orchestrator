import { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

// Helper function to validate expand depth
function validateExpandDepth(expand: string, maxDepth: number = 2): void {
	if (!expand) return;

	// Count parenthesis nesting depth
	let depth = 0;
	let maxDepthFound = 0;
	for (const char of expand) {
		if (char === '(') {
			depth++;
			maxDepthFound = Math.max(maxDepthFound, depth);
		} else if (char === ')') {
			depth--;
		}
	}

	if (maxDepthFound > maxDepth) {
		throw new NodeOperationError(
			null as any,
			`Expand cannot have depth greater than ${maxDepth}`
		);
	}
}

export async function executeAssetsOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'getFoldersForAsset') {
		const assetId = this.getNodeParameter('assetIdForFolders', i, '', { extractValue: true }) as string;
		const expand = this.getNodeParameter('expandAssetFolders', i) as string;
		const select = this.getNodeParameter('selectAssetFolders', i) as string;

		const qs: any = {};
		if (expand) qs.$expand = expand;
		if (select) qs.$select = select;

		responseData = await uiPathApiRequest.call(this, 'GET', `/odata/Assets/UiPath.Server.Configuration.OData.GetFoldersForAsset(id=${encodeURIComponent(assetId)})`, {}, qs);
	} else if (operation === 'getRobotAsset') {
		const robotKey = this.getNodeParameter('robotKey', i) as string;
		const name = this.getNodeParameter('assetName', i, '', { extractValue: true }) as string;
		let url = `/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAsset(robotId='${encodeURIComponent(robotKey)}',assetName='${encodeURIComponent(name)}')`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
	} else if (operation === 'getRobotAssetByNameForRobotKey') {
		const bodyStr = this.getNodeParameter('bodyJson', i) as string;
		let body = {};
		try {
			body = JSON.parse(bodyStr || '{}');
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Invalid JSON: ${(error as Error).message}`);
		}
		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAssetByNameForRobotKey',
			body,
		);
	} else if (operation === 'getRobotAssetByRobotId') {
		const robotId = this.getNodeParameter('robotNumericId', i) as number;
		const name = this.getNodeParameter('assetName', i, '', { extractValue: true }) as string;
		let url = `/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAssetByRobotId(robotId=${encodeURIComponent(robotId.toString())},assetName='${encodeURIComponent(name)}')`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
	} else if (operation === 'setRobotAssetByRobotKey') {
		const bodyStr = this.getNodeParameter('bodyJson', i) as string;
		let body = {};
		try {
			body = JSON.parse(bodyStr || '{}');
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Invalid JSON: ${(error as Error).message}`);
		}
		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Assets/UiPath.Server.Configuration.OData.SetRobotAssetByRobotKey',
			body,
		);
	} else if (operation === 'shareToFolders') {
		const assetIdsJson = this.getNodeParameter('assetIdsJson', i) as string;
		const toAdd = this.getNodeParameter('assetToAddFolderIds', i) as string;
		const toRemove = this.getNodeParameter('assetToRemoveFolderIds', i) as string;

		let assetIds = [];
		let toAddIds = [];
		let toRemoveIds = [];
		try {
			assetIds = JSON.parse(assetIdsJson || '[]');
			toAddIds = JSON.parse(toAdd || '[]');
			toRemoveIds = JSON.parse(toRemove || '[]');
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Invalid JSON: ${(error as Error).message}`);
		}

		const body = {
			AssetIds: assetIds,
			ToAddFolderIds: toAddIds,
			ToRemoveFolderIds: toRemoveIds,
		};
		responseData = await uiPathApiRequest.call(this, 'POST', '/odata/Assets/UiPath.Server.Configuration.OData.ShareToFolders', body);
	} else if (operation === 'getAll') {
		const top = this.getNodeParameter('take', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;

		const qs: any = {};
		if (top && top > 0) qs.$top = Math.min(top, 1000);
		if (skip && skip > 0) qs.$skip = skip;

		responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Assets', {}, qs);
		responseData = responseData.value || responseData;
	}

	// GetFiltered (recommended) - OData function
	else if (operation === 'getFiltered') {
		const expand = this.getNodeParameter('expand', i) as string;
		const filter = this.getNodeParameter('filter', i) as string;
		const select = this.getNodeParameter('select', i) as string;
		const orderby = this.getNodeParameter('orderby', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skipFiltered', i) as number;
		const count = this.getNodeParameter('count', i) as boolean;

		const qs: any = {};
		if (filter) qs.$filter = filter;
		if (select) qs.$select = select;
		if (top && top > 0) qs.$top = Math.min(top, 1000);
		if (expand) {
			validateExpandDepth(expand, 2);
			qs.$expand = expand;
		}
		if (orderby) qs.$orderby = orderby;
		if (skip && skip > 0) qs.$skip = skip;
		if (count) qs.$count = true;

		responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Assets/UiPath.Server.Configuration.OData.GetFiltered', {}, qs);
		responseData = responseData.value || responseData;
	}

	// Get assets across folders
	else if (operation === 'getAssetsAcrossFolders') {
		const excludeFolderId = this.getNodeParameter('excludeFolderId', i) as string;
		const filter = this.getNodeParameter('filter', i) as string;
		const expand = this.getNodeParameter('expand', i) as string;
		const select = this.getNodeParameter('select', i) as string;
		const orderby = this.getNodeParameter('orderby', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		const count = this.getNodeParameter('count', i) as boolean;
		const organizationUnitId = this.getNodeParameter('organizationUnitId', i) as number;

		const qs: any = {};
		if (excludeFolderId) qs.excludeFolderId = excludeFolderId;
		if (filter) qs.$filter = filter;
		if (select) qs.$select = select;
		if (expand) {
			validateExpandDepth(expand, 2);
			qs.$expand = expand;
		}
		if (orderby) qs.$orderby = orderby;
		if (top && top > 0) qs.$top = Math.min(top, 1000);
		if (skip && skip > 0) qs.$skip = skip;
		if (count) qs.$count = true;

		const headers = organizationUnitId ? { 'X-UIPATH-OrganizationUnitId': organizationUnitId.toString() } : {};
		responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Assets/UiPath.Server.Configuration.OData.GetAssetsAcrossFolders', {}, qs, headers);
		responseData = responseData.value || responseData;
	}

	// Create Asset
	else if (operation === 'createAsset') {
		const name = this.getNodeParameter('name', i) as string;
		const valueType = this.getNodeParameter('valueType', i) as string;

		if (!name) {
			throw new NodeOperationError(this.getNode(), 'Asset name is required');
		}
		if (!valueType) {
			throw new NodeOperationError(this.getNode(), 'Value type is required');
		}

		// Add value type validation
		const validValueTypes = ['Text', 'Bool', 'Integer', 'Credential', 'WindowsCredential', 'KeyValueList', 'DBConnectionString'];
		if (!validValueTypes.includes(valueType)) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid value type: ${valueType}. Valid types are: ${validValueTypes.join(', ')}`
			);
		}

		const value = this.getNodeParameter('value', i) as string;
		const description = this.getNodeParameter('description', i) as string;
		const robotValue = this.getNodeParameter('robotValue', i) as string;
		const robotId = this.getNodeParameter('robotId', i) as number;

		const body: any = {
			Name: name,
			ValueType: valueType,
		};
		if (value) body.Value = value;
		if (description) body.Description = description;
		if (robotValue) body.RobotValue = robotValue;
		if (robotId) body.RobotId = robotId;

		responseData = await uiPathApiRequest.call(this, 'POST', '/odata/Assets', body);
	}

	// Get Asset by ID
	else if (operation === 'getAsset') {
		const assetId = this.getNodeParameter('assetId', i, '', { extractValue: true }) as string;

		if (!assetId) {
			throw new NodeOperationError(this.getNode(), 'Asset ID is required');
		}

		const expand = this.getNodeParameter('expandAssetFolders', i) as string;
		const select = this.getNodeParameter('selectAssetFolders', i) as string;

		const qs: any = {};
		if (expand) qs.$expand = expand;
		if (select) qs.$select = select;

		responseData = await uiPathApiRequest.call(this, 'GET', `/odata/Assets(${assetId})`, {}, qs);
	}

	// Update Asset
	else if (operation === 'updateAsset') {
		const assetId = this.getNodeParameter('assetId', i, '', { extractValue: true }) as string;

		if (!assetId) {
			throw new NodeOperationError(this.getNode(), 'Asset ID is required');
		}

		const name = this.getNodeParameter('name', i) as string;
		const valueType = this.getNodeParameter('valueType', i) as string;
		const value = this.getNodeParameter('value', i) as string;
		const description = this.getNodeParameter('description', i) as string;
		const robotValue = this.getNodeParameter('robotValue', i) as string;
		const robotId = this.getNodeParameter('robotId', i) as number;

		const body: any = {};
		if (name) body.Name = name;
		if (valueType) body.ValueType = valueType;
		if (value) body.Value = value;
		if (description) body.Description = description;
		if (robotValue) body.RobotValue = robotValue;
		if (robotId) body.RobotId = robotId;

		if (Object.keys(body).length === 0) {
			throw new NodeOperationError(this.getNode(), 'At least one field must be provided to update');
		}

		responseData = await uiPathApiRequest.call(this, 'PUT', `/odata/Assets(${assetId})`, body);
	}

	// Delete Asset
	else if (operation === 'deleteAsset') {
		const assetId = this.getNodeParameter('assetId', i, '', { extractValue: true }) as string;

		if (!assetId) {
			throw new NodeOperationError(this.getNode(), 'Asset ID is required');
		}

		await uiPathApiRequest.call(this, 'DELETE', `/odata/Assets(${assetId})`);
		responseData = { success: true, id: assetId };
	}

	return responseData;
}
