import { INodeProperties } from 'n8n-workflow';

export const customApiCallOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customApiCall'],
			},
		},
		options: [
			{
				name: 'Make Custom API Request',
				value: 'request',
				description: 'Make a custom API request to any UiPath Orchestrator endpoint',
				action: 'Make custom api request',
			},
		],
		default: 'request',
	},
];

export const customApiCallFields: INodeProperties[] = [
	{
		displayName: 'HTTP Method',
		name: 'method',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['request'],
			},
		},
		options: [
			{
				name: 'GET',
				value: 'GET',
			},
			{
				name: 'POST',
				value: 'POST',
			},
			{
				name: 'PUT',
				value: 'PUT',
			},
			{
				name: 'PATCH',
				value: 'PATCH',
			},
			{
				name: 'DELETE',
				value: 'DELETE',
			},
		],
		default: 'GET',
		description: 'The HTTP method to use for the request',
	},
	{
		displayName: 'Endpoint Path',
		name: 'endpoint',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['request'],
			},
		},
		default: '',
		placeholder: '/odata/YourCustomEndpoint',
		required: true,
		description: 'The API endpoint path (e.g., /odata/CustomEntity or /api/CustomEndpoint). Do not include the base URL.',
	},
	{
		displayName: 'Query Parameters',
		name: 'queryParametersUi',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['request'],
			},
		},
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Query Parameter',
		description: 'Query parameters to append to the URL',
		options: [
			{
				name: 'parameter',
				displayName: 'Parameter',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Query parameter name (e.g., $filter, $top, customParam)',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Query parameter value',
					},
				],
			},
		],
	},
	{
		displayName: 'Query Parameters (JSON)',
		name: 'queryParametersJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['request'],
			},
		},
		default: '',
		placeholder: '{\n  "$filter": "Status eq \'Successful\'",\n  "$top": 100\n}',
		description: 'Query parameters as a JSON object. This will override the UI parameters if both are provided.',
	},
	{
		displayName: 'Request Body',
		name: 'body',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['request'],
				method: ['POST', 'PUT', 'PATCH'],
			},
		},
		default: '',
		placeholder: '{\n  "Name": "Example",\n  "Description": "Custom request body"\n}',
		description: 'The request body as JSON (for POST, PUT, PATCH requests)',
	},
	{
		displayName: 'Headers',
		name: 'headersUi',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['request'],
			},
		},
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Header',
		description: 'Custom headers to include in the request',
		options: [
			{
				name: 'header',
				displayName: 'Header',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Header name (e.g., X-UIPATH-OrganizationUnitId, Content-Type)',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Header value',
					},
				],
			},
		],
	},
	{
		displayName: 'Headers (JSON)',
		name: 'headersJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['request'],
			},
		},
		default: '',
		placeholder: '{\n  "X-UIPATH-OrganizationUnitId": "123",\n  "X-UIPATH-TenantName": "Default"\n}',
		description: 'Custom headers as a JSON object. This will override the UI headers if both are provided.',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['request'],
			},
		},
		default: {},
		placeholder: 'Add Option',
		description: 'Additional options for the request',
		options: [
			{
				displayName: 'Full Response',
				name: 'fullResponse',
				type: 'boolean',
				default: false,
				description: 'Whether to return the full response (including headers and status code) instead of just the body',
			},
			{
				displayName: 'Unwrap OData Response',
				name: 'unwrapOData',
				type: 'boolean',
				default: true,
				description: 'Whether to automatically unwrap OData responses (extract .value property)',
			},
		],
	},
];
