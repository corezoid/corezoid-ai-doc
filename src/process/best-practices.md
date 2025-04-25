# Best Practices for Building Fast and Effective Corezoid Processes

This document outlines best practices for designing, implementing, and optimizing Corezoid processes
for maximum performance and reliability.

## Process Design Principles

### 1. Minimize Node Count

- **Keep processes lean**: Each node adds processing overhead. Consolidate logic where possible.
- **Use Set Parameters nodes** instead of multiple Code nodes for simple data transformations.
- **Combine related operations** into a single Code node rather than using multiple nodes.

### 2. Optimize Data Flow

- **Filter early**: Use Condition nodes early in the process to filter out tasks that don't need
  processing.
- **Transform data strategically**: Only transform data when necessary and as close as possible to
  where it's needed.
- **Minimize data payload**: Only keep data fields that are required for downstream processing.

### 3. Error Handling Strategy

- **Implement dedicated error paths**: Create specific error handling flows for different error
  types.
- **Position error nodes consistently**: Place error handling nodes to the right of the main process
  flow.
- **Distinguish between hardware and software errors**:
  - Hardware errors (network issues, timeouts): Implement retry mechanisms with Delay nodes.
  - Software errors (bad requests, validation failures): Route to appropriate error handling without
    retries.
- **Use consistent node visualization**:
  - Normal flow nodes should be expanded (`"modeForm": "expand"`) for better visibility of the main
    process flow.
  - Error handling nodes should be collapsed (`"modeForm": "collapse"`) to visually distinguish them
    from the main flow.
  - This visual distinction helps maintain clarity in complex processes with multiple error paths.

## Node-Specific Optimization

### API Call Nodes

- **Use API Call V2 nodes** for better performance and more features.
- **Implement timeouts** appropriate to the expected response time of the external service.
- **Use connection pooling** for repeated calls to the same service.
- **Follow the API Call with Reply Pattern**:
  - After an API Call node, always add a "Reply to Process" node to return the data.
  - This ensures proper data flow and response handling.

### Code Nodes

- **Keep code efficient**:
  - Avoid deep recursion and complex loops.
  - Use built-in functions where available instead of custom implementations.
  - Minimize library imports to only what's necessary.
- **Implement proper error handling** with try/catch blocks.
- **Set appropriate timeouts** based on the complexity of your code:
  - Simple transformations: 1000ms (default)
  - Complex calculations: 2000-5000ms
  - Very complex operations: Up to 10000ms (use with caution)
- **Each Code node should have its own dedicated error node** for better error isolation.

### Set Parameters Nodes

- **Use built-in functions** like `$.math()`, `$.random()`, and `$.date()` instead of Code nodes for
  simple operations.
- **Batch parameter settings** in a single node rather than using multiple Set Parameters nodes.
- **Use appropriate data types** in the `extra_type` field to ensure proper type conversion.

### Condition Nodes

- **Place critical conditions early** in the process flow to filter tasks quickly.
- **Use simple conditions** where possible instead of complex expressions.
- **Avoid redundant condition checks** by consolidating related conditions.

### Delay Nodes

- **Implement progressive retry mechanisms** with increasing delays for external service calls.
- **Use exponential backoff** for retry attempts:
  - First retry: short delay (e.g., 30 seconds)
  - Subsequent retries: progressively longer delays
- **Set reasonable maximum retry counts** to prevent indefinitely stuck tasks.

## Performance Optimization Techniques

### 1. Task Size Management

- **Monitor task size**: Keep task data under 2MB to avoid performance issues.
- **Prune unnecessary data**: Remove temporary or debugging data before task completion.
- **Use task validation** to catch oversized tasks early:
  ```erlang
  MaxTaskSize = api_logics_helper:get_max_task_size(ConvId),
  task_validation:validate_tasksize(TaskData, MaxTaskSize),
  ```

### 2. Asynchronous Processing

- **Use Queue nodes** for operations that don't need immediate processing.
- **Implement asynchronous patterns** for long-running operations:
  ```
  API Call → Queue Node → ... → Get from Queue Node → Process Result
  ```
- **Balance load** by distributing tasks across multiple processes.

### 3. Caching Strategy

- **Cache frequently used data** using Set Parameters nodes.
- **Implement TTL (Time-To-Live)** for cached data to ensure freshness.
- **Use process parameters** for configuration values instead of hardcoding them in nodes.

## Process Testing and Validation

### 1. Incremental Testing

- **Test each node individually** before connecting them in a process.
- **Use sample tasks** with representative data for testing.
- **Validate error paths** by deliberately triggering errors.

### 2. Performance Testing

- **Measure execution time** for critical paths.
- **Test with realistic load** to identify bottlenecks.
- **Monitor memory usage** during process execution.

### 3. Monitoring in Production

- **Implement logging** at key points in the process.
- **Track execution times** for performance-critical nodes.
- **Set up alerts** for abnormal process behavior.

## Real-World Optimization Examples

### Example 1: Optimizing an API-Heavy Process

**Before Optimization:**

```
Start → API Call 1 → Set Parameters → API Call 2 → Set Parameters → API Call 3 → End
```

**After Optimization:**

```
Start → Set Parameters (prepare all API calls) → API Call 1 → API Call 2 → API Call 3 → Set Parameters (process all results) → End
```

**Benefits:**

- Reduced node count
- More efficient data transformation
- Better error handling

### Example 2: Implementing Retry Logic

**Before Optimization:**

```
Start → API Call → Condition (success?) → End
                              ↓
                            Error End
```

**After Optimization:**

```
Start → API Call → Condition (success?) → End
                       ↓
                  Condition (hardware error?) → Delay → API Call
                       ↓
                  Error End
```

**Benefits:**

- Resilient to transient failures
- Automatic recovery from network issues
- Clear distinction between error types

## Best Practices Checklist

Use this checklist when designing and implementing Corezoid processes:

- [ ] Process has minimal node count
- [ ] Error handling is implemented for all critical nodes
- [ ] Data payload is kept to a minimum
- [ ] API calls have appropriate timeouts
- [ ] Code nodes have try/catch blocks
- [ ] Set Parameters nodes use built-in functions where appropriate
- [ ] Condition nodes are positioned early in the flow
- [ ] Retry logic is implemented for external service calls
- [ ] Task size is monitored and managed
- [ ] Asynchronous processing is used for non-critical operations
- [ ] Process has been tested with representative data
- [ ] Performance metrics are tracked

## Related Documentation

- [Process Overview](README.md) - Definition, operational mechanics, and key features of Corezoid
  processes
- [Set Parameters Built-in Functions](../nodes/set-parameters-built-in-functions.md) - Documentation
  of built-in functions
- [Code Node Libraries and Usage](../nodes/code-node-libraries.md) - Documentation of available
  libraries and usage patterns
