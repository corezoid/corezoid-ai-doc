# Delay Node

## Purpose

- Holds tasks for a specified time period before allowing them to proceed.
- Creates scheduled or time-based operations in a Process.
- Enables retry mechanisms for transient errors in other nodes.

## Parameters

### Required

1. **Delay Duration** (Number)

   - The amount of time to hold the task.
   - Example: `"value": 30`

2. **Time Unit** (String)
   - Seconds, minutes, hours, or days.
   - Example: `"dimension": "sec"`

### Optional

1. **Maximum Delay** (Number)

   - Upper limit for variable delays.

2. **Dynamic Delay** (String)

   - Parameter name containing the delay value.

3. **To Node ID** (String)
   - Specifies which node to route to after the delay.
   - Example: `"to_node_id": "retry_node_id"`

## Error Handling

- Delay nodes are commonly used in error handling patterns:
  - They provide retry mechanisms for transient errors (especially hardware errors)
  - They implement exponential backoff strategies for API calls and external services
  - They create cooling periods after rate limit errors
- Delay nodes are often positioned after Condition nodes that detect hardware errors
- Common error handling patterns include:
  - Routing hardware errors to a Delay node, then back to the original operation
  - Using multiple Delay nodes with increasing durations for progressive retry strategies
  - Setting maximum retry counts to prevent infinite retry loops
- If a dynamic delay parameter is invalid or missing, the node may use a default or fail
- Extremely long delays might affect system performance or task retention

## Using Semaphores in Delay Nodes

Delay nodes primarily use time semaphores as their main mechanism for implementing delays, as shown
in the Configuration Example section. However, they can also support count semaphores for
concurrency control:

### Time Semaphores

Time semaphores are the primary mechanism for implementing delays in Delay nodes. They hold the task
for a specified time before routing it to the next node:

```json
"semaphors": [
  {
    "type": "time",
    "value": 30,
    "dimension": "sec",
    "to_node_id": "next_node_id"
  }
]
```

This is an alternative to using the `delay` logic type and provides the same functionality.

### Count Semaphores

Count semaphores can be used to implement concurrency control for delay operations. If the number of
concurrent delayed tasks reaches the threshold, new tasks are routed to an escalation node:

```json
"semaphors": [
  {
    "type": "count",
    "value": 1000,
    "esc_node_id": "delay_limit_node_id"
  }
]
```

This can be used to prevent system overload when many tasks are being delayed simultaneously.

## Best Practices

- Use reasonable delay times to avoid resource constraints
- For variable delays, validate the parameter before reaching the Delay node
- Consider using a Queue node for very long delays
- Monitor delayed tasks to ensure they're proceeding as expected
- Use descriptive node titles that indicate the purpose of the delay
- When using Delay for retries, implement a maximum retry count
- Position Delay nodes after Condition nodes that detect specific error types
- Use shorter delays for first retry attempts, increasing for subsequent attempts
- Consider implementing a "jitter" (small random variation) in retry delays to prevent thundering
  herd problems
- Document retry strategies in node descriptions for maintenance purposes

## Node Naming Guidelines

When creating Delay nodes in your processes:

1. **Node Titles** should:

   - Clearly indicate the purpose of the delay (e.g., "Wait 30s Before Retry" rather than just
     "Delay")
   - Reflect the timing strategy in the context of your process
   - Be concise but descriptive enough to understand at a glance

2. **Node Descriptions** should:
   - Explain why the delay is necessary
   - Mention the duration and any dynamic parameters
   - Document any retry strategy considerations
   - Include information about what happens after the delay

Example of good naming:

- Title: "Retry After 30s Cooldown"
- Description: "Waits 30 seconds after a rate limit error before retrying the API call. Part of
  exponential backoff strategy."

Example of poor naming:

- Title: "Wait"
- Description: "Delays task"

Meaningful titles and descriptions make processes more maintainable, easier to troubleshoot, and
more accessible to other team members.

## Default Configuration with Escalation Nodes

When creating a Delay node in the Corezoid interface, the system automatically generates the
following default configuration:

```json
{
  "id": "delay_node_id",
  "obj_type": 0,
  "condition": {
    "logics": [
      {
        "type": "delay",
        "value": 30,
        "dimension": "sec",
        "to_node_id": null
      }
    ],
    "semaphors": [] // Optional semaphores for implementing additional timeouts or concurrency control
  },
  "title": "Delay",
  "description": "",
  "modeForm": "expand",
  "active": true
}
```

The default configuration includes:

1. A delay of 30 seconds (`"value": 30, "dimension": "sec"`)
2. No specified target node (`"to_node_id": null`) - will be connected during process design
3. Empty semaphors array for optional time-based or resource-based conditions

Delay nodes are often used in escalation patterns for other node types, particularly for handling
hardware errors in API Call and Code nodes. In these patterns, the Delay node is positioned to the
right of the main node and connected to a Condition node that routes hardware errors to the Delay
node.

When used in an API Call or Code node escalation pattern, the Delay node is typically configured to
route back to the original node after the delay period, creating a retry mechanism:

```
API Call Node → Condition Node → Delay Node → Back to API Call Node
```

For example, in an API Call escalation pattern, the Delay node would be configured as:

```json
{
  "logics": [
    {
      "type": "delay",
      "value": 30,
      "dimension": "sec",
      "to_node_id": "api_call_node_id"
    }
  ]
}
```

This creates a retry loop where hardware errors are delayed for 30 seconds before retrying the API
call.

## Configuration Example (Using Time Semaphore)

This example demonstrates a Delay Node configuration extracted from a real process
(`1646227_Simple_delay.conv.json`). It uses a **time semaphore** instead of the `delay` logic type
to achieve the delay.

```json
{
  "id": "67f940d582ba966c7fbc03fc", // Unique node ID
  "obj_type": 0, // Object type for Logic node
  "condition": {
    "logics": [], // No specific 'delay' logic type used here
    "semaphors": [
      // Delay implemented using a time semaphore
      {
        "type": "time", // Specifies a time-based semaphore
        "value": 30, // Delay duration
        "dimension": "sec", // Time unit (seconds)
        "to_node_id": "67f940cf513aa034c8bc79d9" // Node to proceed to after delay (Final node in this example)
      }
    ]
  },
  "title": "", // Title was empty in the example, should be descriptive (e.g., "Wait 30 Seconds")
  "description": "", // Optional description
  "x": 624, // X coordinate on canvas
  "y": 200, // Y coordinate on canvas
  "extra": "{\"modeForm\":\"expand\",\"icon\":\"\"}", // UI settings
  "options": null // No specific options set
}
```

**Explanation:**

- This node achieves a 30-second delay using a `time` semaphore within the `condition.semaphors`
  array.
- When a task enters this node, the time semaphore activates.
- The task is held at this node for the specified `value` (30) and `dimension` ("sec").
- After 30 seconds, the task is released and proceeds to the node specified in `to_node_id`
  (`67f940cf513aa034c8bc79d9`, the Final node).
- Note that this node doesn't use the `"type": "delay"` within the `logics` array, which is another
  way to configure delays. Using a time semaphore is common, especially when the node might have
  other logic blocks as well.
