# Set Parameters Node

## Purpose

- Creates or updates key-value pairs in the task data.
- Allows for data transformation, enrichment, or preparation for subsequent nodes.
- Enables structured data manipulation without custom code.

## Parameters

### Required

1. **Parameter Definitions** (Object)
   - Key-value pairs to add or update in the task.
   - Keys are parameter names, values are the new values to set.
   - Example: `"extra": {"status": "processed", "timestamp": "{{__now}}"}`
2. **Parameter Types** (Object)
   - Specifies data types for parameters (string, number, boolean, object, array).
   - Example: `"extra_type": {"status": "string", "timestamp": "string"}`
   - This parameter is required and directly linked to the content of the extra parameter.
   - Each key in extra should have a corresponding type definition in extra_type.
3. **Error Node ID** (String)
   - Specifies which node to route to if parameter setting fails.
   - Example: `"err_node_id": "error_node_id"`
   - This parameter is required for all Set Parameters nodes to ensure proper error handling.
4. **Conditional Setting** (Boolean)
   - Only set parameters if they don't already exist.

## Error Handling

- While Set Parameters nodes generally have fewer error scenarios than other node types, they can
  still fail in certain situations:
  - Type conversion errors may occur if parameter types are specified incorrectly
  - Large parameter values might be truncated based on system limits
  - Invalid variable references (using `{{variable}}` syntax) can cause errors
  - JSON parsing errors when setting complex objects
- When an error occurs, the task is routed to the specified error node
- Set Parameters nodes should always include an `err_node_id` parameter to handle potential failures
- For critical parameter setting operations, consider implementing:
  - Validation of input parameters before setting
  - Error handling nodes for parameter setting failures
  - Fallback values for important parameters

## Built-in Functions

Set Parameters nodes support several built-in functions that can be used to perform operations
directly within parameter values:

- **Mathematical Operations**: `$.math()` - Perform calculations on numeric values
- **Random Number Generation**: `$.random()` - Generate random numbers
- **Date and Time Functions**: `$.date()` - Format current date and time
- **Cryptographic Functions**: `$.md5_hex()`, `$.sha256_hex()` - Generate hashes

### Count Function

The `Count` function returns the amount of tasks in a node with the specified ID. This is
particularly useful for implementing custom logic based on node task counts, monitoring process
load, or making decisions based on current system state.

Examples:

```
// Node ID = 561a272782ba961374d44178
{{node[561a272782ba961374d44178].count}}

// Returns amount of tasks in the node specified by the parameter {{node_id}}
{{node[{{node_id}}].count}}

// Returns amount of tasks in the node specified by the parameter {{node_id}} from {{conv_id}} process
{{conv[{{conv_id}}].node[{{node_id}}].count}}
```

### Sum Function

The `Sum` function returns the sum value for the selected task parameter. This is useful for
aggregating numeric values across tasks.

Examples:

```
// Node ID = 561a272782ba961374d44178
{{node[561a272782ba961374d44178].SumID}}

// Returns amount by SumID parameter from node {{node_id}}
{{node[{{node_id}}].SumID}}

// Returns amount by SumID parameter from {{node_id}} from {{conv_id}} process
{{conv[{{conv_id}}].node[{{node_id}}].SumID}}
```

For detailed documentation of all built-in functions, see
[Set Parameters Built-in Functions](set-parameters-built-in-functions.md).

## Using Semaphores in Set Parameters Nodes

Set Parameters nodes support both time and count semaphores to implement timeouts and concurrency
control:

### Time Semaphores

Time semaphores can be used to implement timeouts for parameter setting operations. If the operation
doesn't complete within the specified time, the task is routed to a timeout node:

```json
"semaphors": [
  {
    "type": "time",
    "value": 10,
    "dimension": "sec",
    "to_node_id": "param_timeout_node_id"
  }
]
```

The `dimension` parameter can have the following values:

- `"sec"` - seconds
- `"min"` - minutes
- `"hour"` - hours
- `"day"` - days

This provides a mechanism for handling parameter setting operations that might take longer than
expected, especially when working with complex transformations or large data structures.

### Count Semaphores

Count semaphores can be used to implement concurrency control for parameter setting operations. If
the number of concurrent operations reaches the threshold, new tasks are routed to an escalation
node:

```json
"semaphors": [
  {
    "type": "count",
    "value": 100,
    "esc_node_id": "param_limit_node_id"
  }
]
```

This can be used to prevent system overload when setting parameters that involve complex
calculations or transformations.

## Best Practices

- Use consistent naming conventions for parameters
- Specify parameter types explicitly to avoid type conversion issues
- Group related parameters in a single Set Parameters node
- Avoid using null values at the first level of the "data" structure
- Use empty strings instead of null for top-level fields
- Null values can be used in nested structures within the data object
- Use descriptive node titles that indicate what parameters are being set
- **Always include an error node ID** for all Set Parameters nodes
  - This is a validation requirement for process upload
  - Use `"err_node_id": "error_node_id"` to specify the error handling node
- Position error handling nodes to the right of the Set Parameters node
- Use double curly braces syntax for variable references: `{{variable_name}}`
- **Access parameters directly** rather than through the data object
  - Use `{{result}}` instead of `{{data.result}}` to access parameters
  - Using `{{data.result}}` will cause validation errors
- **Avoid using more than one dynamic element at root level** in parameter keys
  - Instead of `"test_results.tests[{{test_results.tests.length}}]"`, use
    `"test_results.tests": "{{JSON.stringify(test_results.tests.concat([{...}]))}}"`
  - This limitation prevents errors when setting dynamic array elements
