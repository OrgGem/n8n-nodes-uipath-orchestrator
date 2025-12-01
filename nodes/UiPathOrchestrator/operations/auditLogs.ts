import { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeAuditLogsOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'getAll') {
		const auditedService = this.getNodeParameter('auditedService', i) as string;
		const filter = this.getNodeParameter('filter', i) as string;
		const select = this.getNodeParameter('select', i) as string;
		const orderBy = this.getNodeParameter('orderBy', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		const expand = this.getNodeParameter('expand', i) as string;
		const count = this.getNodeParameter('count', i) as boolean;

		const qs: any = {};
		if (top) qs.$top = Math.min(top, 1000);
		if (skip) qs.$skip = skip;
		if (filter) qs.$filter = filter;
		if (select) qs.$select = select;
		if (orderBy) qs.$orderby = orderBy;
		if (count) qs.$count = true;
		if (expand) qs.$expand = expand;

		const headers: { [key: string]: string } = {};
		if (auditedService) {
			headers['x-UIPATH-AuditedService'] = auditedService;
		}

		responseData = await uiPathApiRequest.call(this, 'GET', '/odata/AuditLogs', {}, qs, headers);
		responseData = responseData.value || responseData;
	} else if (operation === 'export') {
		const auditedService = this.getNodeParameter('auditedService', i) as string;
		const filter = this.getNodeParameter('filter', i) as string;
		const exportName = this.getNodeParameter('exportName', i) as string;

		const qs: any = {};
		if (filter) qs.$filter = filter;
		if (exportName) qs.exportName = exportName;

		const headers: { [key: string]: string } = {};
		if (auditedService) {
			headers['x-UIPATH-AuditedService'] = auditedService;
		}

		responseData = await uiPathApiRequest.call(this, 'POST', '/odata/AuditLogs/UiPath.Server.Configuration.OData.Export', {}, qs, headers);
	} else if (operation === 'getDetails') {
		const auditedService = this.getNodeParameter('auditedService', i) as string;
		const auditLogId = this.getNodeParameter('auditLogId', i) as string;

		if (!auditLogId) {
			throw new NodeOperationError(
				this.getNode(),
				'Audit Log ID is required',
			);
		}

		let url = `/odata/AuditLogs/UiPath.Server.Configuration.OData.GetAuditLogDetails(auditLogId=${encodeURIComponent(auditLogId)})`;

		const headers: { [key: string]: string } = {};
		if (auditedService) {
			headers['x-UIPATH-AuditedService'] = auditedService;
		}

		// Fix: Correct parameter order (method, endpoint, body, qs, headers)
		responseData = await uiPathApiRequest.call(this, 'GET', url, {}, {}, headers);
	}

	return responseData;
}
