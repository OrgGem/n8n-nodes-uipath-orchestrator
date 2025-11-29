import { INodeProperties } from 'n8n-workflow';

export const robotLogsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['robotLogs'],
			},
		},
		options: [
			{
				name: 'Get Robot Logs',
				value: 'getAll',
				action: 'Get robot logs',
				description: 'Retrieve robot execution logs with filtering and pagination',
			},
			{
				name: 'Export Logs',
				value: 'export',
				action: 'Export logs to CSV',
				description: 'Request a CSV export of filtered robot logs',
			},
			{
				name: 'Get Total Count',
				value: 'getTotalCount',
				action: 'Get total count of logs',
				description: 'Get the total count of robot logs matching filter criteria',
			},
			{
				name: 'Generate Reports',
				value: 'reports',
				action: 'Generate log reports',
				description: 'Generate and download log reports',
			},
		],
		default: 'getAll',
	},
];

export const robotLogsFields: INodeProperties[] = [
	// Common fields for getAll, export, getTotalCount, reports
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['getAll', 'export', 'getTotalCount', 'reports'],
			},
		},
		default: '',
		placeholder: "Level eq 'Error' and TimeStamp ge 2024-11-20T00:00:00Z",
		description: 'OData filter expression to filter logs by Level, TimeStamp, ProcessName, JobId, etc.',
	},
	{
		displayName: 'Organization Unit ID',
		name: 'organizationUnitId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['getAll', 'export', 'getTotalCount', 'reports'],
			},
		},
		default: '',
		placeholder: '5',
		description: 'Folder/OrganizationUnit ID to scope the logs',
	},

	// getAll specific fields
	{
		displayName: 'Select',
		name: 'select',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['getAll'],
			},
		},
		default: '',
		placeholder: 'Id,Level,TimeStamp,Message,ProcessName,JobId',
		description: 'Select specific properties to return',
	},
	{
		displayName: 'Order By',
		name: 'orderBy',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['getAll'],
			},
		},
		default: 'TimeStamp desc',
		placeholder: 'TimeStamp desc',
		description: 'Sort order (e.g., TimeStamp desc, Level asc)',
	},
	{
		displayName: 'Top',
		name: 'top',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['getAll'],
			},
		},
		default: 100,
		description: 'Max results to return (1-1000)',
	},
	{
		displayName: 'Skip',
		name: 'skip',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['getAll'],
			},
		},
		default: 0,
		description: 'Number of results to skip for pagination',
	},
	{
		displayName: 'Expand',
		name: 'expand',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['getAll'],
			},
		},
		default: '',
		placeholder: 'Robot,Job',
		description: 'Expand related entities (max depth 2)',
	},
	{
		displayName: 'Count',
		name: 'count',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to include total count in response',
	},

	// export specific fields
	{
		displayName: 'Select (Export)',
		name: 'selectExport',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['export'],
			},
		},
		default: '',
		placeholder: 'Id,Level,TimeStamp,Message,ProcessName',
		description: 'Select specific properties to include in export',
	},
	{
		displayName: 'Order By (Export)',
		name: 'orderByExport',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['export'],
			},
		},
		default: 'TimeStamp desc',
		placeholder: 'TimeStamp desc',
		description: 'Sort order for export',
	},
	{
		displayName: 'Top (Export)',
		name: 'topExport',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['export'],
			},
		},
		default: 1000,
		description: 'Max results to export (1-1000)',
	},

	// reports specific fields
	{
		displayName: 'File Name Subject',
		name: 'fileNameSubject',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['reports'],
			},
		},
		default: '',
		placeholder: 'ErrorReport',
		description: 'Subject/name for the report file',
	},
	{
		displayName: 'Select (Report)',
		name: 'selectReport',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['reports'],
			},
		},
		default: '',
		placeholder: 'Id,Level,TimeStamp,Message',
		description: 'Select specific properties for report',
	},
	{
		displayName: 'Order By (Report)',
		name: 'orderByReport',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['reports'],
			},
		},
		default: 'TimeStamp desc',
		placeholder: 'TimeStamp desc',
		description: 'Sort order for report',
	},
	{
		displayName: 'Top (Report)',
		name: 'topReport',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['reports'],
			},
		},
		default: 1000,
		description: 'Max results to include in report',
	},

	// getTotalCount specific fields
	{
		displayName: 'Expand (Count)',
		name: 'expandCount',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robotLogs'],
				operation: ['getTotalCount'],
			},
		},
		default: '',
		placeholder: 'Robot',
		description: 'Expand related entities for counting',
	},
];
