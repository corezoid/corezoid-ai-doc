# End Node

## Purpose

- Terminates the processing flow and collects tasks.
- Marks the completion of a task's journey through the Process.
- Provides final status indication for reporting and analytics.

## Parameters

### Required

1. **Status** (String)
   - _Success_ or _Error_ - Determines the visual indicator and reporting.
   - Example: `"extra": "{\"modeForm\":\"collapse\",\"icon\":\"success\"}"` for success
   - Example: `"extra": "{\"modeForm\":\"collapse\",\"icon\":\"error\"}"` for error

### Optional

1. **Save Task** (Boolean)
   - When enabled (default), preserves the task data for reporting and analysis.
   - Example: `"options": "{\"save_task\":true}"`
2. **Description** (String)
   - Custom text to describe this particular end state.
   - Example: `"description": "Process completion"`

## Error Handling

- End nodes play a critical role in error handling and reporting:
  - Tasks reaching an End node with _Error_ status are counted in error metrics
  - End nodes with error status should be positioned to the right of the main process flow
  - Different error scenarios should have dedicated End nodes with descriptive titles
  - If **Save Task** is disabled, the task data is not retained for historical analysis
  - End nodes should be paired with appropriate Reply to Process nodes for proper error reporting
- Common error handling patterns include:
  - Using different End nodes for different error types (validation errors, system errors, etc.)
  - Positioning error End nodes to the right of the main process flow
  - Using descriptive titles that indicate the specific error condition
  - Ensuring all error paths terminate in an End node with error status
  - Implementing proper error reporting before reaching the End node

## Best Practices

- Every Final node should be preceded by a Reply to Process node
- For error/exception paths, use an End node with _Error_ status
- For success paths, use an End node with _Success_ status
- Always enable **Save Task** for important processes to maintain an audit trail
- Use descriptive titles for End nodes to clarify the outcome (e.g., "Payment Successful",
  "Validation Failed")
- Position error End nodes to the right of the main process flow
- Use different End nodes for different error types
- Ensure all process paths terminate in an End node
- Document the meaning of each End node for maintenance purposes
- Consider implementing analytics to monitor task completion rates by End node

## Node Naming Guidelines

When creating End nodes in your processes:

1. **Node Titles** should:

   - Clearly indicate the specific outcome or result (e.g., "Payment Successful" rather than just
     "End")
   - Reflect the final status in the context of your process
   - Be concise but descriptive enough to understand at a glance

2. **Node Descriptions** should:
   - Explain what this end state represents
   - Mention any important final parameters or results
   - Document any specific reporting considerations
   - Include information about what triggered this end state

Example of good naming:

- Title: "Order Validation Failed"
- Description: "End state when order validation fails due to missing or invalid parameters. Records
  validation_errors in task data."

Example of poor naming:

- Title: "End"
- Description: "Process finished"

Meaningful titles and descriptions make processes more maintainable, easier to troubleshoot, and
more accessible to other team members.

## Default Configuration

When creating an End node in the Corezoid interface, the system automatically generates the
following default configuration:

```json
{
  "id": "end_node_id",
  "obj_type": 2,
  "condition": {
    "logics": [],
    "semaphors": []
  },
  "title": "End",
  "description": "",
  "x": 944,
  "y": 200,
  "extra": "{\"modeForm\":\"collapse\",\"icon\":\"success\"}",
  "options": "{\"save_task\":true}"
}
```

The default configuration includes:

1. An empty logics array (End nodes don't have outgoing connections)
2. Empty semaphors array that can be configured for advanced use cases
3. Success status by default (`"icon\":\"success\"`)
4. Save task enabled by default (`"save_task\":true`)

## Using Semaphores in End Nodes

While End nodes are terminal nodes that don't typically use semaphores as frequently as operation
nodes, they do support both time and count semaphores for implementing advanced flow control:

### Time Semaphores

Time semaphores can be used in End nodes to implement delayed task completion. If a task reaches the
End node and the time semaphore is active, the task is held for the specified time before being
marked as complete:

```json
"semaphors": [
  {
    "type": "time",
    "value": 60,
    "dimension": "sec",
    "to_node_id": "final_completion_node_id"
  }
]
```

The `dimension` parameter can have the following values:

- `"sec"` - seconds
- `"min"` - minutes
- `"hour"` - hours
- `"day"` - days

This can be used to implement a delay before finalizing task completion, which might be useful for
certain cleanup operations.

### Count Semaphores

Count semaphores can be used in End nodes to implement controlled task completion rates. If the
number of tasks completing reaches the threshold, new tasks are routed to an alternative completion
node:

```json
"semaphors": [
  {
    "type": "count",
    "value": 500,
    "esc_node_id": "alternative_completion_node_id"
  }
]
```

This can be used to prevent system overload during high-volume task completion periods.

Unlike operation nodes (API Call, Code, etc.), End nodes do not have escalation patterns since they
are terminal nodes in the process flow. They are often part of the escalation pattern for other
nodes, serving as the final destination for error paths.

End nodes can be configured with either success or error status:

1. **Success End Node**:

   ```json
   "extra": "{\"modeForm\":\"collapse\",\"icon\":\"success\"}"
   ```

2. **Error End Node**:
   ```json
   "extra": "{\"modeForm\":\"collapse\",\"icon\":\"error\"}"
   ```

When used in an API Call or Code node escalation pattern, an Error End node is typically positioned
to receive software errors from the Condition node:

```
API Call Node → Condition Node → Error End Node
```

## Configuration Example

This example demonstrates a basic End Node configuration extracted from a real process. It shows a
typical "Success" termination point.

```json
{
  "id": "final_node_example", // Unique node ID (example uses "61d552cb513aa04bc9698e3d")
  "obj_type": 2, // Object type for Final/End node
  "condition": {
    "logics": [], // End nodes have no outgoing logic
    "semaphors": [] // Optional semaphores for implementing timeouts or concurrency control
  },
  "title": "Final", // Default title, should be made descriptive (e.g., "Process Completed Successfully")
  "description": "", // Optional description
  "x": 492, // X coordinate on canvas
  "y": 400, // Y coordinate on canvas
  "extra": "{\"modeForm\":\"collapse\",\"icon\":\"success\"}", // UI settings indicating a 'success' outcome
  "options": "{\"save_task\":true}" // Option to save the task data upon completion
}
```

**Explanation:**

- **`obj_type: 2`**: Identifies this as an End (Final) node.
- **`condition`**: Contains empty `logics` and `semaphors` arrays as End nodes are terminal.
- **`extra`: `{"icon":"success"}`**: Specifies the visual icon and status as 'success'. For error
  states, this would be `"icon":"error"`.
- **`options`: `{"save_task":true}`**: Ensures that the task data is saved in the archive upon
  reaching this node. Set to `false` to discard task data.
- **Title/Description**: While empty in the example, these should be customized to reflect the
  specific outcome this End node represents (e.g., "Order Processed", "Validation Failed - Missing
  Email").
