import { IExecuteFunctions } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeRobotLogsOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'getAll') {
		const filter = this.getNodeParameter('filter', i, '') as string;
		const select = this.getNodeParameter('select', i, '') as string;
		const orderBy = this.getNodeParameter('orderBy', i, 'TimeStamp desc') as string;
		const top = this.getNodeParameter('top', i, 100) as number;
		const skip = this.getNodeParameter('skip', i, 0) as number;
		const expand = this.getNodeParameter('expand', i, '') as string;
		const count = this.getNodeParameter('count', i, false) as boolean;
		const organizationUnitId = this.getNodeParameter('organizationUnitId', i, '') as string;

		const qs: any = {};
		if (top) qs.$top = Math.min(top, 1000);
		if (skip) qs.$skip = skip;
		if (filter) qs.$filter = filter;
		if (select) qs.$select = select;
		if (orderBy) qs.$orderby = orderBy;
		if (count) qs.$count = true;
		if (expand) qs.$expand = expand;

		const headers: { [key: string]: string } = {};
		if (organizationUnitId) {
			headers['X-UIPATH-OrganizationUnitId'] = organizationUnitId;
		}

		responseData = await uiPathApiRequest.call(this, 'GET', '/odata/RobotLogs', {}, qs, headers);
		responseData = responseData.value || responseData;
	} else if (operation === 'export') {
		const filter = this.getNodeParameter('filter', i, '') as string;
		const selectExport = this.getNodeParameter('selectExport', i, '') as string;
		const orderByExport = this.getNodeParameter('orderByExport', i, 'TimeStamp desc') as string;
		const topExport = this.getNodeParameter('topExport', i, 1000) as number;
		const organizationUnitId = this.getNodeParameter('organizationUnitId', i, '') as string;

		const qs: any = {};
		if (filter) qs.$filter = filter;
		if (selectExport) qs.$select = selectExport;
		if (orderByExport) qs.$orderby = orderByExport;
		if (topExport) qs.$top = Math.min(topExport, 1000);

		const headers: { [key: string]: string } = {};
		if (organizationUnitId) {
			headers['X-UIPATH-OrganizationUnitId'] = organizationUnitId;
		}

		responseData = await uiPathApiRequest.call(this, 'POST', '/odata/RobotLogs/UiPath.Server.Configuration.OData.Export', {}, qs, headers);
	} else if (operation === 'getTotalCount') {
		const filter = this.getNodeParameter('filter', i, '') as string;
		const expandCount = this.getNodeParameter('expandCount', i, '') as string;
		const organizationUnitId = this.getNodeParameter('organizationUnitId', i, '') as string;

		const qs: any = {};
		if (filter) qs.$filter = filter;
		if (expandCount) qs.$expand = expandCount;

		const headers: { [key: string]: string } = {};
		if (organizationUnitId) {
			headers['X-UIPATH-OrganizationUnitId'] = organizationUnitId;
		}

		responseData = await uiPathApiRequest.call(this, 'GET', '/odata/RobotLogs/UiPath.Server.Configuration.OData.GetTotalCount', {}, qs, headers);
		// Extract value from OData response
		responseData = responseData.value !== undefined ? { count: responseData.value } : responseData;
	} else if (operation === 'reports') {
		const filter = this.getNodeParameter('filter', i, '') as string;
		const fileNameSubject = this.getNodeParameter('fileNameSubject', i, '') as string;
		const selectReport = this.getNodeParameter('selectReport', i, '') as string;
		const orderByReport = this.getNodeParameter('orderByReport', i, 'TimeStamp desc') as string;
		const topReport = this.getNodeParameter('topReport', i, 1000) as number;
		const organizationUnitId = this.getNodeParameter('organizationUnitId', i, '') as string;

		const qs: any = {};
		if (fileNameSubject) qs.fileNameSubject = fileNameSubject;
		if (filter) qs.$filter = filter;
		if (selectReport) qs.$select = selectReport;
		if (orderByReport) qs.$orderby = orderByReport;
		if (topReport) qs.$top = Math.min(topReport, 1000);

		const headers: { [key: string]: string } = {};
		if (organizationUnitId) {
			headers['X-UIPATH-OrganizationUnitId'] = organizationUnitId;
		}

		// This returns binary file data
		responseData = await uiPathApiRequest.call(this, 'GET', '/odata/RobotLogs/UiPath.Server.Configuration.OData.Reports', {}, qs, headers);
	}

	return responseData;
}
