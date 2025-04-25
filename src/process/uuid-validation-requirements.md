# Node ID Validation Requirements

This document outlines the validation requirements for node IDs in Corezoid process JSON files.

## Node ID Requirements

When creating or modifying process JSON files, all node IDs must be exactly 24 bytes in length. This
applies to:

1. The `id` field of each node
2. All references to node IDs (such as `to_node_id`, `err_node_id`, etc.)

### Valid Node ID Format

A valid node ID must be a 24-character hexadecimal string:

```
xxxxxxxxxxxxxxxxxxxxxxxx
```

Where:

- `x` is any hexadecimal digit (0-9, a-f)

Example of a valid node ID:

```
67f4c3f482ba966c7fc7e5d6
```

### Common Node ID Validation Errors

If you encounter the following errors when uploading a process:

```
"Key 'to_node_id'. 'Value is not valid. Value's byte_size is less than minimum allowed: 24'"
"Key 'to_node_id'. 'Value is not valid. Value's byte_size is more than maximum allowed: 24'"
```

This indicates that one or more node IDs in your process JSON file are not exactly 24 bytes in
length.

## Extra and ExtraType Parameter Requirements

When configuring nodes with parameters, you must ensure that:

1. All parameters defined in `extra` have corresponding entries in `extra_type`
2. All entries in `extra_type` have corresponding parameters in `extra`
3. The data types in `extra_type` match the actual data types of the values in `extra`

### Common Extra/ExtraType Validation Errors

If you encounter the following error when uploading a process:

```
Wrong params in extra or extraType
```

This indicates that there is a mismatch between the `extra` and `extra_type` objects in one or more
nodes. Check:

1. That all keys in `extra` exist in `extra_type` and vice versa
2. That the data types specified in `extra_type` match the actual data types in `extra`
3. That all required parameters for the node type are present in both `extra` and `extra_type`

## Node Type-Specific Requirements

### Call Process Nodes

When creating Call Process nodes (nodes that call another process), you must use the following
structure:

```json
{
  "type": "api_rpc",
  "conv_id": "{{process_id_to_call}}",
  "wait_for_reply": true,
  "extra": {
    "param1": "value1",
    "param2": "value2"
  },
  "extra_type": {
    "param1": "string",
    "param2": "number"
  },
  "err_node_id": "error_node_id"
}
```

Common validation errors for Call Process nodes:

- Using `"type": "call_process"` instead of `"type": "api_rpc"`
- Using `data` and `data_type` instead of `extra` and `extra_type`
- Missing the required `err_node_id` parameter

### Set Parameters Nodes

All Set Parameters nodes must include an `err_node_id` parameter pointing to an error handling node:

```json
{
  "type": "set_param",
  "extra": {
    "param1": "value1"
  },
  "extra_type": {
    "param1": "string"
  },
  "err_node_id": "error_node_id"
}
```

## Generating Valid Values

### Generating Valid Node IDs

When creating new process JSON files, you can generate valid 24-byte node IDs using:

1. MongoDB ObjectID generators
2. Custom functions that generate 24-character hexadecimal strings
3. Command line tools (e.g., `openssl rand -hex 12` on Linux/macOS)

## Related Documentation

- [Process Schema](process-schema.json) - JSON schema for Corezoid processes
- [Process JSON Validation](process-json-validation.md) - Detailed validation requirements
- [Best Practices for Building Fast and Effective Processes](best-practices.md) - Optimization
  techniques
