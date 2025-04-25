# Task Metadata in Corezoid

This document describes the metadata fields available in Corezoid tasks and how they can be accessed
and used in processes.

## Overview

Task metadata in Corezoid consists of system-level information about the task that is maintained by
the platform. These metadata fields provide context about the task's lifecycle, location, and
processing history. Metadata is distinct from the task's data payload (stored in the `data` field)
and is managed automatically by the Corezoid system.

## Accessing Task Metadata

Task metadata can be accessed in various nodes (particularly in Set Parameters and Code nodes) using
the `root.` prefix. For example, to access the previous node ID, you would use `root.prev_node_id`.

## Available Metadata Fields

| Metadata Field   | Description                                          | Access Pattern        | Example Value                |
| ---------------- | ---------------------------------------------------- | --------------------- | ---------------------------- |
| `task_id`        | Unique identifier for the task                       | `root.task_id`        | `"TASK_12345"`               |
| `ref`            | Reference identifier for the task (user-defined)     | `root.ref`            | `"REF_67890"`                |
| `conv_id`        | ID of the process (conveyor) the task is in          | `root.conv_id`        | `"1234"`                     |
| `node_id`        | ID of the current node                               | `root.node_id`        | `"67f40e0682ba966c7fb151b7"` |
| `prev_node_id`   | ID of the previous node the task was in              | `root.prev_node_id`   | `"67f40e0682ba966c7fb151b6"` |
| `node_name`      | Name of the current node                             | `root.node_name`      | `"API Call"`                 |
| `prev_node_name` | Name of the previous node                            | `root.prev_node_name` | `"Condition"`                |
| `status`         | Current status of the task                           | `root.status`         | `"1"` (active)               |
| `create_time`    | Unix timestamp when the task was created             | `root.create_time`    | `"1617283200"`               |
| `change_time`    | Unix timestamp when the task was last modified       | `root.change_time`    | `"1617283300"`               |
| `end_time`       | Unix timestamp when the task completed (0 if active) | `root.end_time`       | `"0"`                        |
| `user_id`        | ID of the user who created the task                  | `root.user_id`        | `"512"`                      |

## Common Use Cases for Task Metadata

### Tracking Task Flow with `prev_node_id`

The `prev_node_id` metadata field is particularly useful for:

1. **Conditional Logic Based on Origin**

   - Implement different logic depending on which node the task came from
   - Example in a Condition node:
     ```
     root.prev_node_id == "67f40e0682ba966c7fb151b6"
     ```

2. **Debugging and Logging**

   - Track the path a task took through a process
   - Log the sequence of nodes visited by a task
   - Example in a Set Parameters node:
     ```json
     {
       "path_history": "{{path_history}},{{root.prev_node_name}}"
     }
     ```

3. **Error Handling**
   - Determine where an error occurred in the process flow
   - Route tasks to different error handling based on origin
   - Example in a Code node:
     ```javascript
     function(data) {
       data.error_origin = data.__root.prev_node_name;
       data.error_node_id = data.__root.prev_node_id;
       return data;
     }
     ```

### Timing Analysis with Timestamp Fields

The timestamp metadata fields (`create_time`, `change_time`, `end_time`) can be used for:

1. **Performance Monitoring**

   - Calculate how long a task spent in each node
   - Example in a Set Parameters node:
     ```json
     {
       "time_in_previous_node": "$.math({{root.change_time}}-{{previous_change_time}})"
     }
     ```

2. **SLA Tracking**

   - Monitor if tasks are being processed within expected timeframes
   - Example in a Condition node:
     ```
     $.math({{root.change_time}}-{{root.create_time}}) > 300
     ```

3. **Aging Analysis**
   - Identify and prioritize older tasks
   - Example in a Code node:
     ```javascript
     function(data) {
       const currentTime = Math.floor(Date.now() / 1000);
       data.age_in_seconds = currentTime - parseInt(data.__root.create_time);
       data.priority = data.age_in_seconds > 3600 ? "high" : "normal";
       return data;
     }
     ```

### Process and User Identification

The `conv_id` and `user_id` metadata fields are useful for:

1. **Multi-Process Workflows**

   - Track which process a task originated from
   - Maintain context when tasks move between processes
   - Example in a Set Parameters node:
     ```json
     {
       "origin_process": "{{root.conv_id}}"
     }
     ```

2. **User Attribution**
   - Track which user initiated a task
   - Implement user-specific logic or permissions
   - Example in a Condition node:
     ```
     root.user_id == "512"
     ```

## Implementation in Set Parameters Node

To use task metadata in a Set Parameters node:

```json
{
  "type": "set_param",
  "mode": "key_value",
  "extra": {
    "current_node": "{{root.node_name}}",
    "previous_node": "{{root.prev_node_name}}",
    "task_created_at": "{{root.create_time}}",
    "processing_path": "{{processing_path}},{{root.node_id}}"
  },
  "extra_type": {
    "current_node": "string",
    "previous_node": "string",
    "task_created_at": "string",
    "processing_path": "string"
  }
}
```

## Implementation in Code Node

To access task metadata in a Code node:

```javascript
function(data) {
  // Task metadata is available in the __root object
  const taskId = data.__root.task_id;
  const prevNodeId = data.__root.prev_node_id;
  const createTime = parseInt(data.__root.create_time);

  // Calculate time in process
  const currentTime = Math.floor(Date.now() / 1000);
  const timeInProcess = currentTime - createTime;

  // Add to task data
  data.task_info = {
    id: taskId,
    previous_node: prevNodeId,
    time_in_process: timeInProcess
  };

  return data;
}
```

## Best Practices

1. **Store Metadata Copies When Needed**

   - If you need to reference metadata values later in the process, store them in the task data
   - Example: `"original_node": "{{root.node_id}}"`

2. **Type Conversion**

   - Metadata values are returned as strings, so convert them to appropriate types when needed
   - For timestamps, use `parseInt()` or `$.math()` for calculations

3. **Validation**

   - Always validate metadata values before using them for critical operations
   - Some metadata fields may be empty in certain contexts (e.g., `prev_node_id` for newly created
     tasks)

4. **Performance Considerations**
   - Accessing metadata is efficient, but avoid excessive use in high-volume processes
   - Consider storing frequently used metadata in task data rather than accessing it repeatedly

## Example: Task Flow Tracking

This example demonstrates how to track a task's path through a process using the `prev_node_id` and
`node_id` metadata:

```json
{
  "type": "set_param",
  "mode": "key_value",
  "extra": {
    "node_path": "{{node_path}}→{{root.prev_node_id}}→{{root.node_id}}"
  },
  "extra_type": {
    "node_path": "string"
  }
}
```

By adding this Set Parameters node at key points in your process, you can maintain a record of the
exact path each task takes, which is invaluable for debugging complex processes.
