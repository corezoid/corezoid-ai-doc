# Corezoid Process Development Playbook

## Objective

This playbook guides the creation of Corezoid processes packaged in ZIP archives according to user
requirements. It covers process design, implementation, and packaging, following Corezoid best
practices and documentation standards.

## When to Use

Use this playbook when:

- Building automated workflows in Corezoid
- Converting business requirements into executable processes
- Packaging processes for deployment
- Integrating with external systems via Corezoid
- Creating modular, maintainable process architectures

## Required Background Knowledge

- Basic understanding of JSON structure
- Familiarity with workflow automation concepts
- Understanding of API integration patterns

## Required Tools

- JSON editor
- Tool for generating node IDs (24-character hex strings)
- ZIP creation utility

## References

- [Corezoid Documentation](https://git.corezoid.com/documentation/corezoid-doc/-/tree/main/src?ref_type=heads) -
  Official Corezoid documentation repository

## Steps

### 1. Analyze Requirements

```javascript
// This function analyzes user requirements to identify key components
function analyzeRequirements(requirements) {
  // Extract key information from requirements
  const inputs = identifyInputParameters(requirements);
  const outputs = identifyOutputParameters(requirements);
  const integrations = identifyExternalSystems(requirements);
  const decisionPoints = identifyDecisionPoints(requirements);

  return {
    inputs,
    outputs,
    integrations,
    decisionPoints,
    flowDescription: createFlowDescription(inputs, outputs, integrations, decisionPoints)
  };
}
```

1. Identify input and output parameters required in the process
2. Determine which external systems need integration
3. Identify decision points and conditional logic
4. Create a high-level flow description
5. Determine whether the process should be standalone or part of a larger workflow

### 2. Design Process Structure

```javascript
// Function to create process structure
function createProcessStructure(requirements) {
  const processStructure = {
    nodes: [],
    connections: []
  };

  // Add Start node
  const startNode = createStartNode();
  processStructure.nodes.push(startNode);

  // Add parameter initialization for optional parameters
  const paramInitNode = createParameterInitNode(requirements.inputs);
  if (paramInitNode) {
    processStructure.nodes.push(paramInitNode);
    processStructure.connections.push(createConnection(startNode.id, paramInitNode.id));
  }

  // Add main process logic nodes
  // Add End nodes

  return processStructure;
}
```

1. Create a flowchart of the process with these components:
   - Start node (single entry point)
   - Parameter initialization for optional parameters
   - Main process logic
   - Error handling paths
   - End nodes (success and error)
2. Position nodes following the standard pattern:
   - Main flow from top to bottom
   - Error handling to the right
   - Use consistent spacing (200-300px vertical, 300px horizontal)
   - Remember that circular nodes (Start/End) have their pivot point at the center, while other
     nodes have it at the top-left corner
   - Add 100px to the X-coordinate of circular nodes for visual alignment with rectangular nodes
3. Design modular processes - break complex workflows into smaller, focused processes

Reference:
[Node Positioning Best Practices](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/process/node-positioning-best-practices.md)

### 3. Define Process Parameters

```javascript
// Function to create process parameter definitions
function createParameters(inputs, outputs) {
  const params = [];

  // Add input parameters
  for (const input of inputs) {
    params.push({
      name: input.name,
      type: input.type,
      descr: input.description,
      flags: input.required ? ["input", "required"] : ["input"],
      regex: input.validationPattern || "",
      regex_error_text: input.validationError || ""
    });
  }

  // Add output parameters
  for (const output of outputs) {
    params.push({
      name: output.name,
      type: output.type,
      descr: output.description,
      flags: ["output"],
      regex: "",
      regex_error_text: ""
    });
  }

  return params;
}
```

1. Configure input parameters:

   - Define name, type, and description
   - Mark critical parameters as required
   - Add regex validation patterns for format validation
   - Provide clear error messages for validation failures

   ```json
   {
     "name": "customer_id",
     "type": "string",
     "descr": "Customer identifier",
     "flags": ["required", "input"],
     "regex": "^[A-Z0-9]{8,12}$",
     "regex_error_text": "Customer ID must be 8-12 uppercase alphanumeric characters"
   }
   ```

2. Configure output parameters:

   - Define name, type, and description
   - Mark with the "output" flag
   - These parameters define the contract for what data will be returned

   ```json
   {
     "name": "transaction_result",
     "type": "object",
     "descr": "Transaction processing result",
     "flags": ["output"],
     "regex": "",
     "regex_error_text": ""
   }
   ```

3. Apply appropriate data types (string, number, boolean, array, object)

Reference:
[Process with Input Parameters](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/process/process-with-parameters.md),
[Process Output Parameters](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/process/process-output-parameters.md)

### 4. Implement Start and End Nodes

```javascript
// Function to create a Start node
function createStartNode() {
  return {
    id: generateNodeId(), // Generate 24-character hex string
    obj_type: 1, // 1 = Start node
    condition: {
      logics: [
        {
          type: "go",
          to_node_id: null // Will be set later
        }
      ],
      semaphors: []
    },
    title: "Start",
    description: "Process entry point",
    x: 600, // Note: +100px X offset for circular nodes
    y: 100,
    uuid: generateUuid(),
    extra: '{"modeForm":"collapse","icon":""}',
    options: '{"direct_url":true,"type_auth":"no_auth"}'
  };
}

// Function to create End nodes
function createEndNodes() {
  const successNode = {
    id: generateNodeId(),
    obj_type: 2, // 2 = End node
    condition: {
      logics: [],
      semaphors: []
    },
    title: "Success",
    description: "Process completed successfully",
    x: 600, // Note: +100px X offset for circular nodes
    y: 800,
    uuid: generateUuid(),
    extra: '{"modeForm":"collapse","icon":"success"}',
    options: '{"save_task":true}'
  };

  const errorNode = {
    id: generateNodeId(),
    obj_type: 2,
    condition: {
      logics: [],
      semaphors: []
    },
    title: "Error",
    description: "Process completed with error",
    x: 900, // Note: +100px X offset and positioned to the right
    y: 800,
    uuid: generateUuid(),
    extra: '{"modeForm":"collapse","icon":"error"}',
    options: '{"save_task":true,"error_status":true}'
  };

  return [successNode, errorNode];
}
```

1. Create a Start node:
   - Configure with a descriptive title
   - Set obj_type = 1
   - Position at the top with X=600, Y=100 (adding 100px to X-coordinate for center pivot point)
   - Enable direct URL if the process should be called via API
2. Create End nodes:
   - Success End node (icon: "success")
   - Error End node(s) (icon: "error")
   - Position at the bottom of their respective paths
   - Configure save_task=true to maintain task history
   - Remember to add 100px to X-coordinate for center pivot point

### 5. Implement Process Logic Nodes

```javascript
// Function to create parameter initialization node
function createParameterInitNode(inputs) {
  const optionalInputs = inputs.filter(input => !input.required);

  // Skip if no optional parameters to initialize
  if (optionalInputs.length === 0) {
    return null;
  }

  // Create a Set Parameters node for initializing optional parameters
  const initNode = {
    id: generateNodeId(),
    obj_type: 0,
    condition: {
      logics: [
        {
          type: "set_param",
          extra: {},
          extra_type: {},
          err_node_id: generateNodeId() // Will create error node later
        },
        {
          type: "go",
          to_node_id: null // Will be set later
        }
      ],
      semaphors: []
    },
    title: "Initialize Optional Parameters",
    description: "Set default values for optional parameters",
    x: 500,
    y: 200,
    extra: '{"modeForm":"expand","icon":""}'
  };

  // Add optional parameters with default values
  for (const input of optionalInputs) {
    initNode.condition.logics[0].extra[input.name] = input.defaultValue || "";
    initNode.condition.logics[0].extra_type[input.name] = input.type || "string";
  }

  return initNode;
}
```

1. Use Set Parameters nodes for parameter initialization:
   ```json
   {
     "type": "set_param",
     "extra": {
       "page_size": "{{page_size || '10'}}",
       "sort_order": "{{sort_order || 'asc'}}"
     },
     "extra_type": {
       "page_size": "string",
       "sort_order": "string"
     },
     "err_node_id": "error_node_id"
   }
   ```
2. Define input parameter validation in the process definition rather than using Condition nodes:
   - Mark critical parameters as required
   - Add regex validation patterns for format validation
   - Provide clear error messages for validation failures

Reference:
[Set Parameters Node](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/nodes/set-parameters-node.md),
[Set Parameters Built-in Functions](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/nodes/set-parameters-built-in-functions.md)

### 6. Implement Built-in Functions in Set Parameters Nodes

```javascript
// Function to create a Set Parameters node with built-in functions
function createSetParamsWithBuiltInFunctions(functionExamples) {
  const node = {
    id: generateNodeId(),
    obj_type: 0,
    condition: {
      logics: [
        {
          type: "set_param",
          extra: {
            // Math operations
            calculated_value: "$.math({{base_value}}*1.2)",

            // Date functions
            current_date: "$.date(%y-%m-%d)",
            future_date: "$.date(%y-%m-%d+30-%h:%i:%s)",
            timestamp: "$.unixtime(%y-%m-%d %h:%i:%s)",

            // Random number generation
            random_number: "$.random(1, 100)",

            // Cryptographic functions
            hashed_password: "$.sha256_hex({{password}})",
            encoded_data: "$.base64_encode({{data}})",

            // Array functions
            doubled_numbers: "$.map(fun(x) -> x * 2 end, {{numbers}})",
            filtered_numbers: "$.filter(fun(x) -> x > 10 end, {{numbers}})"
          },
          extra_type: {
            calculated_value: "number",
            current_date: "string",
            future_date: "string",
            timestamp: "number",
            random_number: "number",
            hashed_password: "string",
            encoded_data: "string",
            doubled_numbers: "array",
            filtered_numbers: "array"
          },
          err_node_id: "error_node_id"
        },
        {
          type: "go",
          to_node_id: null // Will be set later
        }
      ],
      semaphors: []
    },
    title: "Process Data with Built-in Functions",
    description: "Uses built-in functions for data transformation",
    x: 500,
    y: 300,
    extra: '{"modeForm":"expand","icon":""}'
  };

  return node;
}
```

Key built-in functions for Set Parameters nodes:

1. **Mathematical Operations**:

   ```json
   "calculated_value": "$.math({{base_value}}*1.2)"
   ```

2. **Date Functions**:

   ```json
   "current_date": "$.date(%y-%m-%d)",
   "future_date": "$.date(%y-%m-%d+30-%h:%i:%s)",
   "timestamp": "$.unixtime(%y-%m-%d %h:%i:%s)"
   ```

3. **Random Number Generation**:

   ```json
   "random_number": "$.random(1, 100)"
   ```

4. **Cryptographic Functions**:

   ```json
   "hashed_password": "$.sha256_hex({{password}})",
   "encoded_data": "$.base64_encode({{data}})"
   ```

5. **Array Functions**:
   ```json
   "doubled_numbers": "$.map(fun(x) -> x * 2 end, {{numbers}})",
   "filtered_numbers": "$.filter(fun(x) -> x > 10 end, {{numbers}})"
   ```

Reference:
[Set Parameters Built-in Functions](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/nodes/set-parameters-built-in-functions.md)

### 7. Implement API Call Node with Response Customization

```javascript
// Function to create an API Call node with customized response
function createApiCallNode(apiConfig) {
  return {
    id: generateNodeId(),
    obj_type: 0,
    condition: {
      logics: [
        {
          type: "api",
          method: apiConfig.method,
          url: apiConfig.url,
          extra: apiConfig.parameters || {},
          extra_type: createParameterTypes(apiConfig.parameters),
          extra_headers: apiConfig.headers || {
            "Content-Type": "application/json"
          },
          err_node_id: generateNodeId(), // Will create error node later
          max_threads: 5,
          // Customize Response functionality
          customize_response: true,
          response: {
            // Map response fields to task parameters
            status_code: "{{header.status_code}}",
            response_data: "{{body}}",
            // Map specific fields from response body
            user_id: "{{body.user.id}}",
            account_balance: "{{body.account.balance}}"
          },
          response_type: {
            status_code: "number",
            response_data: "object",
            user_id: "string",
            account_balance: "number"
          }
        },
        {
          type: "go",
          to_node_id: null // Will be set later
        }
      ],
      semaphors: [
        // Time semaphore for timeout handling
        {
          type: "time",
          value: 30,
          dimension: "sec",
          to_node_id: "timeout_node_id" // Will be set later
        },
        // Count semaphore for rate limiting
        {
          type: "count",
          value: 100,
          esc_node_id: "rate_limit_node_id" // Will be set later
        }
      ]
    },
    title: apiConfig.title || "API Call",
    description: apiConfig.description || "",
    x: 500,
    y: 400,
    extra: '{"modeForm":"expand","icon":""}'
  };
}
```

For API Call nodes, implement these features:

1. **Customize Response** for mapping response data:

   ```json
   "customize_response": true,
   "response": {
     "status_code": "{{header.status_code}}",
     "response_data": "{{body}}",
     "user_id": "{{body.user.id}}",
     "account_balance": "{{body.account.balance}}"
   },
   "response_type": {
     "status_code": "number",
     "response_data": "object",
     "user_id": "string",
     "account_balance": "number"
   }
   ```

2. **Implement Semaphores** for timeout handling and rate limiting:

   ```json
   "semaphors": [
     {
       "type": "time",
       "value": 30,
       "dimension": "sec",
       "to_node_id": "timeout_node_id"
     },
     {
       "type": "count",
       "value": 100,
       "esc_node_id": "rate_limit_node_id"
     }
   ]
   ```

3. **Configure Headers and Content Types**:
   ```json
   "extra_headers": {
     "Content-Type": "application/json",
     "Authorization": "Bearer {{token}}"
   }
   ```

Reference:
[API Call Node](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/nodes/api-call-node.md)

### 8. Implement Call Process Node

```javascript
// Function to create a Call Process node
function createCallProcessNode(targetProcessId, parameters) {
  return {
    id: generateNodeId(),
    obj_type: 0,
    condition: {
      logics: [
        {
          type: "api_rpc", // IMPORTANT: Use "api_rpc", not "call_process"
          conv_id: targetProcessId,
          extra: parameters.extra || {},
          extra_type: parameters.extra_type || {},
          err_node_id: generateNodeId(), // Will create error node later
          group: "all"
        },
        {
          type: "go",
          to_node_id: null // Will be set later
        }
      ],
      semaphors: [
        // Time semaphore for implementing timeouts
        {
          type: "time",
          value: 60,
          dimension: "sec",
          to_node_id: "process_timeout_node_id" // Will be set later
        }
      ]
    },
    title: parameters.title || "Call Process",
    description: parameters.description || "Calls another process and waits for response",
    x: 500,
    y: 500,
    extra: '{"modeForm":"expand","icon":""}'
  };
}
```

For Call Process nodes:

1. Use `type: "api_rpc"` (not "call_process")
2. Include both `extra` and `extra_type` objects, even if empty
3. Add a time semaphore for timeout handling:
   ```json
   "semaphors": [
     {
       "type": "time",
       "value": 60,
       "dimension": "sec",
       "to_node_id": "process_timeout_node_id"
     }
   ]
   ```
4. Don't forget to include the required `err_node_id` parameter

Reference:
[Call a Process Node](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/nodes/call-process-node.md)

### 9. Implement Reply to Process Node

```javascript
// Function to create a Reply to Process node for success response
function createSuccessReplyNode(outputParams) {
  const replyNode = {
    id: generateNodeId(),
    obj_type: 0,
    condition: {
      logics: [
        {
          type: "api_rpc_reply",
          mode: "key_value",
          res_data: {
            result: "success",
            data: {}
          },
          res_data_type: {
            result: "string",
            data: "object"
          },
          throw_exception: false
        },
        {
          type: "go",
          to_node_id: null // Will be set to End node
        }
      ],
      semaphors: []
    },
    title: "Reply with Success",
    description: "Send success response with output parameters",
    x: 500,
    y: 600,
    extra: '{"modeForm":"expand","icon":""}'
  };

  // Add output parameters to the response
  for (const param of outputParams) {
    replyNode.condition.logics[0].res_data.data[param.name] = `{{${param.name}}}`;
  }

  return replyNode;
}

// Function to create an error Reply to Process node
function createErrorReplyNode() {
  return {
    id: generateNodeId(),
    obj_type: 0,
    condition: {
      logics: [
        {
          type: "api_rpc_reply",
          mode: "key_value",
          res_data: {
            result: "error",
            error_code: "{{error_code}}",
            error_message: "{{error_message}}"
          },
          res_data_type: {
            result: "string",
            error_code: "string",
            error_message: "string"
          },
          throw_exception: true
        },
        {
          type: "go",
          to_node_id: null // Will be set to Error End node
        }
      ],
      semaphors: []
    },
    title: "Reply with Error",
    description: "Send error response with error details",
    x: 800,
    y: 600,
    extra: '{"modeForm":"expand","icon":""}'
  };
}
```

For Reply to Process nodes:

1. For success responses, include all defined output parameters:

   ```json
   {
     "type": "api_rpc_reply",
     "mode": "key_value",
     "res_data": {
       "result": "success",
       "data": {
         "transaction_result": "{{transaction_result}}",
         "transaction_id": "{{transaction_id}}"
       }
     },
     "res_data_type": {
       "result": "string",
       "data": "object"
     },
     "throw_exception": false
   }
   ```

2. For error responses, include error details:

   ```json
   {
     "type": "api_rpc_reply",
     "mode": "key_value",
     "res_data": {
       "result": "error",
       "error_code": "{{error_code}}",
       "error_message": "{{error_message}}"
     },
     "res_data_type": {
       "result": "string",
       "error_code": "string",
       "error_message": "string"
     },
     "throw_exception": true
   }
   ```

3. Add every output parameter defined in the process in the response

Reference:
[Reply to Process Node](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/nodes/reply-to-process-node.md)

### 10. Implement Error Handling with Semaphores

```javascript
// Function to create an error handling condition node
function createErrorConditionNode(originNodeId) {
  return {
    id: generateNodeId(),
    obj_type: 3,
    condition: {
      logics: [
        {
          type: "go_if_const",
          conditions: [
            {
              param: "__conveyor_api_return_type_error__",
              const: "hardware",
              fun: "eq",
              cast: "string"
            }
          ],
          to_node_id: null // Will point to retry node
        },
        {
          type: "go_if_const",
          conditions: [
            {
              param: "__conveyor_api_return_code__",
              const: "429",
              fun: "eq",
              cast: "string"
            }
          ],
          to_node_id: null // Will point to rate limit handling node
        },
        {
          type: "go",
          to_node_id: null // Will point to error end node
        }
      ],
      semaphors: []
    },
    title: "Check Error Type",
    description: "Determine if error is hardware or software",
    x: 700,
    y: 400,
    extra: '{"modeForm":"expand","icon":""}'
  };
}

// Function to create a retry delay node
function createRetryNode(targetNodeId) {
  return {
    id: generateNodeId(),
    obj_type: 0,
    condition: {
      logics: [
        {
          type: "delay",
          value: 30,
          dimension: "sec",
          to_node_id: targetNodeId
        }
      ],
      semaphors: []
    },
    title: "Retry After 30s",
    description: "Wait 30 seconds before retrying",
    x: 900,
    y: 400,
    extra: '{"modeForm":"expand","icon":""}'
  };
}

// Function to create a Set Parameters node for retry counting
function createRetryCounterNode() {
  return {
    id: generateNodeId(),
    obj_type: 0,
    condition: {
      logics: [
        {
          type: "set_param",
          extra: {
            retry_count: "$.math({{retry_count || 0}}+1)"
          },
          extra_type: {
            retry_count: "number"
          },
          err_node_id: "error_node_id" // Will be set later
        },
        {
          type: "go",
          to_node_id: null // Will be set to Retry Delay node
        }
      ],
      semaphors: []
    },
    title: "Increment Retry Count",
    description: "Tracks retry attempts to prevent infinite loops",
    x: 800,
    y: 350,
    extra: '{"modeForm":"expand","icon":""}'
  };
}
```

Implement error handling with these patterns:

1. **Standard Error Handling Pattern**:

   ```
   Operation Node → Condition Node → [hardware error] → Delay Node → Retry
                                   → [software error] → Error End Node
   ```

2. **Advanced Error Handling with Semaphores**:

   - Add both time and count semaphores to critical nodes
   - Time semaphores for timeout handling
   - Count semaphores for rate limiting

3. **Exponential Backoff for Retries**:

   ```javascript
   // In Set Parameters node before retry
   "retry_delay": "$.math(Math.min(30 * Math.pow(2, {{retry_count || 0}}), 3600))"
   ```

4. **Max Retry Checking**:
   ```json
   {
     "type": "go_if_const",
     "conditions": [
       {
         "param": "retry_count",
         "const": "5",
         "fun": "more_or_eq",
         "cast": "number"
       }
     ],
     "to_node_id": "max_retries_exceeded_node_id"
   }
   ```

Reference:
[Error Handling Strategies](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/process/error-handling.md)

### 11. Connect Nodes

```javascript
// Function to connect all nodes
function connectNodes(nodes) {
  // Start by finding the Start, End, and other key nodes
  const startNode = nodes.find(node => node.obj_type === 1);
  const successEndNode = nodes.find(node => node.obj_type === 2 && node.extra.includes("success"));
  const errorEndNode = nodes.find(node => node.obj_type === 2 && node.extra.includes("error"));

  // Connect main flow
  const mainFlowNodes = nodes.filter(node => node.x === 500 && node.obj_type !== 2);
  mainFlowNodes.sort((a, b) => a.y - b.y);

  for (let i = 0; i < mainFlowNodes.length - 1; i++) {
    const currentNode = mainFlowNodes[i];
    const nextNode = mainFlowNodes[i + 1];

    // Find the "go" logic in current node and set to_node_id
    const goLogic = currentNode.condition.logics.find(logic => logic.type === "go");
    if (goLogic) {
      goLogic.to_node_id = nextNode.id;
    }
  }

  // Connect the last node in main flow to success end node
  const lastMainNode = mainFlowNodes[mainFlowNodes.length - 1];
  const lastNodeGoLogic = lastMainNode.condition.logics.find(logic => logic.type === "go");
  if (lastNodeGoLogic) {
    lastNodeGoLogic.to_node_id = successEndNode.id;
  }

  // Connect error paths
  // (Code to connect error nodes would go here)
}
```

1. Set all node IDs:
   - Each node ID must be a 24-character hexadecimal string
   - All node references (`to_node_id`, `err_node_id`) must point to valid node IDs
2. Connect the main flow:
   - Start node → Validation → Main logic → End node
3. Connect error paths:
   - Hardware errors → Retry logic → Original operation
   - Software errors → Error handling → Error End node
4. Ensure all condition nodes have a default path (type: "go")
5. Verify no disconnected nodes exist in the process

### 12. Create Process JSON

```javascript
// Function to create the complete process JSON
function createProcessJson(processInfo, nodes) {
  return {
    obj_type: 1, // 1 = Process
    obj_id: processInfo.id,
    parent_id: processInfo.folderId || 0,
    title: processInfo.title,
    description: processInfo.description || "",
    status: "active",
    params: processInfo.params || [],
    ref_mask: false,
    conv_type: "process",
    scheme: {
      nodes: nodes,
      web_settings: [[], []]
    },
    uuid: generateUuid()
  };
}
```

1. **Create a JSON object with the required structure:**
   ```json
   {
     "obj_type": 1,
     "obj_id": "process_id",
     "parent_id": "folder_id",
     "title": "Process Title v1.0",
     "description": "Process Description",
     "status": "active",
     "params": [],
     "ref_mask": false,
     "conv_type": "process",
     "scheme": {
       "nodes": [],
       "web_settings": [[], []]
     }
   }
   ```
2. Include all defined parameters in the params array
3. Add all process nodes to the scheme.nodes array
4. Generate a valid UUID-v4 for the process
5. Always include version numbers in process titles (e.g., "Process v1.0")

### 13. Create Folder Structure

```javascript
// Function to create folder JSON
function createFolderJson(folderInfo) {
  return {
    obj_type: 0, // 0 = Folder
    obj_id: folderInfo.id,
    parent_id: folderInfo.parentId || 0, // 0 means root level, otherwise parent folder's ID
    title: folderInfo.title,
    description: folderInfo.description || ""
  };
}

// Function to create process JSON with proper parent_id
function createProcessJson(processInfo, nodes) {
  return {
    obj_type: 1, // 1 = Process
    obj_id: processInfo.id,
    parent_id: processInfo.folderId, // ID of the parent folder containing this process
    title: processInfo.title,
    description: processInfo.description || "",
    status: "active",
    params: processInfo.params || [],
    ref_mask: false,
    conv_type: "process",
    scheme: {
      nodes: nodes,
      web_settings: [[], []]
    }
  };
}
```

1. **Create folder JSON files for organizing processes:**
   ```json
   {
     "obj_type": 0,
     "obj_id": "folder_id",
     "parent_id": "parent_folder_id", // 0 for root level folders
     "title": "Folder Title",
     "description": "Folder Description"
   }
   ```
2. When creating process JSON, set the `parent_id` to the ID of the folder containing the process:
   ```json
   {
     "obj_type": 1,
     "obj_id": "process_id",
     "parent_id": "folder_id", // ID of the parent folder
     "title": "Process Title v1.0"
     // other process properties...
   }
   ```
3. Organize related processes in the same folder by using the same parent_id
4. Use hierarchy for complex systems:
   - Root folders have parent_id = 0
   - Sub-folders have parent_id pointing to their parent folder's ID
   - Processes have parent_id pointing to their containing folder's ID

### 14. Package into ZIP Archive

```javascript
// Function to create ZIP archive structure
function createZipStructure(folderId, folderTitle, processes) {
  const timestamp = Date.now();
  const folderDirName = `${folderId}_${folderTitle.replace(/\s/g, "_")}.folder`;
  const zipFileName = `folder_${folderId}_${timestamp}.zip`;

  const zipStructure = {
    name: zipFileName,
    entries: [
      {
        name: folderDirName,
        entries: [
          {
            name: `${folderDirName}.json`,
            content: JSON.stringify(
              createFolderJson({
                id: folderId,
                title: folderTitle
              })
            )
          }
        ]
      }
    ]
  };

  // Add process files
  for (const process of processes) {
    const processFileName = `${process.obj_id}_${process.title.replace(/\s/g, "_")}_v${process.version}.conv.json`;

    zipStructure.entries[0].entries.push({
      name: processFileName,
      content: JSON.stringify(process)
    });
  }

  return zipStructure;
}
```

1. Follow the ZIP format standard:
   ```
   folder_{folder_id}_{timestamp}.zip/
   └── {folder_id}_{folder_title}.folder/
       ├── {folder_id}_{folder_title}.folder.json
       ├── {process_id}_{process_title}_v{version}.conv.json
       └── ...
   ```
2. Use the naming conventions:
   - Folder directory: `{folder_id}_{folder_title}.folder/`
   - Folder JSON: `{folder_id}_{folder_title}.folder.json`
   - Process JSON: `{process_id}_{process_title}_v{version}.conv.json`
3. Ensure all file names use underscores instead of spaces
4. Include version numbers in process titles
5. Generate a unique timestamp for the ZIP file name

Reference:
[ZIP Format](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/folders/zip-format.md)

### 15. Validate Process JSON

```javascript
// Function to validate process JSON
function validateProcessJson(processJson) {
  const errors = [];

  // Validate required fields
  if (!processJson.obj_type || processJson.obj_type !== 1) {
    errors.push("Process obj_type must be 1");
  }

  if (!processJson.obj_id) {
    errors.push("Process obj_id is required");
  }

  // Validate nodes
  if (
    !processJson.scheme ||
    !processJson.scheme.nodes ||
    !Array.isArray(processJson.scheme.nodes)
  ) {
    errors.push("Process must have a scheme with nodes array");
    return errors;
  }

  // Check for Start node
  const startNodes = processJson.scheme.nodes.filter(node => node.obj_type === 1);
  if (startNodes.length !== 1) {
    errors.push(`Process must have exactly one Start node (found ${startNodes.length})`);
  }

  // Validate each node
  for (const node of processJson.scheme.nodes) {
    const nodeErrors = validateNode(node);
    errors.push(...nodeErrors);
  }

  // Validate node connectivity
  const connectivityErrors = validateNodeConnectivity(processJson.scheme.nodes);
  errors.push(...connectivityErrors);

  return errors;
}

// Function to validate a node
function validateNode(node) {
  const errors = [];

  // Validate required fields
  if (!node.id || !isValidNodeId(node.id)) {
    errors.push(
      `Node ${node.title || "untitled"} has invalid id (must be 24-character hex string)`
    );
  }

  // Validate node references
  if (node.condition && node.condition.logics) {
    for (const logic of node.condition.logics) {
      if (logic.to_node_id && !isValidNodeId(logic.to_node_id)) {
        errors.push(`Node ${node.title || "untitled"} has invalid to_node_id reference`);
      }

      if (logic.err_node_id && !isValidNodeId(logic.err_node_id)) {
        errors.push(`Node ${node.title || "untitled"} has invalid err_node_id reference`);
      }

      // Validate extra/extra_type parity for nodes that require it
      if (["set_param", "api", "api_rpc"].includes(logic.type)) {
        if (!validateExtraAndExtraType(logic.extra, logic.extra_type)) {
          errors.push(`Node ${node.title || "untitled"} has mismatched extra and extra_type`);
        }
      }

      // Validate Call Process node uses correct type
      if (logic.conv_id && logic.type !== "api_rpc") {
        errors.push(
          `Node ${node.title || "untitled"} is a Call Process node but uses incorrect type (should be api_rpc)`
        );
      }
    }
  }

  // Validate semaphors
  if (node.condition && node.condition.semaphors) {
    for (const semaphor of node.condition.semaphors) {
      if (
        semaphor.type === "time" &&
        (!semaphor.to_node_id || !isValidNodeId(semaphor.to_node_id))
      ) {
        errors.push(`Node ${node.title || "untitled"} has time semaphore with invalid to_node_id`);
      }
      if (
        semaphor.type === "count" &&
        (!semaphor.esc_node_id || !isValidNodeId(semaphor.esc_node_id))
      ) {
        errors.push(
          `Node ${node.title || "untitled"} has count semaphore with invalid esc_node_id`
        );
      }
    }
  }

  return errors;
}

// Function to validate extra/extra_type parity
function validateExtraAndExtraType(extra, extra_type) {
  if (!extra || !extra_type) {
    return false;
  }

  // Check that all keys in extra exist in extra_type
  for (const key in extra) {
    if (!extra_type.hasOwnProperty(key)) {
      return false;
    }
  }

  // Check that all keys in extra_type exist in extra
  for (const key in extra_type) {
    if (!extra.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}

// Function to validate node ID format
function isValidNodeId(id) {
  // Node ID must be a 24-character hexadecimal string
  return /^[0-9a-f]{24}$/.test(id);
}

// Function to validate node connectivity
function validateNodeConnectivity(nodes) {
  const errors = [];
  const nodeIds = nodes.map(node => node.id);

  // Check for disconnected nodes
  for (const node of nodes) {
    // Skip Start and End nodes
    if (node.obj_type === 1 || node.obj_type === 2) {
      continue;
    }

    // Check if node has outgoing connections
    if (!hasOutgoingConnections(node, nodeIds)) {
      errors.push(`Node ${node.title || node.id} has no outgoing connections`);
    }

    // Check if node has incoming connections
    if (!hasIncomingConnections(node, nodes)) {
      errors.push(`Node ${node.title || node.id} has no incoming connections`);
    }
  }

  return errors;
}

// Function to check if a node has outgoing connections
function hasOutgoingConnections(node, validNodeIds) {
  if (!node.condition || !node.condition.logics) {
    return false;
  }

  // Check for "go" or "go_if_const" logics with valid to_node_id
  return node.condition.logics.some(
    logic =>
      (logic.type === "go" || logic.type === "go_if_const") &&
      logic.to_node_id &&
      validNodeIds.includes(logic.to_node_id)
  );
}

// Function to check if a node has incoming connections
function hasIncomingConnections(node, allNodes) {
  // Check if any node has a connection to this node
  return allNodes.some(otherNode => {
    if (!otherNode.condition || !otherNode.condition.logics) {
      return false;
    }

    return otherNode.condition.logics.some(
      logic => (logic.type === "go" || logic.type === "go_if_const") && logic.to_node_id === node.id
    );
  });
}
```

1. Run these validations on the JSON before packaging:
   - All required fields must be present
   - All node IDs must be 24-character hexadecimal strings
   - All node references must point to existing nodes
   - The process must have exactly one Start node
   - All required parameters for nodes must be present
   - Error node references must be valid
2. Check that Call Process nodes use the correct type (api_rpc)
3. Verify all extra/extra_type pairs match (all keys in one must exist in the other)
4. For nodes using semaphores, validate semaphore target node references
5. Check for node connectivity issues (disconnected nodes)
6. Ensure that all API Call, Set Parameters, and Code nodes have error handling configured
7. Validate that dynamic values in parameters use the correct format: `{{parameter_name}}`

Reference:
[Process JSON Validation](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/process/process-json-validation.md)

## Example Process JSON Structure

```json
{
  "obj_type": 1,
  "obj_id": 1646022,
  "parent_id": 612594,
  "title": "Calculator v2.0",
  "description": "Simple calculator process",
  "status": "active",
  "params": [
    {
      "name": "num1",
      "type": "number",
      "descr": "First number",
      "flags": ["required", "input"],
      "regex": "",
      "regex_error_text": ""
    },
    {
      "name": "num2",
      "type": "number",
      "descr": "Second number",
      "flags": ["required", "input"],
      "regex": "",
      "regex_error_text": ""
    },
    {
      "name": "operation",
      "type": "string",
      "descr": "Operation to perform (+, -, *, /)",
      "flags": ["required", "input"],
      "regex": "^[\\+\\-\\*\\/]$",
      "regex_error_text": "Operation must be +, -, *, or /"
    },
    {
      "name": "result",
      "type": "number",
      "descr": "Calculation result",
      "flags": ["output"],
      "regex": "",
      "regex_error_text": ""
    }
  ],
  "ref_mask": false,
  "conv_type": "process",
  "scheme": {
    "nodes": [
      {
        "id": "61d55218513aa04bc969791a",
        "obj_type": 1,
        "condition": {
          "logics": [
            {
              "type": "go",
              "to_node_id": "61d55237513aa04bc9697cb1"
            }
          ],
          "semaphors": []
        },
        "title": "Start",
        "description": "Process entry point",
        "x": 600,
        "y": 100,
        "uuid": "90505848-b55a-4813-a5cf-45b05b95ef14",
        "extra": "{\"modeForm\":\"collapse\",\"icon\":\"\"}",
        "options": null
      },
      {
        "id": "61d55237513aa04bc9697cb1",
        "obj_type": 0,
        "condition": {
          "logics": [
            {
              "type": "api_code",
              "lang": "js",
              "src": "try {\n  const num1 = parseFloat(data.num1);\n  const num2 = parseFloat(data.num2);\n  let result;\n  \n  switch(data.operation) {\n    case '+':\n      result = num1 + num2;\n      break;\n    case '-':\n      result = num1 - num2;\n      break;\n    case '*':\n      result = num1 * num2;\n      break;\n    case '/':\n      if (num2 === 0) {\n        throw new Error('Division by zero');\n      }\n      result = num1 / num2;\n      break;\n    default:\n      throw new Error('Invalid operation');\n  }\n  \n  data.result = result;\n  return data;\n} catch (e) {\n  data.error = e.message;\n  return data;\n}",
              "err_node_id": "61d552e8513aa04bc9699371"
            },
            {
              "type": "go",
              "to_node_id": "61d55218513aa04bc969791b"
            }
          ],
          "semaphors": []
        },
        "title": "Calculate Result",
        "description": "Performs the calculation based on input parameters",
        "x": 500,
        "y": 300,
        "uuid": "dd79bab9-e72a-44cc-bd7c-f0c90570959f",
        "extra": "{\"modeForm\":\"expand\",\"icon\":\"\"}",
        "options": null
      },
      {
        "id": "61d55218513aa04bc969791b",
        "obj_type": 0,
        "condition": {
          "logics": [
            {
              "type": "api_rpc_reply",
              "mode": "key_value",
              "res_data": {
                "result": "success",
                "data": {
                  "result": "{{result}}"
                }
              },
              "res_data_type": {
                "result": "string",
                "data": "object"
              },
              "throw_exception": false
            }
          ],
          "semaphors": []
        },
        "title": "Reply with Result",
        "description": "Send result back to caller",
        "x": 500,
        "y": 500,
        "uuid": "90505848-b55a-4813-a5cf-45b05b95ef15",
        "extra": "{\"modeForm\":\"expand\",\"icon\":\"\"}",
        "options": null
      },
      {
        "id": "61d552cb513aa04bc9698e3d",
        "obj_type": 2,
        "condition": {
          "logics": [],
          "semaphors": []
        },
        "title": "Success",
        "description": "Process completed successfully",
        "x": 600,
        "y": 700,
        "uuid": "ae05e9cb-d1a1-494a-8a16-cfc9cd1efbcd",
        "extra": "{\"modeForm\":\"collapse\",\"icon\":\"success\"}",
        "options": "{\"save_task\":true}"
      },
      {
        "id": "61d552e8513aa04bc9699371",
        "obj_type": 0,
        "condition": {
          "logics": [
            {
              "type": "api_rpc_reply",
              "mode": "key_value",
              "res_data": {
                "result": "error",
                "error_message": "{{error}}"
              },
              "res_data_type": {
                "result": "string",
                "error_message": "string"
              },
              "throw_exception": true
            }
          ],
          "semaphors": []
        },
        "title": "Reply with Error",
        "description": "Send error message back to caller",
        "x": 800,
        "y": 500,
        "uuid": "a9c19d66-1c3f-4197-9b3d-1d98425550f0",
        "extra": "{\"modeForm\":\"expand\",\"icon\":\"\"}",
        "options": null
      },
      {
        "id": "61d552cb513aa04bc9698e3e",
        "obj_type": 2,
        "condition": {
          "logics": [],
          "semaphors": []
        },
        "title": "Error",
        "description": "Process completed with error",
        "x": 900,
        "y": 700,
        "uuid": "ae05e9cb-d1a1-494a-8a16-cfc9cd1efbce",
        "extra": "{\"modeForm\":\"collapse\",\"icon\":\"error\"}",
        "options": "{\"save_task\":true,\"error_status\":true}"
      }
    ],
    "web_settings": [[], []]
  },
  "uuid": "62f4026c-bdf9-4303-b7f7-924190f30dcd"
}
```

## Example ZIP Structure

```
folder_612594_1744388449151.zip/
└── 612594_Calculator_v2.0.folder/
    ├── 612594_Calculator_v2.0.folder.json
    ├── 1646022_Calculator_Main_Process_v2.0.conv.json
    ├── 1646023_Addition_Process_v2.0.conv.json
    ├── 1646024_Subtraction_Process_v2.0.conv.json
    ├── 1646025_Multiplication_Process_v2.0.conv.json
    └── 1646026_Division_Process_v2.0.conv.json
```

## Common Pitfalls

- **Invalid node IDs**: All node IDs must be exactly 24 characters hexadecimal
- **Missing error nodes**: Every operation node must have an error node
- **Extra/extra_type mismatch**: Keys must match exactly between these objects
- **Missing input parameter definitions**: Define all required parameters in the process params
  array
- **Missing output parameter definitions**: Define all output parameters that will be returned
- **Reply node not matching output parameters**: Ensure Reply to Process nodes include all defined
  output parameters
- **Incorrect node types**: Use proper obj_type values (1=Start, 2=End)
- **Disconnected nodes**: Ensure all nodes are connected in the flow
- **Missing "go" logic**: Condition nodes need default paths
- **Incorrect start/end node positioning**: Remember to add 100px to X-coordinate for center pivot
  point
- **Call Process node type**: Use "api_rpc" not "call_process"
- **Missing semaphores**: Consider adding time and count semaphores for better flow control
- **Not using built-in functions**: Using Code nodes for operations that could be handled by
  built-in functions

Reference:
[Common Validation Errors](https://git.corezoid.com/documentation/corezoid-doc/-/blob/main/src/process/common-validation-errors.md)
