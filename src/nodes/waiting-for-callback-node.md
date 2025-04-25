# Waiting for Callback Node

## Purpose

- Halts the task flow until an external HTTP request (callback) hits the auto-generated endpoint,
  then continues.
- Enables integration with external systems that need to trigger process continuation.

## Parameters

### Required

1. **Public Callback URL** (auto-generated)
   - External systems must call this to resume tasks.

### Optional

1. **Timeout** (Number, dimension)
   - If expired, can route tasks to an error path or alternative node.

## Error Handling

- Missing or incorrect callback invocation leaves tasks suspended.
- Without a timeout, tasks can remain indefinitely.

## Using Semaphores in Waiting for Callback Nodes

Waiting for Callback nodes primarily use time semaphores to implement timeouts for callback
operations:

### Time Semaphores

Time semaphores are essential for Waiting for Callback nodes to prevent tasks from being stuck
indefinitely if no callback is received. They specify a maximum wait time before routing the task to
a timeout node:

```json
"semaphors": [
  {
    "type": "time",
    "value": 3600,
    "dimension": "sec",
    "to_node_id": "callback_timeout_node_id"
  }
]
```

This provides a critical safeguard against indefinitely waiting for callbacks that might never
arrive.

### Count Semaphores

While less common in Waiting for Callback nodes, count semaphores can be used to implement
concurrency control for callback operations. If the number of concurrent waiting tasks reaches the
threshold, new tasks are routed to an escalation node:

```json
"semaphors": [
  {
    "type": "count",
    "value": 200,
    "esc_node_id": "callback_limit_node_id"
  }
]
```

This can be used to prevent system overload when many tasks are waiting for callbacks
simultaneously.

## Best Practices

- Specify a timeout path to handle cases with no external callback
- Distribute the node's callback URL securely to avoid unauthorized triggers
- Consider implementing retry logic for critical callbacks
- Monitor suspended tasks to identify potential issues
- Use descriptive node titles that indicate what callback is being waited for
- Include proper error handling for timeout scenarios

## Configuration Example

This example demonstrates a Waiting for Callback Node configuration extracted from a real process.
It shows how the node pauses execution and includes a timeout semaphore.

```json
{
  "id": "wait_callback_example", // Unique node ID (example uses "61d5480d82ba963bce687841")
  "obj_type": 0, // Object type for Logic node
  "condition": {
    "logics": [
      {
        "type": "api_callback", // Specifies this is a Waiting for Callback logic block
        "is_sync": true, // Indicates synchronous callback handling (waits for callback)
        "obj_id_path": "data.test" // Optional path to store callback data (specific usage may vary)
      },
      {
        "type": "go", // Logic block for the path after the callback is received
        "to_node_id": "next_node_after_callback" // ID of the next node (example uses "61d5480282ba963bce68773d")
      }
    ],
    "semaphors": [
      // Semaphores for controlling execution
      {
        "type": "time", // Timeout semaphore
        "value": 86400, // Timeout value (example uses 86400, likely seconds for 1 day)
        "dimension": "day", // Timeout unit (example uses 'day', but 'sec' is more common; adjust as needed)
        "to_node_id": "timeout_error_node" // Node to go to on timeout (example uses "61d5480d82ba963bce687842")
      }
    ]
  },
  "title": "Wait for External Trigger", // Descriptive title (example node had empty title)
  "description": "Pauses the process until an external callback is received or a 1-day timeout occurs.", // Optional description
  "x": 576, // X coordinate on canvas
  "y": 188, // Y coordinate on canvas
  "extra": "{\"modeForm\":\"expand\",\"icon\":\"\"}", // UI settings
  "options": null // No specific options set
}
```

**Explanation:**

- **`type: "api_callback"`**: Identifies the node's function.
- **`is_sync: true`**: The process waits at this node until the callback is received.
- **`obj_id_path`**: An optional field that might specify where to store data received from the
  callback within the task's `data` object. The exact behavior might depend on the Corezoid version
  or specific configuration.
- The `go` logic block defines the path taken _after_ a successful callback is received.
- The `semaphors` array includes a timeout condition. If no callback arrives within the specified
  duration (1 day in the example), the task is routed to the `timeout_error_node`.

## Node Naming Guidelines

When creating Waiting for Callback nodes in your processes:

1. **Node Titles** should:

   - Clearly indicate what callback is being waited for (e.g., "Wait for Payment Confirmation"
     rather than just "Waiting for Callback")
   - Reflect the purpose of the pause in the context of your workflow
   - Be concise but descriptive enough to understand at a glance

2. **Node Descriptions** should:
   - Explain what external system will trigger the callback
   - Mention any timeout settings and fallback paths
   - Document any specific security considerations
   - Include information about what happens after the callback is received

Example of good naming:

- Title: "Await Payment Gateway Response"
- Description: "Waits for payment confirmation callback from PaymentGateway API. Times out after 5
  minutes and routes to retry path if no response is received."

Example of poor naming:

- Title: "Callback"
- Description: "Waits for response"

Meaningful titles and descriptions make processes more maintainable, easier to troubleshoot, and
more accessible to other team members.
