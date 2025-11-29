import { INodeProperties } from 'n8n-workflow';

export const logsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['logs'],
			},
		},
		options: [
			{
				name: 'Submit Logs',
				value: 'submitLogs',
				action: 'Submit log entries',
				description: 'Insert a collection of log entries (Recommended)',
			},
			{
				name: 'Post Single Log',
				value: 'postLog',
				action: 'Post single log entry',
				description: 'Insert a single log entry (⚠️ Deprecated - Use Submit Logs)',
			},
		],
		default: 'submitLogs',
	},
];

export const logsFields: INodeProperties[] = [
	// submitLogs fields
	{
		displayName: 'Logs',
		name: 'logs',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['logs'],
				operation: ['submitLogs'],
			},
		},
		default: '[\n  {\n    "message": "Process started",\n    "level": "Information",\n    "timeStamp": "2024-11-21T15:30:45.123+00:00",\n    "processName": "MyProcess",\n    "jobId": "8066c309-cef8-4b47-9163-b273fc14cc43"\n  }\n]',
		required: true,
		description: 'Array of log entry objects. Each log should have: message, level (Trace/Information/Warning/Error/Fatal), timeStamp (ISO 8601), and optional fields like processName, jobId, fileName, windowsIdentity.',
	},
	{
		displayName: 'Help',
		name: 'helpSubmitLogs',
		type: 'notice',
		displayOptions: {
			show: {
				resource: ['logs'],
				operation: ['submitLogs'],
			},
		},
		default: '',
		description: 'Required fields: message, level, timeStamp. Optional: windowsIdentity, agentSessionId, processName, fileName, jobId, robotName, machineName. TimeStamp format: YYYY-MM-DDTHH:mm:ss.fff+00:00',
	},

	// postLog fields (deprecated)
	{
		displayName: 'Deprecated Notice',
		name: 'deprecatedNotice',
		type: 'notice',
		displayOptions: {
			show: {
				resource: ['logs'],
				operation: ['postLog'],
			},
		},
		default: '',
		description: '⚠️ This operation is deprecated. Please use "Submit Logs" instead for better performance and batch submission.',
	},
	{
		displayName: 'Log Entry',
		name: 'logEntry',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['logs'],
				operation: ['postLog'],
			},
		},
		default: '{\n  "message": "Process started",\n  "level": "Information",\n  "timeStamp": "2024-11-21T15:30:45.123+00:00",\n  "processName": "MyProcess",\n  "jobId": "8066c309-cef8-4b47-9163-b273fc14cc43"\n}',
		required: true,
		description: 'Log entry object with: message, level (Trace/Information/Warning/Error/Fatal), timeStamp (ISO 8601), and optional fields',
	},

	// Quick Templates
	{
		displayName: 'Log Templates',
		name: 'logTemplates',
		type: 'notice',
		displayOptions: {
			show: {
				resource: ['logs'],
				operation: ['submitLogs', 'postLog'],
			},
		},
		default: '',
		description: 'Log Levels: Trace (detailed traces), Information (general info), Warning (warnings), Error (errors), Fatal (critical failures). Always use ISO 8601 format for timeStamp with timezone.',
	},
];
