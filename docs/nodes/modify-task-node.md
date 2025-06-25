# Modify Task Node

## Purpose

- Updates an existing task (identified by REF) in another (or the same) Process.
- Unlike **Copy Task**, no duplication occurs; the targeted task is altered in place.
- Enables modification of tasks that are already in progress in other processes.

## Parameters

### Required

1. **Target Process** (String/ID)
   - The Process containing the task to modify.
   - Example: `"conv_id": 1023391`
   - Can be a dynamic value from the process task
   - Dynamic example: `"conv_id": "{{param1}}"` (with quotes for JSON format)
2. **Task REF** (String)
   - Reference identifier of the task to modify.
   - Example: `"ref": "{{reference}}"`
3. **Error Node ID** (String)
   - Specifies which node to route to if the task modification fails.
   - Example: `"err_node_id": "error_node_id"`

### Optional

1. **Mode** (String)
   - Specifies the modification mode, typically "modify".
   - Example: `"mode": "modify"`
2. **Data** (Object)
   - Key-value pairs to update in the target task.
   - Example: `"data": {"a": "2"}`
3. **Data Type** (Object)
   - Specifies the data types of the updated values.
   - Example: `"data_type": {"a": "string"}`
4. **Send Parent Data** (Boolean)
   - Whether to include the current task's data in the modification.
   - Example: `"send_parent_data": false`
5. **Is Sync** (Boolean)
   - Whether to wait for the modification to complete before proceeding.
   - Example: `"is_sync": true`

## Configuration Example

This example demonstrates a Modify Task Node configuration extracted from a real process. It shows
how to modify a task identified by a reference in another process, updating a specific parameter
synchronously.

```json
{
  "id": "modify_task_example", // Unique node ID (example uses "61d5482d513aa04bc968537b")
  "obj_type": 0, // Object type for Logic node
  "condition": {
    "logics": [
      {
        // Note: Uses 'api_copy' type with 'modify' mode
        "type": "api_copy",
        "mode": "modify", // Specifies the action is modification
        "data": {
          // Data to update in the target task
          "a": "2" // Sets parameter 'a' to the string "2"
        },
        "data_type": {
          // Specifies the data type for the updated parameter
          "a": "string"
        },
        "group": "", // Grouping parameter (empty in this example)
        "ref": "{{reference}}", // Dynamic reference to the target task, provided by the input parameter 'reference'
        "send_parent_data": false, // Do not merge the current task's data into the target
        "is_sync": true, // Wait for the modification to complete before proceeding
        "err_node_id": "error_condition_node", // ID for error handling (example uses "61d5482d513aa04bc968537f")
        "conv_id": 1023391, // ID of the target Process containing the task to modify
        "obj_to_id": null, // Not typically used for modify operations
        "user_id": 56171 // Internal user ID
      },
      {
        "type": "go", // Logic block for the successful path after modification
        "to_node_id": "next_node_in_flow" // ID of the next node (example uses "61d547ed82ba963bce687551")
      }
    ],
    "semaphors": [] // Optional semaphores for implementing timeouts or concurrency control
  },
  "title": "Update Parameter 'a' in Target Task", // Descriptive title (example node had empty title)
  "description": "Modifies the task identified by {{reference}} in Process 1023391, setting parameter 'a' to '2'. Waits for completion.", // Optional description
  "x": 580, // X coordinate on canvas
  "y": 200, // Y coordinate on canvas
  "extra": "{\"modeForm\":\"expand\",\"icon\":\"\"}", // UI settings
  "options": null // No specific options set
}
```

**Explanation:**

- **`type: "api_copy"` with `mode: "modify"`**: This combination identifies the node's function as
  modifying an existing task.
- **`conv_id: 1023391`**: Specifies the target Process ID where the task resides.
- **`ref: "{{reference}}"`**: Crucially identifies the specific task to modify using a dynamic value
  passed into the current process.
- **`data` / `data_type`**: Define the parameters to update in the target task. Here, parameter `a`
  is set to the string `"2"`.
- **`is_sync: true`**: Ensures the current process waits for the modification to be confirmed before
  moving to the `next_node_in_flow`.
- **`err_node_id`**: Points to the Condition node for handling errors (e.g., task not found, access
  denied, timeout).

## Interaction

- The node locates the specified task (by REF) in the target Process and modifies it with new data.
- The local task then proceeds in the current Process independently.
- When `is_sync` is true, the node waits for confirmation of the modification.

## Error Handling

- Corezoid provides specific error parameters to handle different failure scenarios:
  - `__conveyor_copy_task_return_type_tag__`: Identifies specific error types
- Common error types include:
  - `not_found_task`: The specified REF does not exist
  - `access_denied`: Insufficient permissions to modify the task
  - `copy_task_timeout`: The modification operation timed out
  - `copy_task_fatal_error`: Critical failure in the modification operation
  - `crash_api`: System-level failure
  - `duplicate_callback`: A callback with the same ID already exists
- Implement retry logic with a Delay node for transient failures like `crash_api`,
  `copy_task_timeout`, and `copy_task_fatal_error`
- Route permanent failures like `access_denied` and `not_found_task` to error handling nodes

## Using Semaphores in Modify Task Nodes

Modify Task nodes support both time and count semaphores to implement timeouts and concurrency
control:

### Time Semaphores

Time semaphores can be used to implement timeouts for task modification operations. If the
modification doesn't complete within the specified time, the task is routed to a timeout node:

```json
"semaphors": [
  {
    "type": "time",
    "value": 30,
    "dimension": "sec",
    "to_node_id": "modification_timeout_node_id"
  }
]
```

The `dimension` parameter can have the following values:

- `"sec"` - seconds
- `"min"` - minutes
- `"hour"` - hours
- `"day"` - days

This provides a mechanism for handling task modifications that might take longer than expected,
especially when modifying tasks in busy processes.

### Count Semaphores

Count semaphores can be used to implement concurrency control for task modification operations. If
the number of concurrent modifications reaches the threshold, new tasks are routed to an escalation
node:

```json
"semaphors": [
  {
    "type": "count",
    "value": 50,
    "esc_node_id": "modification_limit_node_id"
  }
]
```

This can be used to prevent system overload when modifying tasks across multiple processes.

## Best Practices

- Ensure the target Process is active and the **REF** is valid
- Use **Modify Task** for partial updates. If you must spawn a separate flow, use **Copy Task**
- Verify that the task reference exists before attempting modification
- Consider using parameter mapping to update only specific fields
- Include comprehensive error handling with specific conditions for different error types
- Position error handling nodes to the right of the Modify Task node
- Use descriptive node titles that indicate the purpose of the modification
- Set appropriate timeouts for synchronous modifications

## Node Naming Guidelines

When creating Modify Task nodes in your processes:

1. **Node Titles** should:

   - Clearly indicate what task is being modified (e.g., "Update Order Status" rather than just
     "Modify Task")
   - Reflect the purpose of the modification in the context of your workflow
   - Be concise but descriptive enough to understand at a glance

2. **Node Descriptions** should:
   - Explain what data is being modified and why
   - Mention the target process and reference ID pattern
   - Document any specific error handling considerations
   - Include information about synchronous vs. asynchronous operation

Example of good naming:

- Title: "Update Customer Status"
- Description: "Updates the status field in the customer record task. Modifies task in Customer
  Management process using customer_id as reference."

Example of poor naming:

- Title: "Modify"
- Description: "Changes task data"

Meaningful titles and descriptions make processes more maintainable, easier to troubleshoot, and
more accessible to other team members.

For examples of the Modify Task Node, see the best practices and error handling sections above.
