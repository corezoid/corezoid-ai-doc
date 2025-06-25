# Sum Node

## Purpose

- Aggregates numeric values from incoming tasks under a unique **SumID**.
- Often used for statistics (e.g., total transaction amounts).

## Parameters

### Required

1. **SumID** (String)
   - Unique identifier for the sum operation.
2. **Parameter to sum** (String)
   - The numeric field key in tasks.

### Optional

1. **Reset on interval**
   - Clears cumulative sums after a set time.
2. **Alert threshold**
   - Notifies if the sum exceeds a limit.

## Error Handling

- Non-numeric data ignored or triggers partial error.
- Extremely large sums can exceed numeric boundaries.

## Best Practices

- Ensure the parameter to sum contains numeric values
- Use descriptive SumID values for easy identification
- Consider setting reset intervals for long-running processes
- Configure alert thresholds for important metrics
- Monitor sum operations for unexpected values
- Include proper error handling for non-numeric data

## Node Naming Guidelines

When creating Sum nodes in your processes:

1. **Node Titles** should:

   - Clearly indicate what is being summed (e.g., "Sum Transaction Amounts" rather than just "Sum")
   - Reflect the purpose of the aggregation in the context of your workflow
   - Be concise but descriptive enough to understand at a glance

2. **Node Descriptions** should:
   - Explain what values are being summed and why
   - Mention the SumID and its significance
   - Document any specific threshold or reset considerations
   - Include information about how the sum will be used

Example of good naming:

- Title: "Calculate Daily Sales Total"
- Description: "Aggregates all transaction amounts with SumID 'daily_sales'. Resets at midnight and
  alerts if total exceeds $100,000."

Example of poor naming:

- Title: "Sum"
- Description: "Adds numbers"

Meaningful titles and descriptions make processes more maintainable, easier to troubleshoot, and
more accessible to other team members.

## Configuration Example

This example demonstrates a Sum Node configuration extracted from a real process
(`1646228_Simple_sum.conv.json`). It shows how to sum values from an incoming task parameter.

```json
{
  "id": "67f9415d82ba966c7fbc3166", // Unique node ID
  "obj_type": 0, // Object type for Logic node
  "condition": {
    "logics": [
      {
        "type": "api_sum", // Specifies this is a Sum logic block
        "extra": [
          // Array defining the sum operation
          {
            "id": "1744388449151", // Internal ID for this sum operation
            "name": "sum", // The SumID (identifier for this specific sum)
            "value": "{{count}}" // The parameter from the task data to sum (dynamically referenced)
          }
        ]
        // Note: Reset interval and alert threshold are not configured here
      },
      {
        "type": "go", // Logic block for the path after the sum operation
        "to_node_id": "67f9415882ba966c7fbc2dd3" // ID of the next node (Final node in this example)
      }
    ],
    "semaphors": [] // No semaphores used in this node
  },
  "title": "", // Title was empty in the example, should be descriptive (e.g., "Sum Item Counts")
  "description": "", // Optional description
  "x": 624, // X coordinate on canvas
  "y": 212, // Y coordinate on canvas
  "extra": "{\"modeForm\":\"expand\",\"icon\":\"\"}", // UI settings
  "options": null // No specific options set
}
```

**Explanation:**

- **`type: "api_sum"`**: Identifies the node's function.
- **`extra`**: This array contains the configuration for the sum operation.
  - **`id`**: An internal identifier for this specific sum configuration within the node.
  - **`name: "sum"`**: This is the **SumID**. It uniquely identifies this aggregation. Tasks passing
    through this node will contribute to the sum identified by "sum".
  - **`value: "{{count}}"`**: Specifies that the value of the `count` parameter from the incoming
    task data should be added to the sum identified by the SumID "sum".
- The `go` logic block defines where the task proceeds _after_ its value has been added to the sum.
- The aggregated sum associated with the SumID "sum" can potentially be accessed elsewhere (e.g., in
  reports or other processes), depending on the overall system configuration.
