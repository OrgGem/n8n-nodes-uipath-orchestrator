import { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeCustomApiCallOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'request') {
		const method = this.getNodeParameter('method', i) as string;
		const endpoint = this.getNodeParameter('endpoint', i) as string;
		const queryParametersJson = this.getNodeParameter('queryParametersJson', i, '') as string;
		const headersJson = this.getNodeParameter('headersJson', i, '') as string;
		const options = this.getNodeParameter('options', i, {}) as {
			fullResponse?: boolean;
			unwrapOData?: boolean;
		};

		// Validate endpoint
		if (!endpoint) {
			throw new NodeOperationError(this.getNode(), 'Endpoint path is required');
		}
		if (!endpoint.startsWith('/')) {
			throw new NodeOperationError(
				this.getNode(),
				'Endpoint path must start with / (e.g., /odata/YourEndpoint)',
			);
		}

		// Build query parameters
		let qs: any = {};

		// First, try to parse JSON query parameters
		if (queryParametersJson) {
			try {
				qs = JSON.parse(queryParametersJson);
				if (typeof qs !== 'object' || Array.isArray(qs)) {
					throw new Error('Query parameters JSON must be an object');
				}
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid Query Parameters JSON: ${(error as Error).message}`,
				);
			}
		}
		// If no JSON, use UI parameters
		else {
			const queryParametersUi = this.getNodeParameter('queryParametersUi', i, {}) as {
				parameter?: Array<{ name: string; value: string }>;
			};
			if (queryParametersUi.parameter && queryParametersUi.parameter.length > 0) {
				for (const param of queryParametersUi.parameter) {
					if (param.name) {
						qs[param.name] = param.value;
					}
				}
			}
		}

		// Build headers
		let headers: { [key: string]: string } = {};

		// First, try to parse JSON headers
		if (headersJson) {
			try {
				headers = JSON.parse(headersJson);
				if (typeof headers !== 'object' || Array.isArray(headers)) {
					throw new Error('Headers JSON must be an object');
				}
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid Headers JSON: ${(error as Error).message}`,
				);
			}
		}
		// If no JSON, use UI headers
		else {
			const headersUi = this.getNodeParameter('headersUi', i, {}) as {
				header?: Array<{ name: string; value: string }>;
			};
			if (headersUi.header && headersUi.header.length > 0) {
				for (const header of headersUi.header) {
					if (header.name) {
						headers[header.name] = header.value;
					}
				}
			}
		}

		// Build request body
		let body: any = {};
		if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
			const bodyJson = this.getNodeParameter('body', i, '') as string;
			if (bodyJson) {
				try {
					body = JSON.parse(bodyJson);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Invalid Request Body JSON: ${(error as Error).message}`,
					);
				}
			}
		}

		// Make the API request
		responseData = await uiPathApiRequest.call(
			this,
			method,
			endpoint,
			body,
			qs,
			headers,
		);

		// Handle response based on options
		if (options.unwrapOData !== false) {
			// Automatically unwrap OData responses (extract .value property)
			responseData = responseData.value || responseData;
		}

		// If full response is requested, wrap it with metadata
		if (options.fullResponse) {
			responseData = {
				body: responseData,
				// Note: axios doesn't expose full response in our wrapper, but we can add it if needed
			};
		}
	}

	return responseData;
}
