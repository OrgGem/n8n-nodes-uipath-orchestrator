import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeListSearchResult,
} from 'n8n-workflow';
import { IDataObject } from 'n8n-workflow';

import { uiPathApiRequest, uiPathApiRequestAllItems } from './GenericFunctions';

import { foldersOperations, foldersFields } from './resources/Folders';
import { directoryServiceOperations, directoryServiceFields } from './resources/DirectoryService';
import { processesOperations, processesFields } from './resources/Processes';
import { jobsOperations, jobsFields } from './resources/Jobs';
import { robotsOperations, robotsFields } from './resources/Robots';
import { sessionsOperations, sessionsFields } from './resources/Sessions';
import { assetsOperations, assetsFields } from './resources/Assets';
import { bucketsOperations, bucketsFields } from './resources/Buckets';
import { queuesOperations, queuesFields } from './resources/Queues';
import { auditLogsOperations, auditLogsFields } from './resources/AuditLogs';
import { robotLogsOperations, robotLogsFields } from './resources/RobotLogs';
import { logsOperations, logsFields } from './resources/Logs';
import { customApiCallOperations, customApiCallFields } from './resources/CustomApiCall';

// Import operation handlers
import { executeFoldersOperations } from './operations/folders';
import { executeDirectoryServiceOperations } from './operations/directoryService';
import { executeProcessesOperations } from './operations/processes';
import { executeJobsOperations } from './operations/jobs';
import { executeRobotsOperations } from './operations/robots';
import { executeSessionsOperations } from './operations/sessions';
import { executeAssetsOperations } from './operations/assets';
import { executeBucketsOperations } from './operations/buckets';
import { executeQueuesOperations } from './operations/queues';
import { executeAuditLogsOperations } from './operations/auditLogs';
import { executeRobotLogsOperations } from './operations/robotLogs';
import { executeLogsOperations } from './operations/logs';
import { executeCustomApiCallOperations } from './operations/customApiCall';

