import { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeSessionsOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'getAll') {
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		const filter = this.getNodeParameter('filter', i) as string;
		const select = this.getNodeParameter('select', i) as string;
		const orderBy = this.getNodeParameter('orderBy', i) as string;
		const count = this.getNodeParameter('count', i) as boolean;
		const expand = this.getNodeParameter('expand', i) as string;

		const qs: any = {};
		if (top) qs.$top = Math.min(top, 1000);
		if (skip) qs.$skip = skip;
		if (filter) qs.$filter = filter;
		if (select) qs.$select = select;
		if (orderBy) qs.$orderby = orderBy;
		if (count) qs.$count = true;
		if (expand) qs.$expand = expand;

		responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Sessions', {}, qs);
		responseData = responseData.value || responseData;
	} else if (operation === 'toggleDebugMode') {
		const sessionId = this.getNodeParameter('sessionId', i) as string;
		const enabled = this.getNodeParameter('enabled', i) as boolean;
		const body = { enabled };

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			`/odata/Sessions(${sessionId})/UiPath.Server.Configuration.OData.ToggleMachineSessionDebugMode`,
			body,
		);
	} else if (operation === 'deleteInactiveUnattendedSessions') {
		const inactivityThresholdMinutes = this.getNodeParameter('inactivityThresholdMinutes', i) as number;
		const machineIdsStr = this.getNodeParameter('machineIds', i) as string;
		let machineIds = [];
		try {
			machineIds = JSON.parse(machineIdsStr || '[]');
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Machine IDs: ${(error as Error).message}`,
			);
		}
		const body = {
			inactivityThresholdMinutes,
			machineIds,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Sessions/UiPath.Server.Configuration.OData.DeleteInactiveUnattendedSessions',
			body,
		);
	} else if (operation === 'getGlobalSessions') {
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		const filter = this.getNodeParameter('filter', i) as string;
		const select = this.getNodeParameter('select', i) as string;
		const orderBy = this.getNodeParameter('orderBy', i) as string;
		const count = this.getNodeParameter('count', i) as boolean;

		const qs: any = {};
		if (top) qs.$top = Math.min(top, 1000);
		if (skip) qs.$skip = skip;
		if (filter) qs.$filter = filter;
		if (select) qs.$select = select;
		if (orderBy) qs.$orderby = orderBy;
		if (count) qs.$count = true;

		responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Sessions/UiPath.Server.Configuration.OData.GetGlobalSessions', {}, qs);
		responseData = responseData.value || responseData;
	} else if (operation === 'getMachineSessionRuntimes') {
		const runtimeType = this.getNodeParameter('runtimeType', i) as string;
		const filter = this.getNodeParameter('filter', i) as string;
		const top = this.getNodeParameter('top', i) as number;

		const qs: any = {};
		if (runtimeType) qs.runtimeType = runtimeType;
		if (filter) qs.$filter = filter;
		if (top) qs.$top = Math.min(top, 1000);

		responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Sessions/UiPath.Server.Configuration.OData.GetMachineSessionRuntimes', {}, qs);
		responseData = responseData.value || responseData;
	} else if (operation === 'getMachineSessionRuntimesByFolderId') {
		const folderId = this.getNodeParameter('folderId', i) as string;
		const robotId = this.getNodeParameter('robotId', i) as string;
		const runtimeType = this.getNodeParameter('runtimeType', i) as string;

		const qs: any = {};
		if (robotId) qs.robotId = robotId;
		if (runtimeType) qs.runtimeType = runtimeType;

		responseData = await uiPathApiRequest.call(this, 'GET', `/odata/Sessions/UiPath.Server.Configuration.OData.GetMachineSessionRuntimesByFolderId(folderId=${encodeURIComponent(folderId)})`, {}, qs);
		responseData = responseData.value || responseData;
	} else if (operation === 'getMachineSessions') {
		const machineId = this.getNodeParameter('machineId', i) as string;
		const filter = this.getNodeParameter('filter', i) as string;
		const top = this.getNodeParameter('top', i) as number;

		const qs: any = {};
		if (filter) qs.$filter = filter;
		if (top) qs.$top = Math.min(top, 1000);

		responseData = await uiPathApiRequest.call(this, 'GET', `/odata/Sessions/UiPath.Server.Configuration.OData.GetMachineSessions(key=${encodeURIComponent(machineId)})`, {}, qs);
		responseData = responseData.value || responseData;
	} else if (operation === 'getUsernames') {
		const filter = this.getNodeParameter('filter', i) as string;
		const top = this.getNodeParameter('top', i) as number;

		const qs: any = {};
		if (filter) qs.$filter = filter;
		if (top) qs.$top = Math.min(top, 1000);

		responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Sessions/UiPath.Server.Configuration.OData.GetUsernames', {}, qs);
		responseData = responseData.value || responseData;
	} else if (operation === 'setMaintenanceMode') {
		const hostName = this.getNodeParameter('hostName', i) as string;
		const maintenanceMode = this.getNodeParameter('maintenanceMode', i) as boolean;
		const allowedRobotTypesStr = this.getNodeParameter('allowedRobotTypes', i) as string;
		let allowedRobotTypes = [];
		try {
			allowedRobotTypes = JSON.parse(allowedRobotTypesStr || '[]');
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Allowed Robot Types: ${(error as Error).message}`,
			);
		}
		const body = {
			hostName,
			maintenanceMode,
			allowedRobotTypes,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Sessions/UiPath.Server.Configuration.OData.SetMaintenanceMode',
			body,
		);
	}

	return responseData;
}
