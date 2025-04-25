# Start Node

## Purpose

- Receives tasks into a Process. Methods include CSV import, manual addition, API calls (webhook),
  or from other nodes (e.g., **Copy Task**).
- Serves as the entry point for all tasks in a process.
- Validates incoming data and initiates process flow.

## Parameters

### Required

1. **Single Start Node Constraint**
   - Only one Start node allowed in a Process.
   - Example: `"obj_type": 1` (identifies this as a Start node)
2. **Implicit Node Title**
   - Default name assigned automatically (user can override).
   - Example: `"title": "Start"`

### Optional

1. **Direct URL for tasks upload** (Boolean)
   - When enabled (default), an external webhook endpoint (JSON/XML/NVP) is generated.
2. **Type auth** (String)
   - _No Auth_ (accept all requests) or _Basic_ (requires credentials).
3. **API key** (String)
   - Accompanies _Basic_ auth if needed.
4. **Login / Secret** (String)
   - Auto-generated credentials for _Basic_ auth.
5. **Outgoing Path** (Node ID)
   - Specifies which node to route to after task creation.
   - Example: `"to_node_id": "next_node_id"`

## Error Handling

- Start nodes have specific error handling considerations:
  - If the Process is paused, disabled, or missing the Start node, tasks do not enter the workflow
  - Incorrect credentials when _Basic_ is selected generate "Access denied" errors
  - Malformed JSON in API requests can be rejected with parsing errors
  - Rate limiting may apply to high-volume task creation
  - Duplicate reference IDs (`ref`) will cause task creation failures
- Common error handling patterns include:
  - Implementing API gateway validation before tasks reach the Start node
  - Using proper authentication for public-facing processes
  - Ensuring unique reference IDs for each task
  - Monitoring task creation rates and volumes
  - Implementing proper error responses for API clients

## Best Practices

- Use secure authentication for public-facing processes
- Monitor the Start node for incoming task volume
- Consider using an API gateway or load balancer for high-traffic Start nodes
- Validate incoming data as early as possible in the process flow
- Generate unique reference IDs for each task to prevent conflicts
- Document API endpoints and authentication requirements
- Implement proper error responses for API clients
- Consider implementing rate limiting for public endpoints
- Use descriptive node titles that indicate the purpose of the process

## Node Naming Guidelines

When creating Start nodes in your processes:

1. **Node Titles** should:

   - Clearly indicate the purpose of the process (e.g., "Start Payment Processing" rather than just
     "Start")
   - Reflect the entry point function in the context of your workflow
   - Be concise but descriptive enough to understand at a glance

2. **Node Descriptions** should:
   - Explain what this process does and its overall purpose
   - Mention any important input parameters expected
   - Document any specific authentication requirements
   - Include information about how tasks enter this process

Example of good naming:

- Title: "Start Customer Onboarding"
- Description: "Entry point for customer onboarding process. Expects customer_id, name, and contact
  information. Requires API key authentication."

Example of poor naming:

- Title: "Start"
- Description: "Process begins here"

Meaningful titles and descriptions make processes more maintainable, easier to troubleshoot, and
more accessible to other team members.

## Default Configuration

When creating a Start node in the Corezoid interface, the system automatically generates the
following default configuration:

```json
{
  "id": "start_node_id",
  "obj_type": 1,
  "condition": {
    "logics": [
      {
        "type": "go",
        "to_node_id": null
      }
    ],
    "semaphors": []
  },
  "title": "Start",
  "description": "",
  "x": 100,
  "y": 200,
  "extra": "{\"modeForm\":\"collapse\",\"icon\":\"start\"}",
  "options": "{\"direct_url\":true,\"type_auth\":\"no_auth\"}"
}
```

The default configuration includes:

1. A single outgoing path (`"type": "go"`) that will be connected to the next node in the process
2. Empty semaphors array that can be configured for advanced use cases
3. Direct URL enabled by default (`"direct_url\":true`) to allow external API calls
4. No authentication by default (`"type_auth\":\"no_auth\"`)

## Using Semaphores in Start Nodes

While Start nodes don't typically use semaphores as frequently as operation nodes, they do support
both time and count semaphores for implementing advanced flow control:

### Time Semaphores

Time semaphores can be used in Start nodes to implement scheduled task processing. If a task enters
the process and the time semaphore is active, the task is routed to the specified node after the
time period:

```json
"semaphors": [
  {
    "type": "time",
    "value": 60,
    "dimension": "sec",
    "to_node_id": "delayed_processing_node_id"
  }
]
```

The `dimension` parameter can have the following values:

- `"sec"` - seconds
- `"min"` - minutes
- `"hour"` - hours
- `"day"` - days

This can be used to implement a delay for initial processing of tasks entering the process.

### Count Semaphores

Count semaphores can be used in Start nodes to implement rate limiting for incoming tasks. If the
number of concurrent tasks in the process reaches the threshold, new tasks are routed to an
escalation node:

```json
"semaphors": [
  {
    "type": "count",
    "value": 1000,
    "esc_node_id": "rate_limit_node_id"
  }
]
```

This can be used to prevent system overload during high-volume task ingestion periods.

Unlike operation nodes (API Call, Code, etc.), Start nodes do not have escalation patterns since
they are entry points in the process flow. They are typically positioned at the left side of the
process diagram, with all other nodes flowing to the right.

Start nodes can be configured with different authentication options:

1. **No Authentication** (default):

   ```json
   "options": "{\"direct_url\":true,\"type_auth\":\"no_auth\"}"
   ```

2. **Basic Authentication**:
   ```json
   "options": "{\"direct_url\":true,\"type_auth\":\"basic\",\"login\":\"username\",\"secret\":\"password\"}"
   ```

## Configuration Example

This example demonstrates a basic Start Node configuration extracted from a real process. It shows
the minimal setup for a process entry point.

```json
{
  "id": "start_node_example", // Unique node ID (example uses "61d552cb513aa04bc9698e3c")
  "obj_type": 1, // Object type for Start node
  "condition": {
    "logics": [
      {
        "type": "go", // Logic block defining the next node in the flow
        "to_node_id": "first_node_in_process" // ID of the node immediately following Start (example uses "61d552d182ba963bce69adde")
      }
    ],
    "semaphors": [] // Optional semaphores for implementing timeouts or concurrency control
  },
  "title": "Start", // Default title, should be made descriptive (e.g., "Start Order Processing")
  "description": "", // Optional description of the process
  "x": 492, // X coordinate on canvas
  "y": 100, // Y coordinate on canvas
  "extra": "{\"modeForm\":\"collapse\",\"icon\":\"\"}", // UI settings (icon is often empty or 'start')
  "options": null // Options like authentication are not set in this basic example
}
```

**Explanation:**

- **`obj_type: 1`**: Identifies this as a Start node, the entry point for tasks.
- **`condition.logics`**: Contains a single `go` block specifying the `to_node_id` of the first
  operational node in the process flow.
- **`title` / `description`**: Should be customized to clearly define the purpose of the process
  initiated by this Start node.
- **`options`**: This field would contain settings for API access, such as `direct_url` and
  `type_auth`, if configured. In this basic example, it's `null`.