export class UiPathOrchestrator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'UiPath Orchestrator',
		name: 'uiPathOrchestrator',
		icon: 'file:uipath.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Interact with UiPath Orchestrator API',
		defaults: {
			name: 'UiPath Orchestrator',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'uiPathOAuth2',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Folders',
						value: 'folders',
					},
					{
						name: 'Directory Service',
						value: 'directoryService',
					},
					{
						name: 'Processes',
						value: 'processes',
					},
					{
						name: 'Jobs',
						value: 'jobs',
					},
					{
						name: 'Robots',
						value: 'robots',
					},
					{
						name: 'Sessions',
						value: 'sessions',
					},
					{
						name: 'Assets',
						value: 'assets',
					},
					{
						name: 'Buckets',
						value: 'buckets',
					},
					{
						name: 'Queues',
						value: 'queues',
					},
					{
						name: 'Audit Logs',
						value: 'auditLogs',
					},
					{
						name: 'Robot Logs',
						value: 'robotLogs',
					},
					{
						name: 'Logs',
						value: 'logs',
					},
					{
						name: 'Custom API Call',
						value: 'customApiCall',
					},
				],
				default: 'folders',
			},
			...foldersOperations,
			...foldersFields,
			...directoryServiceOperations,
			...directoryServiceFields,
			...processesOperations,
			...processesFields,
			...jobsOperations,
			...jobsFields,
			...robotsOperations,
			...robotsFields,
			...sessionsOperations,
			...sessionsFields,
			...assetsOperations,
			...assetsFields,
			...bucketsOperations,
			...bucketsFields,
			...queuesOperations,
			...queuesFields,
			...auditLogsOperations,
			...auditLogsFields,
			...robotLogsOperations,
			...robotLogsFields,
			...logsOperations,
			...logsFields,
			...customApiCallOperations,
			...customApiCallFields,
		],
	};

	methods = {
		listSearch: {
			async getQueues(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					const qs: IDataObject = { $top: 50 };
					if (filter) {
						qs.$filter = `contains(Name, '${filter.replace(/'/g, "''")}')`;
					}
					const responseData = await uiPathApiRequest.call(this, 'GET', '/odata/QueueDefinitions', {}, qs);
					const results = (responseData.value || []).map((item: any) => ({
						name: item.Name,
						value: item.Name,
					}));
					return { results };
				} catch (error) {
					throw new Error(`Failed to load queues: ${(error as Error).message}`);
				}
			},
			async getQueuesById(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					const qs: IDataObject = { $top: 50 };
					if (filter) {
						qs.$filter = `contains(Name, '${filter.replace(/'/g, "''")}')`;
					}
					const responseData = await uiPathApiRequest.call(this, 'GET', '/odata/QueueDefinitions', {}, qs);
					const results = (responseData.value || []).map((item: any) => ({
						name: item.Name,
						value: item.Id,
					}));
					return { results };
				} catch (error) {
					throw new Error(`Failed to load queues by ID: ${(error as Error).message}`);
				}
			},
			async getProcesses(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					const qs: IDataObject = { $top: 50 };
					if (filter) {
						qs.$filter = `contains(Name, '${filter.replace(/'/g, "''")}')`;
					}
					const responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Releases', {}, qs);
					const results = (responseData.value || []).map((item: any) => ({
						name: item.Name,
						value: item.Key,
					}));
					return { results };
				} catch (error) {
					throw new Error(`Failed to load processes: ${(error as Error).message}`);
				}
			},
			async getJobs(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					const qs: IDataObject = { $top: 50, $orderby: 'StartTime desc' };
					if (filter) {
						qs.$filter = `contains(ReleaseName, '${filter.replace(/'/g, "''")}')`;
					}
					const responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Jobs', {}, qs);
					const results = (responseData.value || []).map((item: any) => ({
						name: `${item.ReleaseName} - ${item.State} (${item.StartTime})`,
						value: item.Id,
					}));
					return { results };
				} catch (error) {
					throw new Error(`Failed to load jobs: ${(error as Error).message}`);
				}
			},
			async getBuckets(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					const qs: IDataObject = { $top: 50 };
					if (filter) {
						qs.$filter = `contains(Name, '${filter.replace(/'/g, "''")}')`;
					}
					const responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Buckets', {}, qs);
					const results = (responseData.value || []).map((item: any) => ({
						name: item.Name,
						value: item.Name,
					}));
					return { results };
				} catch (error) {
					throw new Error(`Failed to load buckets: ${(error as Error).message}`);
				}
			},
			async getBucketsById(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					const qs: IDataObject = { $top: 50 };
					if (filter) {
						qs.$filter = `contains(Name, '${filter.replace(/'/g, "''")}')`;
					}
					const responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Buckets', {}, qs);
					const results = (responseData.value || []).map((item: any) => ({
						name: item.Name,
						value: item.Id,
					}));
					return { results };
				} catch (error) {
					throw new Error(`Failed to load buckets by ID: ${(error as Error).message}`);
				}
			},
			async getAssets(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					const qs: IDataObject = { $top: 50 };
					if (filter) {
						qs.$filter = `contains(Name, '${filter.replace(/'/g, "''")}')`;
					}
					const responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Assets', {}, qs);
					const results = (responseData.value || []).map((item: any) => ({
						name: item.Name,
						value: item.Name,
					}));
					return { results };
				} catch (error) {
					throw new Error(`Failed to load assets: ${(error as Error).message}`);
				}
			},
			async getAssetsById(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				try {
					const qs: IDataObject = { $top: 50 };
					if (filter) {
						qs.$filter = `contains(Name, '${filter.replace(/'/g, "''")}')`;
					}
					const responseData = await uiPathApiRequest.call(this, 'GET', '/odata/Assets', {}, qs);
					const results = (responseData.value || []).map((item: any) => ({
						name: item.Name,
						value: item.Id,
					}));
					return { results };
				} catch (error) {
					throw new Error(`Failed to load assets by ID: ${(error as Error).message}`);
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				switch (resource) {
					case 'folders':
						responseData = await executeFoldersOperations.call(this, i, operation);
						break;
					case 'directoryService':
						responseData = await executeDirectoryServiceOperations.call(this, i, operation);
						break;
					case 'processes':
						responseData = await executeProcessesOperations.call(this, i, operation);
						break;
					case 'jobs':
						responseData = await executeJobsOperations.call(this, i, operation);
						break;
					case 'robots':
						responseData = await executeRobotsOperations.call(this, i, operation);
						break;
					case 'sessions':
						responseData = await executeSessionsOperations.call(this, i, operation);
						break;
					case 'assets':
						responseData = await executeAssetsOperations.call(this, i, operation);
						break;
					case 'buckets':
						responseData = await executeBucketsOperations.call(this, i, operation);
						break;
					case 'queues':
						responseData = await executeQueuesOperations.call(this, i, operation);
						break;
					case 'auditLogs':
						responseData = await executeAuditLogsOperations.call(this, i, operation);
						break;
					case 'robotLogs':
						responseData = await executeRobotLogsOperations.call(this, i, operation);
						break;
					case 'logs':
						responseData = await executeLogsOperations.call(this, i, operation);
						break;
					case 'customApiCall':
						responseData = await executeCustomApiCallOperations.call(this, i, operation);
						break;
					default:
						throw new NodeOperationError(
							this.getNode(),
							`Unknown resource: ${resource}`,
						);
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData);
				} else {
					returnData.push(responseData);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: (error as Error).message });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error);
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}