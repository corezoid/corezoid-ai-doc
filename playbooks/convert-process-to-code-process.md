# Converting Process to Code-Based Process

This guide explains how to convert a traditional Corezoid process with multiple nodes into a simplified process where all logic is implemented in a single "Golang Code" node.

The user must specify the following parameters:
- API_URL
- API_TOKEN
- WORKSPACE_ID
- PROC_ID
- PROJECT_ID
- ROOT_FOLDER_ID

All these parameters must be passed when calling the convctl.sh command.

## Overview

Converting a process to a code-based approach involves:
1. Analyzing the original process logic and flow
2. Consolidating all business logic into a single Golang function
3. Replacing multiple nodes with one "Golang Code" node
4. Maintaining the same input parameters and output format

## General Conversion Approach

Any Corezoid process, regardless of its complexity or business logic, can be converted to a code-based approach. The `samples/stripe-checkout.json` serves as a reference example, but the methodology applies to processes with any arbitrary logic.

### Common Process Types That Can Be Converted

- **API Integration Processes**: HTTP requests, webhooks, REST/SOAP API calls
- **Data Processing**: Transformations, validations, calculations, formatting
- **Conditional Logic**: Decision trees, branching flows, rule-based routing  
- **Database Operations**: Queries, updates, data synchronization
- **File Processing**: Reading, parsing, generating files (CSV, JSON, XML)
- **Business Rules**: Complex validation logic, approval workflows
- **External Service Integration**: Payment gateways, messaging services, notifications
- **Mathematical Operations**: Calculations, aggregations, statistical analysis
- **State Management**: Process orchestration, status tracking

### Original Process Structure

The original process (`samples/stripe-checkout.json`) contains multiple nodes:
- **Start** node: Entry point
- **Configuration** node: Sets API URL and path parameters
- **Create params** node: JavaScript code to build form-encoded request body
- **API Stripe checkout** node: HTTP API call to Stripe
- **Reply** node: Returns response to caller
- **Final** node: Process completion
- Multiple error handling nodes for different failure scenarios

### Converted Process Structure

The converted process (`templates/process-as-code.json`) simplifies to:
- **Start** node: Entry point
- **Golang Code** node: Contains all business logic
- **Reply** node: Returns response
- **Final** node: Process completion
- Minimal error handling nodes

## Conversion Steps

### 1. Analyze Original Process Logic

Examine the original process to understand:
- Input parameters required
- Business logic flow
- API calls and transformations
- Error handling scenarios
- Expected output format

### 2. Create Golang Implementation

Convert the distributed logic into a single Golang function. The structure remains the same regardless of the specific business logic:

**Basic Template Structure:**
```go
func usercode(ctx context.Context, data map[string]interface{}) error {
    // 1. Extract and validate input parameters
    // 2. Implement your business logic (API calls, calculations, etc.)
    // 3. Set output data for subsequent nodes
    // 4. Return error if something goes wrong, nil for success
    return nil
}
```

**Stripe Example (from the template):**
The Stripe checkout example shows how API integration logic is consolidated into a single function that handles parameter building, HTTP requests, and response processing.

### 3. Configure Golang Code Node

The "Golang Code" node configuration:
- **Type**: `git_call` 
- **Language**: `golang`
- **Version**: 2
- **Error node**: Points to error handling node
- **Timeout**: Configure appropriate semaphore (e.g., 600 seconds)

### 4. Maintain Parameter Compatibility

Ensure the converted process accepts the same input parameters as the original process. Update the `params` section in the JSON to match your specific requirements.

### 5. Preserve Output Format

The output should match the original process format. Set the appropriate data fields in the `data` map that will be used by subsequent nodes (like the Reply node).

## Benefits of Code-Based Approach

1. **Simplified Flow**: Reduces process complexity from multiple nodes to essentially one
2. **Better Performance**: Eliminates inter-node communication overhead
3. **Easier Debugging**: All logic is in one place
4. **Version Control**: Code can be managed in git repositories
5. **Enhanced Testing**: Unit testing becomes straightforward

## Best Practices

1. **Error Handling**: Implement comprehensive error handling in the Golang code
2. **Logging**: Add appropriate logging for debugging
3. **Input Validation**: Validate input parameters within the code
4. **Timeout Configuration**: Set reasonable timeouts for external API calls
5. **Documentation**: Document the code logic clearly
6. **Testing**: Test the converted process thoroughly

## Template Usage

Use `templates/process-as-code.json` as a template for creating new code-based processes:
1. Copy the template structure
2. Modify input parameters as needed
3. Replace the Golang code with your business logic
4. Update node IDs and connections
5. Configure appropriate error handling

## Testing the Converted Process

### 6.1 Save the Process
Save the converted process to the processes directory:
```bash
~/repos/corezoid-ai-doc/.processes/my_code_process.json
```

### 6.2 Test the Process
Test the converted process using convctl:
```bash
API_URL=<API_URL> API_TOKEN=<API_TOKEN> WORKSPACE_ID=<WORKSPACE_ID> ./convctl.sh run-process <PROC_ID> ~/repos/corezoid-ai-doc/.processes/my_code_process.json <task_data>
```

**Example:**
```bash
API_URL=https://admin.corezoid.com API_TOKEN=123 WORKSPACE_ID=123 ./convctl.sh run-process 123 ~/repos/corezoid-ai-doc/.processes/my_code_process.json '{"customer":"cus_123","priceId":"price_456","successUrl":"https://example.com/success","mode":"payment"}'
```

If you receive the message "Task completed", check the response from the API. If there are errors or unexpected results, review and fix the Golang code in your process.

### 6.3 Validation Checklist
- ✅ Process accepts the same input parameters as the original
- ✅ Business logic produces expected outputs
- ✅ Error handling works correctly
- ✅ Performance is acceptable
- ✅ All edge cases are handled