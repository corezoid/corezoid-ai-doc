# Nodes in Corezoid

## Overview

**Nodes** are the fundamental building blocks of Corezoid processes. Each node type serves a
specific purpose in the workflow, from receiving data to making decisions, calling external
services, or terminating the process. Nodes are connected to form a coherent process flow that
defines how tasks are processed from start to finish.

## Structure and Components

### Core Components

1. **Node Configuration**

   - Each node has a unique ID and type identifier
   - Nodes contain parameters specific to their function
   - Nodes include position coordinates for visual representation

2. **Node Connections**
   - Nodes are connected through condition logic
   - Each node can have one or more outgoing paths
   - Paths can be conditional or unconditional

### Node Schema

A typical Node JSON structure:

```json
{
  "id": "node_id",
  "obj_type": 0,
  "condition": {
    "logics": [
      {
        "type": "go",
        "to_node_id": "next_node_id"
      }
    ],
    "semaphors": []
  },
  "title": "Node Title",
  "description": "Node Description",
  "x": 500,
  "y": 300,
  "options": {},
  "extra": "{}"
}
```

## Node Types

Corezoid offers various node types, each designed for specific operations:

### Flow Control Nodes

1. [Start Node](start-node.md) - Receives tasks into a Process
2. [End Node](end-node.md) - Terminates the processing flow and collects tasks
3. [Condition Node](condition-node.md) - Evaluates parameter-based conditions to branch tasks
4. [Delay Node](delay-node.md) - Holds tasks for a specified time period

### Data Manipulation Nodes

5. [Set Parameters Node](set-parameters-node.md) - Creates or updates key-value pairs in the task
6. [Set Parameters Built-in Functions](set-parameters-built-in-functions.md) - Functions available
   in Set Parameters nodes
7. [Code Node](code-node.md) - Runs custom user code to transform or compute data

### Integration Nodes

7. [Git Call Node](git-call-node.md) - Pulls and executes code from a Git repository
8. [API Call Node](api-call-node.md) - Sends HTTP requests to external endpoints
9. [Database Call Node](database-call-node.md) - Executes SQL statements on an external database

### Task Management Nodes

10. [Queue Node](queue-node.md) - Creates a queue of tasks for asynchronous handling
11. [Get from Queue Node](get-from-queue-node.md) - Retrieves tasks from a Queue node
12. [Copy Task Node](copy-task-node.md) - Duplicates tasks to another Process
13. [Modify Task Node](modify-task-node.md) - Updates an existing task in another Process

### Process Interaction Nodes

14. [Call a Process Node](call-process-node.md) - Invokes another Process with the current task
15. [Reply to Process Node](reply-to-process-node.md) - Sends a response to a Call a Process node

### Specialized Nodes

16. [Set State Node](set-state-node.md) - Updates or assigns a state for the current task
17. [Waiting for Callback Node](waiting-for-callback-node.md) - Halts the task flow until an
    external HTTP request
18. [Sum Node](sum-node.md) - Aggregates numeric values from incoming tasks

## Node Patterns and Examples

Each node type documentation now includes:

- Complete JSON implementation examples
- Common usage patterns
- Best practices specific to that node type
- Escalation node patterns that are automatically generated when adding nodes from the editor

This integrated approach makes it easier to understand how to properly configure and use each node
type without having to reference multiple documentation files.

## Node Lifecycle

1. **Creation**: Node is added to a process with basic configuration
2. **Configuration**: Node parameters are set according to its function
3. **Connection**: Node is connected to other nodes in the process
4. **Execution**: Node processes tasks as they arrive
5. **Routing**: Node routes tasks to the next node(s) based on logic

## Common Node Properties

All nodes share certain properties:

1. **id** (String)

   - Unique identifier for the node within the process
   - Example: `"node_id"`

2. **obj_type** (Number)

   - Numeric identifier for the node type
   - Examples: `1` (Start), `2` (End), `0` (Condition)

3. **condition** (Object)

   - Contains routing logic for the node
   - Includes "logics" array with routing rules
   - Example: `{"logics": [{"type": "go", "to_node_id": "next_node_id"}]}`

4. **title** (String)

   - Display name for the node
   - Example: `"API Call to Payment Gateway"`

5. **description** (String)

   - Optional description of the node's purpose
   - Example: `"Sends payment data to the payment processor"`

6. **x, y** (Number)

   - Coordinates for visual positioning in the process editor
   - Example: `"x": 500, "y": 300`

7. **options** (Object)

   - Additional configuration options
   - Example: `{"save_task": true}`

8. **extra** (String)
   - JSON string with UI settings and additional parameters
   - Example: `"{\"modeForm\":\"collapse\",\"icon\":\"success\"}"`

## Error Handling

Each node type has specific error handling mechanisms:

1. **Error Routing**

   - Many nodes include an `err_node_id` parameter to specify where to route tasks on error
   - Error nodes are typically positioned to the right of the main process flow

2. **Error Types**

   - Nodes generate specific error parameters that can be evaluated by Condition nodes
   - Common error parameters include `__conveyor_api_return_type_error__`,
     `__conveyor_code_return_type_error__`

