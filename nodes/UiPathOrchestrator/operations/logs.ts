import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeLogsOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'submitLogs') {
		const logsInput = this.getNodeParameter('logs', i) as string;

		let logs: any[];
		try {
			// Parse the JSON input
			logs = typeof logsInput === 'string' ? JSON.parse(logsInput) : logsInput;

			// Ensure it's an array
			if (!Array.isArray(logs)) {
				throw new NodeOperationError(
					this.getNode(),
					'Logs must be an array of log entry objects',
				);
			}

			// Validate each log entry
			for (const log of logs) {
				if (!log.message || !log.level || !log.timeStamp) {
					throw new NodeOperationError(
						this.getNode(),
						'Each log entry must have: message, level, and timeStamp',
					);
				}
			}

			// Convert log objects to JSON strings as required by the API
			const logStrings = logs.map((log) => JSON.stringify(log));

			const url = `/api/Logs/SubmitLogs`;

			// API expects array of JSON strings
			// Cast to any because API expects array, not IDataObject
			responseData = await uiPathApiRequest.call(this, 'POST', url, logStrings as any);

			// Return success message since API doesn't return body on success
			responseData = {
				success: true,
				message: `Successfully submitted ${logs.length} log entries`,
				count: logs.length,
			};
		} catch (error: any) {
			if (error.name === 'SyntaxError') {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid JSON format: ${error.message}`,
				);
			}
			throw error;
		}
	} else if (operation === 'postLog') {
		const logEntryInput = this.getNodeParameter('logEntry', i) as string;

		let logEntry: any;
		try {
			// Parse the JSON input
			logEntry = typeof logEntryInput === 'string' ? JSON.parse(logEntryInput) : logEntryInput;

			// Validate required fields
			if (!logEntry.message || !logEntry.level || !logEntry.timeStamp) {
				throw new NodeOperationError(
					this.getNode(),
					'Log entry must have: message, level, and timeStamp',
				);
			}

			const url = `/api/Logs`;

			// API expects the log object directly
			responseData = await uiPathApiRequest.call(this, 'POST', url, logEntry);

			// Return success message since API doesn't return body on success
			responseData = {
				success: true,
				message: 'Successfully submitted log entry (⚠️ Deprecated endpoint - consider using Submit Logs)',
				logEntry: logEntry,
			};
		} catch (error: any) {
			if (error.name === 'SyntaxError') {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid JSON format: ${error.message}`,
				);
			}
			throw error;
		}
	}

	return responseData;
}
