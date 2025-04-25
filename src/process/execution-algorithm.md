# Process Execution Algorithm

This document describes how processes are executed in the Corezoid system, based on the
implementation in the conveyor repositories.

## Task Flow Execution

When a task enters a Corezoid process, it follows this execution algorithm:

1. **Task Entry**:
   - Task is validated for size constraints (maximum 128KB by default)
   - Task data is checked against input parameter definitions
   - Required parameters are verified
   - Regex validation is applied if specified
2. **Node Execution**:
   - Task proceeds from Start node following the defined node connections
   - Each node processes the task according to its type-specific logic
   - System parameters are added to the task data to track execution state
3. **Error Handling**:
   - If a hardware error occurs (e.g., network timeouts, service unavailability), the task is routed
     to the error node with `__conveyor_api_return_type_error__: "hardware"`
   - If a software error occurs (e.g., invalid input, business logic errors), the task is routed to
     the error node with `__conveyor_api_return_type_error__: "software"`
   - For nodes with retry capabilities, hardware errors may trigger automatic retries with
     exponential backoff
4. **Task Completion**:
   - Task terminates when it reaches an End node
   - If the process has output parameters defined, they are collected from the task data
   - Final task state is recorded for reference and monitoring

## Code Node Execution

The Code node executes JavaScript or Erlang code within a boxed environment:

1. **Execution Environment**:
   - JavaScript code runs in a standalone v8 engine (version v8.1.97)
   - No web-interface or DOM access is available
   - Code execution is time-limited to prevent infinite loops
2. **Data Interaction**:
   - Task data is exposed via an artificial "data" object
   - Reading from this object retrieves task parameters
   - Writing to this object modifies the task that will be passed to subsequent nodes
   - No direct filesystem or network access is provided
3. **Error Handling**:
   - Syntax errors are caught during process validation
   - Runtime errors cause the task to be routed to the node specified in `err_node_id`
   - Logging is only available by writing to the data object (e.g., `data._.push("log message")`)

## Condition Node Execution

Condition nodes evaluate the task data and route it based on the results:

1. **Condition Evaluation**:
   - Conditions are evaluated in the order they appear in the `logics` array
   - The first matching condition determines the routing path
   - Conditions combine parameter name, comparison function, and constant value
2. **Available Functions**:
   - `eq`: Equal to
   - `not_eq`: Not equal to
   - `less`: Less than
   - `more`: Greater than
   - `less_or_eq`: Less than or equal to
   - `more_or_eq`: Greater than or equal to
   - `regexp`: Regular expression match
3. **Default Path**:
   - If no conditions match, the task follows the default path (type: "go")
   - If no default path is provided, the task may become stuck
4. **Data Type Handling**:
   - The `cast` parameter determines how values are compared (string, number, boolean)
   - Type conversions follow JavaScript/Erlang conventions

## Call Process Node Execution

When a Call Process node is executed:

1. **Process Invocation**:
   - Target process is identified by the `conv_id` parameter
   - Input parameters are passed from the `extra` field
   - Data types are validated according to `extra_type`
2. **Execution Modes**:
   - With `wait_for_reply: true`, the calling process waits for the called process to complete
   - With `wait_for_reply: false`, the calling process continues execution immediately
3. **Response Handling**:
   - If the called process returns a result via Reply to Process node, it's merged into the calling
     task
   - If the called process throws an exception, the task is routed to the error node
   - System parameters record the call history for debugging

## API Call Node Execution

API Call nodes execute HTTP requests with the following algorithm:

1. **Request Preparation**:
   - URL, method, and headers are prepared from node configuration and task data
   - Request body is formatted according to the specified format (JSON, XML, etc.)
   - Authentication is applied if specified
2. **Error Classification**:
   - **Hardware Errors**: Connection failures, timeouts, DNS issues
   - **Software Errors**: Non-2xx HTTP responses, validation errors, unauthorized access
3. **Response Processing**:
   - Response body is parsed according to the specified format
   - Parsed data is added to the task
   - Specific parts of the response can be mapped to task parameters

For comprehensive validation rules and examples, see the
[Process JSON Validation](process-json-validation.md) document.