3. **Error Handling Patterns**
   - Hardware errors often use retry mechanisms with Delay nodes
   - Software errors typically route to dedicated error End nodes
   - Validation errors should be handled early in the process flow

## Best Practices

- Use descriptive node titles that indicate their function
- Position error handling nodes to the right of the main process flow
- Implement comprehensive error handling for each node
- Document the purpose of each node in its description
- Use consistent naming conventions for nodes
- Test node configurations thoroughly before deployment
- Monitor node performance and error rates
- Consider breaking complex node logic into multiple simpler nodes
- **Always check processes against the JSON schema** before finalizing implementation
  - This ensures all nodes meet validation requirements
  - Validates node configurations and parameter definitions
  - Prevents upload errors when deploying processes

### Node Configuration Settings

#### Common Settings in "Other" Tab

Most node types include the following settings in their "Other" tab:

1. **Semaphors** - Available in all node types

   - Allow setting time-based or resource-based conditions for node execution
   - Can be used to implement timeouts, rate limiting, scheduled execution, or resource management

   ### Types of Semaphores

   Corezoid supports two types of semaphores:

   #### Time Semaphores

   Time semaphores (`"type": "time"`) are used to implement timeouts and scheduled execution. They
   route tasks to a specified node after a defined time period. Time semaphores are particularly
   useful in:

   - **Call Process Nodes**: Prevent indefinitely waiting for responses
   - **API Call Nodes**: Implement timeouts for external API requests
   - **Waiting for Callback Nodes**: Set maximum wait times for callbacks
   - **Delay Nodes**: Create time delays (alternative to the `delay` logic type)
   - **Code Nodes**: Set execution time limits for custom code
   - **Database Call Nodes**: Set query timeout limits

   Example time semaphore configuration:

   ```json
   "semaphors": [
     {
       "type": "time",
       "value": 30,
       "dimension": "sec",
       "to_node_id": "timeout_node_id"
     }
   ]
   ```

   #### Count Semaphores

   Count semaphores (`"type": "count"`) are used to implement resource limits and concurrency
   control. They route tasks to an escalation node when a count threshold is reached. Count
   semaphores are particularly useful in:

   - **API Call Nodes**: Implement rate limiting for external API requests
   - **Database Call Nodes**: Control concurrent database connections
   - **Call Process Nodes**: Limit concurrent process calls
   - **Code Nodes**: Limit concurrent code executions

   Example count semaphore configuration:

   ```json
   "semaphors": [
     {
       "type": "count",
       "value": 100,
       "esc_node_id": "rate_limit_node_id"
     }
   ]
   ```

   ### Semaphore Parameters

   #### Time Semaphore Parameters

   - **type** (String): Must be set to "time"
   - **value** (Number): The duration for the semaphore
   - **dimension** (String): Time unit with possible values:
     - `"sec"` - seconds
     - `"min"` - minutes
     - `"hour"` - hours
     - `"day"` - days
   - **to_node_id** (String): Node to route to when the time condition is met

   #### Count Semaphore Parameters

   - **type** (String): Must be set to "count"
   - **value** (Number or String): The threshold count for the semaphore
   - **esc_node_id** (String): Escalation node to route to when the count threshold is reached

#### API Call Node Additional Settings

The API Call node has extensive additional settings in its "Other" tab:

1. **Header Parameters** - Allows adding custom HTTP headers to the request

   - Example: `Authorization`, `Accept`, `User-Agent`

2. **Response Customization** - Configure how API responses are processed

   - Response Format: Default (uses Content-Type header), application/json,
     application/x-www-form-urlencoded, application/xml, text/xml, application/soap+xml
   - Response Mapping: Maps response data to task parameters

3. **Request Limits** - Control concurrent API requests

   - Max Threads: Limits the number of simultaneous requests to the API (default: unlimited)

4. **System Parameters** - Add Corezoid system parameters to the request

   - Adds tracking and debugging information to requests
   - Required for request signing

5. **Request Signing** - Security options for API requests

   - Sign with Secret Key: Adds a signature using a provided secret key
   - Sign with Certificate: Signs the request using a PEM certificate

6. **Response Formatting** - Additional response handling options
   - RFC Standard Response: Formats the response according to RFC standards
   - Include Debug Info: Adds debugging information to the response

### Node Naming Guidelines

When creating nodes in your processes:

1. **Node Titles** should:

   - Clearly indicate the specific operation being performed (e.g., "Calculate Total Price" rather
     than just "Code")
   - Reflect the purpose of the node in the context of your process
   - Be concise but descriptive enough to understand at a glance

2. **Node Descriptions** should:
   - Explain what data is being processed
   - Mention any important input and output parameters
   - Document any specific error handling considerations
   - Include information about what happens after the node completes

Good naming practices make processes more maintainable, easier to troubleshoot, and more accessible
to other team members. Each node type documentation includes specific examples of good and poor
naming practices.

## Examples

For JSON examples of different node types, see [Node Examples](examples/node-examples.md).

## Related Documentation

- [Process Overview](../process/README.md) - Information about process structure and flow
- [Tasks Overview](../tasks/README.md) - Information about task structure and handling
