# Queue Node

## Purpose

- Creates a queue of tasks for asynchronous handling or delayed processing.
- Allows for task buffering and controlled processing rates.
- Enables decoupling of task creation from task processing.

## Parameters

### Required

1. **Queue Type** (String)
   - Type of queue operation, specified as "api_queue".
   - Example: `"type": "api_queue"`

### Optional

1. **Data** (Object)
   - Additional parameters for the queue operation.
   - Example: `"data": {}`
2. **Data Type** (Object)
   - Specifies the data types of the queue parameters.
   - Example: `"data_type": {}`
3. **Capacity** (Number)
   - Maximum tasks the queue can hold.
4. **Alert threshold** (Number)
   - Trigger notification if queue length is exceeded.

## Error Handling

- Queue operations generally don't have dedicated error handling nodes in most implementations.
- Common error scenarios include:
  - Queue capacity exceeded
  - Queue name conflicts
  - Permission issues
- System parameters for monitoring:
  - `__queue_size__`: Current number of tasks in the queue
  - `__queue_capacity__`: Maximum capacity of the queue
- For critical queue operations, consider implementing:
  - Monitoring of queue size
  - Alerts for queue capacity thresholds
  - Fallback paths for queue failures

## Using Semaphores in Queue Nodes

Queue nodes support both time and count semaphores to implement timeouts and concurrency control:

### Time Semaphores

Time semaphores can be used to implement timeouts for queue operations. If the queue operation
doesn't complete within the specified time, the task is routed to a timeout node:

```json
"semaphors": [
  {
    "type": "time",
    "value": 30,
    "dimension": "sec",
    "to_node_id": "queue_timeout_node_id"
  }
]
```

This provides a mechanism for handling queue operations that might take longer than expected.

### Count Semaphores

Count semaphores can be used to implement concurrency control for queue operations. If the number of
concurrent queue operations reaches the threshold, new tasks are routed to an escalation node:

```json
"semaphors": [
  {
    "type": "count",
    "value": 500,
    "esc_node_id": "queue_limit_node_id"
  }
]
```

This can be used to prevent queue overload and maintain optimal system performance.

## Best Practices

- Pair with **Get from Queue** for retrieval
- Monitor queue size to prevent overload
- Use descriptive queue names for easy identification
- Set appropriate capacity limits based on expected volume
- Configure alert thresholds to receive notifications before queues become critical
- Consider implementing retry logic for failed queue operations
- Use queues to handle peak loads and ensure consistent processing rates
- Document queue names and purposes for system maintenance
- Consider implementing dead-letter queues for failed processing attempts

## Node Naming Guidelines

When creating Queue nodes in your processes:

1. **Node Titles** should:

   - Clearly indicate the purpose of the queue (e.g., "Queue Pending Orders" rather than just
     "Queue")
   - Reflect the role of this queue in the context of your workflow
   - Be concise but descriptive enough to understand at a glance

2. **Node Descriptions** should:
   - Explain what tasks are being queued and why
   - Mention any capacity limits or alert thresholds
   - Document any specific processing considerations
   - Include information about how and when tasks will be retrieved

Example of good naming:

- Title: "Queue Payment Requests"
- Description: "Stores payment requests for asynchronous processing. Limited to 1000 tasks with
  alert at 800. Retrieved by payment processor every 5 minutes."

Example of poor naming:

- Title: "Queue"
- Description: "Stores tasks"

Meaningful titles and descriptions make processes more maintainable, easier to troubleshoot, and
more accessible to other team members.

## Configuration Example

This example demonstrates a basic Queue Node configuration extracted from a real process. It shows
the minimal setup required to queue a task.

```json
{
  "id": "queue_node_example", // Unique node ID (example uses "61d552d182ba963bce69adde")
  "obj_type": 0, // Object type for Logic node
  "condition": {
    "logics": [
      {
        "type": "api_queue", // Specifies this is a Queue logic block
        "data": {}, // Additional parameters (empty in this example)
        "data_type": {} // Data types for parameters (empty as 'data' is empty)
        // Note: Capacity and alert thresholds are not specified, using defaults
      },
      {
        "type": "go", // Logic block for the path after the task is queued
        "to_node_id": "next_node_in_flow" // ID of the next node (example uses "61d552cb513aa04bc9698e3d")
      }
    ],
    "semaphors": [] // Optional semaphores for implementing timeouts or concurrency control
  },
  "title": "Queue Task for Processing", // Descriptive title (example node had empty title)
  "description": "Adds the current task to this queue node for later retrieval.", // Optional description
  "x": 392, // X coordinate on canvas
  "y": 212, // Y coordinate on canvas
  "extra": "{\"modeForm\":\"expand\",\"icon\":\"\"}", // UI settings
  "options": null // No specific options set
}
```

**Explanation:**

- **`type: "api_queue"`**: Identifies the node's function as placing the task into this specific
  queue.
- **`data: {}` / `data_type: {}`**: Indicates that no additional parameters are being added or
  modified specifically by the queueing operation itself. The entire task data is queued.
- The `go` logic block defines where the task proceeds _after_ being successfully added to the queue
  (usually to a Final node, as the task's journey in this process branch ends here).
- Tasks placed in this queue remain here until retrieved by a **Get from Queue** node referencing
  this Queue node's ID (`queue_node_example` in this case) within this process (`1023406`).