- **Always properly stringify object values with escaped quotes**
  - Object values must be JSON strings with properly escaped quotes
  - Example: `"object_param": "{\"key\":\"value\",\"nested\":{\"key2\":\"value2\"}}"`
  - This ensures proper JSON formatting and prevents validation errors
- Consider validating parameters before setting them

## Configuration Example

This example demonstrates a Set Parameters Node configuration extracted from a real process. It
shows how to set a new parameter (`b`) based on the value of an existing parameter (`a`).

```json
{
  "id": "set_param_example", // Unique node ID (example uses "62a9827a82ba966e74498b81")
  "obj_type": 0, // Object type for Logic node
  "condition": {
    "logics": [
      {
        "type": "set_param", // Specifies this is a Set Parameters logic block
        "extra": {
          // Parameters to set or update
          "b": "{{a}}" // Sets parameter 'b' to the current value of parameter 'a'
        },
        "extra_type": {
          // Specifies the data type for the set parameter
          "b": "string" // Defines 'b' as a string type
        },
        "err_node_id": "error_node_id" // ID for error handling (example uses "62a9827a82ba966e74498b82")
      },
      {
        "type": "go", // Logic block for the path after parameters are set
        "to_node_id": "next_node_in_flow" // ID of the next node (example uses "62a9823b82ba966e74498845")
      }
    ],
    "semaphors": [] // Optional semaphores for implementing timeouts or concurrency control
  },
  "title": "Set Parameter B from A", // Descriptive title (example node had empty title)
  "description": "Sets the task parameter 'b' to the value of parameter 'a'.", // Optional description
  "x": 716, // X coordinate on canvas
  "y": 444, // Y coordinate on canvas
  "extra": "{\"modeForm\":\"expand\",\"icon\":\"\"}", // UI settings
  "options": null // No specific options set
}
```

**Explanation:**

- **`type: "set_param"`**: Identifies the node's function.
- **`extra` / `extra_type`**: Define the parameters to be set and their data types. Here, parameter
  `b` is created (or updated) with the value dynamically taken from parameter `a` (`{{a}}`) and is
  defined as a `string`.
- **`err_node_id`**: Crucial for handling potential errors during parameter setting (e.g., type
  conversion issues, invalid references). The task is routed here if an error occurs.
- The `go` logic block defines the path taken after the parameters are successfully set.

### Object Stringification Example

This example demonstrates how to correctly stringify object values in a Set Parameters node:

```json
{
  "id": "set_object_param_example",
  "obj_type": 0,
  "condition": {
    "logics": [
      {
        "type": "set_param",
        "extra": {
          "simple_param": "simple_value",
          "object_param": "{\"key\":\"value\",\"nested\":{\"key2\":\"value2\"}}",
          "array_param": "[1,2,3,4]",
          "dynamic_object": "{\"id\":{{user_id}},\"name\":\"{{user_name}}\"}"
        },
        "extra_type": {
          "simple_param": "string",
          "object_param": "object",
          "array_param": "array",
          "dynamic_object": "object"
        },
        "err_node_id": "error_node_id"
      },
      {
        "type": "go",
        "to_node_id": "next_node_id"
      }
    ]
  },
  "title": "Set Object Parameters",
  "description": "Sets parameters with properly stringified object values"
}
```

**Note**: When setting object values, you must:
1. Properly escape all quotes inside the JSON string with backslashes
2. Use a single set of quotes around the entire string
3. Set the correct data type in `extra_type` (usually "object" for objects and "array" for arrays)

### Dynamic Array Operations Limitation

When working with arrays in Set Parameters nodes, you might encounter limitations with dynamic
indices, especially when trying to append elements directly using syntax like
`"my_array[{{my_array.length}}]": ...`.

For reliable dynamic array manipulation (like appending elements), it is generally recommended to
use a **Code Node** instead:

```javascript
// Example in a Code Node to append an object to an array
if (!data.my_array) {
  data.my_array = []; // Initialize if it doesn't exist
}
data.my_array.push({ new_key: "new_value" });
```

## Node Patterns

### Basic Set Parameters Pattern

```
Start Node → Set Parameters Node → Continue Process Flow
```

### Data Transformation Pattern

```
Start Node → API Call Node → Set Parameters (Transform Response) → Continue Process Flow
```

### Validation Preparation Pattern

```
Start Node → Set Parameters (Prepare Data) → Condition Node (Validate) → Process Logic
```

### Mathematical Operation Pattern

```
Start Node → Set Parameters ($.math operations) → Continue Process Flow
```

## Node Naming Guidelines

When creating Set Parameters nodes in your processes:

1. **Node Titles** should:

   - Clearly indicate what parameters are being set (e.g., "Set Customer Profile Data" rather than
     just "Set Parameters")
   - Reflect the purpose of the data transformation in the context of your process
   - Be concise but descriptive enough to understand at a glance

2. **Node Descriptions** should:
   - Explain what parameters are being set and why
   - Mention any important transformations or calculations
   - Document any specific error handling considerations
   - Include information about how the parameters will be used downstream

Example of good naming:

- Title: "Format Response Data"
- Description: "Transforms API response into standard format. Sets status, timestamp, and user_info
  parameters for downstream processing."

Example of poor naming:

- Title: "Set Params"
- Description: "Updates data"

Meaningful titles and descriptions make processes more maintainable, easier to troubleshoot, and
more accessible to other team members.
