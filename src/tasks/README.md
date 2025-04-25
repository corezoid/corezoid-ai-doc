# Tasks in Corezoid

## Overview

A **Task** in Corezoid is the smallest runtime unit of data that traverses a Process and triggers
its logic execution. While a Process is the high-level container (an arrangement of Nodes that
define how incoming data should be handled), a task is the actual data bundle moving through these
Nodes. Each task carries specific parameters (key-value pairs in JSON format) and metadata (e.g.,
creation time, modification time, unique identifiers). Corezoid uses tasks to perform computations,
route data, and interact with external services according to the configured Node logic.

## Structure and Components

### Core Components

1. **Metadata** (System-generated)

   - Task identification and tracking information
   - Timestamps and status indicators
   - Node positioning information

2. **Data Payload** (User-defined)
   - Key-value pairs representing business data
   - Parameters that can be read and modified by nodes
   - Can contain nested objects and arrays

### Task Schema

A typical Task JSON structure:

```json
{
  "task_id": "TASK_67890",
  "ref": "REF_98765",
  "status": "processed",
  "user_id": "USER_54321",
  "create_time": 1617123456,
  "change_time": 1617123789,
  "node_id": "NODE_33333",
  "node_prev_id": "NODEPREV_44444",
  "data": {
    "customer_id": "C12345",
    "amount": 100.5,
    "currency": "USD",
    "items": [
      { "id": "PROD1", "quantity": 2 },
      { "id": "PROD2", "quantity": 1 }
    ],
    "shipping_address": {
      "street": "123 Main St",
      "city": "Anytown",
      "zip": "12345"
    }
  }
}
```

## Task Parameters

### System Parameters

1. **task_id** (`String`)

   - The unique identifier Corezoid assigns to this task
   - Example: `"TASK_67890"`

2. **ref** (`String`)

   - A reference value used within the Process to identify the task
   - Must be unique for each task
   - Example: `"REF_98765"`

3. **status** (`String`)

   - Reflects the outcome or current state of the task
   - Common values: `"processed"`, `"error"`, `"new"`
   - Example: `"processed"`

4. **user_id** (`Number` or `String`)

   - The ID of the user who created or last modified this task
   - Example: `"USER_54321"`

5. **create_time** (`Number`)

   - Timestamp indicating when the task was initially created
   - Unix timestamp in seconds
   - Example: `1617123456`

6. **change_time** (`Number`)

   - Timestamp for the last modification of the task
   - Unix timestamp in seconds
   - Example: `1617123789`

7. **node_id** (`String`)

   - The identifier of the node in which the task currently resides
   - Example: `"NODE_33333"`

8. **node_prev_id** (`String`)
   - The identifier of the node that previously processed this task
   - Example: `"NODEPREV_44444"`

### User Parameters

The **data** (`Object`) field contains the task's user-defined parameters:

- Can be an empty object `{}` or include key-value pairs
- Supports nested objects and arrays
- Can be modified by nodes during processing
- Should avoid null values at the top level
- Example: `{"customer_id": "C12345", "amount": 100.50}`

## Task Lifecycle

### Creation Methods

Tasks can enter Corezoid in multiple ways:

1. **Manual UI Entry**

   - In the Corezoid interface, in the **View** mode
   - Add a new task directly to a Start node of the current Process

2. **CSV Import**

   - Batch-load tasks from a file
   - Map CSV columns to the appropriate task parameters

3. **API or HTTP POST**
   - The most common approach for automation
   - Send HTTP requests to the Process's Start node URL or alias
   - Example API request:
     ```json
     {
       "ops": [{
         "action": "user",
         "company_id": "[workspace_id]",
         "conv_id": [process_id],
         "data": {
           "key1": "value1",
           "key2": "value2"
         },
         "obj": "task",
         "ref": "[unique_reference]",
         "type": "create"
       }]
     }
     ```

### Processing Flow

1. **Initiation**: Task enters through the Start node
2. **Processing**: Passes through configured Nodes
   - Nodes may alter `data` fields (e.g., using **Set Parameters**)
   - Conditional nodes may route tasks to different branches
3. **Completion**: Reaching an **End** node terminates the task's journey
4. **Storage**: Task data is stored for reporting and analysis (if enabled)

## Error Handling

### Common Error Scenarios

- **Missing `task_id`**: Corezoid can auto-generate one if absent, but specifying it is helpful for
  tracking
- **Duplicate `ref`**: Tasks with duplicate reference IDs will be rejected
- **Incorrect JSON**: If the request body is malformed, the task may be rejected
- **Excessive Data**: Some processes have a maximum task size limit (2MB)
- **Null Values**: Top-level null values are not fully supported by the Corezoid online IDE

### Error Handling Best Practices

- Generate unique reference IDs for each task
- Validate task data before submission
- Use empty strings instead of null for top-level fields
- Keep task size under the 2MB limit
- Implement proper error handling in processes to catch and handle invalid task data

## Best Practices

- Use consistent naming conventions for task parameters
- Document the expected task structure for each process
- Generate unique reference IDs for each task
- Validate task data before submission
- Use empty strings instead of null for top-level fields
- Keep task size under the 2MB limit
- Include only necessary data in tasks to minimize size
- Consider data privacy and security when designing task structures

## Examples

For JSON examples of tasks with different parameters, see [Task Examples](task-examples.md).

## Related Documentation

- [Process Overview](../process/README.md) - Information about process structure and flow
- [Nodes Overview](../nodes/README.md) - Documentation for all node types that process tasks
