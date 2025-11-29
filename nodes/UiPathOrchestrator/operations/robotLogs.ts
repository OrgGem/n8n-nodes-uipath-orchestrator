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

		let url = `/odata/RobotLogs`;
		const queryParams = [];

		if (top) queryParams.push(`$top=${Math.min(top, 1000)}`);
		if (skip) queryParams.push(`$skip=${skip}`);
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (select) queryParams.push(`$select=${select}`);
		if (orderBy) queryParams.push(`$orderby=${orderBy}`);
		if (count) queryParams.push(`$count=true`);
		if (expand) queryParams.push(`$expand=${expand}`);

		if (queryParams.length > 0) url += '?' + queryParams.join('&');

		const headers: { [key: string]: string } = {};
		if (organizationUnitId) {
			headers['X-UIPATH-OrganizationUnitId'] = organizationUnitId;
		}

		responseData = await uiPathApiRequest.call(this, 'GET', url, {}, {}, headers);
		responseData = responseData.value || responseData;
	} else if (operation === 'export') {
		const filter = this.getNodeParameter('filter', i, '') as string;
		const selectExport = this.getNodeParameter('selectExport', i, '') as string;
		const orderByExport = this.getNodeParameter('orderByExport', i, 'TimeStamp desc') as string;
		const topExport = this.getNodeParameter('topExport', i, 1000) as number;
		const organizationUnitId = this.getNodeParameter('organizationUnitId', i, '') as string;

		let url = `/odata/RobotLogs/UiPath.Server.Configuration.OData.Export`;
		const queryParams = [];

		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (selectExport) queryParams.push(`$select=${selectExport}`);
		if (orderByExport) queryParams.push(`$orderby=${orderByExport}`);
		if (topExport) queryParams.push(`$top=${Math.min(topExport, 1000)}`);

		if (queryParams.length > 0) url += '?' + queryParams.join('&');

		const headers: { [key: string]: string } = {};
		if (organizationUnitId) {
			headers['X-UIPATH-OrganizationUnitId'] = organizationUnitId;
		}

		responseData = await uiPathApiRequest.call(this, 'POST', url, {}, {}, headers);
	} else if (operation === 'getTotalCount') {
		const filter = this.getNodeParameter('filter', i, '') as string;
		const expandCount = this.getNodeParameter('expandCount', i, '') as string;
		const organizationUnitId = this.getNodeParameter('organizationUnitId', i, '') as string;

		let url = `/odata/RobotLogs/UiPath.Server.Configuration.OData.GetTotalCount`;
		const queryParams = [];

		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (expandCount) queryParams.push(`$expand=${expandCount}`);

		if (queryParams.length > 0) url += '?' + queryParams.join('&');

		const headers: { [key: string]: string } = {};
		if (organizationUnitId) {
			headers['X-UIPATH-OrganizationUnitId'] = organizationUnitId;
		}

		responseData = await uiPathApiRequest.call(this, 'GET', url, {}, {}, headers);
		// Extract value from OData response
		responseData = responseData.value !== undefined ? { count: responseData.value } : responseData;
	} else if (operation === 'reports') {
		const filter = this.getNodeParameter('filter', i, '') as string;
		const fileNameSubject = this.getNodeParameter('fileNameSubject', i, '') as string;
		const selectReport = this.getNodeParameter('selectReport', i, '') as string;
		const orderByReport = this.getNodeParameter('orderByReport', i, 'TimeStamp desc') as string;
		const topReport = this.getNodeParameter('topReport', i, 1000) as number;
		const organizationUnitId = this.getNodeParameter('organizationUnitId', i, '') as string;

		let url = `/odata/RobotLogs/UiPath.Server.Configuration.OData.Reports`;
		const queryParams = [];

		if (fileNameSubject) queryParams.push(`fileNameSubject=${fileNameSubject}`);
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (selectReport) queryParams.push(`$select=${selectReport}`);
		if (orderByReport) queryParams.push(`$orderby=${orderByReport}`);
		if (topReport) queryParams.push(`$top=${Math.min(topReport, 1000)}`);

		if (queryParams.length > 0) url += '?' + queryParams.join('&');

		const headers: { [key: string]: string } = {};
		if (organizationUnitId) {
			headers['X-UIPATH-OrganizationUnitId'] = organizationUnitId;
		}

		// This returns binary file data
		responseData = await uiPathApiRequest.call(this, 'GET', url, {}, {}, headers);
	}

	return responseData;
}
