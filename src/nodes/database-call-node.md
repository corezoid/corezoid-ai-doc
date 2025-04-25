# Database Call Node

## Purpose

- Executes SQL statements on an external database.
- Retrieves, updates, or manipulates data in connected database systems.
- Enables integration with external data sources and persistence layers.

## Parameters

### Required

1. **Instance ID** (Number)
   - Database connection identifier.
   - Example: `"instance_id": 227`
2. **Query** (String)
   - SQL statement to execute.
   - Example: `"query": "SELECT * FROM \"public\".\"users\" LIMIT 100"`
3. **Error Node ID** (String)
   - Specifies which node to route to if the database call fails.
   - Example: `"err_node_id": "error_node_id"`

### Optional

1. **Parameter Mapping** (Object)
   - Maps task parameters to query parameters.
   - Uses double curly braces syntax: `{{variable_name}}`
2. **Result Mapping** (Object)
   - Maps query results to task parameters.
3. **Timeout** (Object)
   - Maximum execution time using semaphors.

## Error Handling

- Corezoid distinguishes between two types of errors:
  - **Hardware errors**: Infrastructure or connection failures (retried automatically)
  - **Software errors**: SQL syntax errors, query execution failures
- Error routing is configured through the `err_node_id` parameter
- Common error scenarios include:
  - Connection failures to the database
  - SQL syntax errors
  - Query timeout
  - Permission issues
  - Data type mismatches
- System parameters for error handling:
  - `__conveyor_db_call_return_type_error__`: Identifies error type
  - `__conveyor_db_call_return_description__`: Detailed error description
- Position error handling nodes to the right of the Database Call node

## Using Semaphores in Database Call Nodes

Database Call nodes support both time and count semaphores to implement timeouts and concurrency
control:

### Time Semaphores

Time semaphores can be used to implement timeouts for database queries. If the query doesn't
complete within the specified time, the task is routed to a timeout node:

```json
"semaphors": [
  {
    "type": "time",
    "value": 120,
    "dimension": "sec",
    "to_node_id": "query_timeout_node_id"
  }
]
```

This provides a mechanism for handling long-running queries and preventing tasks from being stuck
indefinitely.

### Count Semaphores

Count semaphores can be used to implement concurrency control for database connections. If the
number of concurrent database calls reaches the threshold, new tasks are routed to an escalation
node:

```json
"semaphors": [
  {
    "type": "count",
    "value": 20,
    "esc_node_id": "db_connection_limit_node_id"
  }
]
```

This can be used to prevent database connection pool exhaustion and maintain optimal database
performance.

## Best Practices

- Use parameterized queries to avoid SQL injection risks
- Validate data types before insertion or updates
- Include proper error handling for all database calls
- Set reasonable timeouts based on the expected query execution time
- Use parameter mapping to transform data before sending
- Consider query optimization for high-volume processes
- Use descriptive node titles that indicate the database operation
- Implement comprehensive error handling with specific conditions for different error types
- Use double quotes for schema and table names in PostgreSQL queries
- Limit result sets to prevent memory issues with large datasets

## Node Naming Guidelines

When creating Database Call nodes in your processes:

1. **Node Titles** should:

   - Clearly indicate the specific database operation being performed (e.g., "Get Customer Records"
     rather than just "Database Call")
   - Reflect the purpose of the query in the context of your process
   - Be concise but descriptive enough to understand at a glance

2. **Node Descriptions** should:
   - Explain what data is being queried or modified
   - Mention any important input parameters used in the query
   - Document any specific error handling considerations
   - Include information about the expected result set

Example of good naming:

- Title: "Retrieve User Profile"
- Description: "Queries the users table for profile data using user_id. Returns user profile fields
  including name, email, and preferences."

Example of poor naming:

- Title: "DB Query"
- Description: "Gets data from database"

Meaningful titles and descriptions make processes more maintainable, easier to troubleshoot, and
more accessible to other team members.

## Configuration Example

This example demonstrates a basic Database Call Node configuration extracted from a real process. It
shows how to execute a simple SELECT query and includes the necessary error handling connection.

```json
{
  "id": "db_call_example", // Unique node ID (example uses "61d54616513aa04bc9681ac0")
  "obj_type": 0, // Object type for Logic node
  "condition": {
    "logics": [
      {
        "type": "db_call", // Specifies this is a Database Call logic block
        "err_node_id": "error_node_id", // ID of the node for error handling (example uses "61d5461682ba963bce6841cb")
        "instance_id": 227, // ID of the pre-configured database connection instance
        "query": "SELECT * FROM \"public\".\"alex\" LIMIT 100" // The SQL query to execute. Note the escaped quotes for schema/table names.
      },
      {
        "type": "go", // Logic block for the successful path
        "to_node_id": "success_node_id" // ID of the next node on successful query execution (example uses "61d5461682ba963bce6841cc")
      }
    ],
    "semaphors": [] // Optional semaphores for implementing timeouts or concurrency control
  },
  "title": "Fetch Alex Records", // Descriptive title (example node had empty title)
  "description": "Retrieves the first 100 records from the 'alex' table in the 'public' schema.", // Optional description
  "x": 660, // X coordinate on canvas
  "y": 200, // Y coordinate on canvas
  "extra": "{\"modeForm\":\"expand\",\"icon\":\"\"}", // UI settings
  "options": null // No specific options set
}
```

**Explanation:**

- **`type: "db_call"`**: Identifies the node's function.
- **`instance_id: 227`**: Specifies which configured database connection to use.
- **`query`**: Contains the SQL statement. Ensure proper syntax and escaping, especially for
  identifiers like table and schema names (e.g., `"public"."alex"`).
- **`err_node_id`**: Essential for routing tasks if the database call fails (connection error,
  syntax error, timeout, etc.).
- The `go` logic block defines the path for the task after the database query executes successfully.

## Default Configuration with Escalation Nodes

When creating a Database Call node in the Corezoid interface, the system automatically generates the
following default configuration:

```json
{
  "id": "db_call_node_id",
  "obj_type": 0,
  "condition": {
    "logics": [
      {
        "type": "db_call",
        "instance_id": null,
        "query": "",
        "err_node_id": "error_node_id"
      }
    ],
    "semaphors": []
  },
  "title": "Database Call",
  "description": "",
  "modeForm": "expand",
  "active": true
}
```

The default escalation pattern for Database Call nodes consists of:

1. **Condition Node** - Evaluates the type of error:

   - Checks `__conveyor_db_call_return_type_error__` for "hardware" or "software" errors
   - Routes tasks to appropriate handling paths

2. **Delay Node** - For hardware errors (connection issues, timeouts):

   - Implements a retry mechanism with configurable delay (default: 30 seconds)
   - Routes back to the original Database Call node after the delay

3. **Error End Node** - For software errors (SQL syntax errors, query execution failures):
   - Marks the task as failed
   - Provides error details for debugging

The escalation pattern is automatically positioned to the right of the Database Call node:

```
                                ┌─── [hardware error] ──→ Delay Node ──→ Back to Database Call
                                │
Database Call Node ──→ Condition Node ─┤
                                │
                                └─── [software error] ──→ Error End Node
```

To create this pattern automatically:

1. Select the Database Call node
2. Click on the error message that says "Node must be connected to an error-handling node"
3. Click "Create escalation nodes" button in the node properties panel
