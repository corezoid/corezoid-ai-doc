# Common Validation Errors in Corezoid Process JSON Files

This document outlines common validation errors encountered when creating or modifying Corezoid
process JSON files and provides solutions to prevent them.

## "Invalid scheme" Error

The "Invalid scheme" error is a common validation error that occurs when uploading a process to
Corezoid. This error indicates that the JSON structure of your process does not conform to the
expected schema. Below are the most common causes and solutions:

### 1. Process Structure Issues

#### Root Level Structure

Corezoid processes must be defined as objects, not arrays:

```json
// CORRECT
{
  "obj_type": 1,
  "obj_id": 2000001,
  "parent_id": 0,
  "title": "Process Title",
  "status": "active",
  "params": [],
  "scheme": {
    // Process scheme with nodes
  }
}
```

#### Required Properties

Ensure all required properties are present at the root level:

- `obj_type`
- `obj_id`
- `parent_id`
- `title`
- `status`
- `params`
- `scheme`

### 2. Node ID Issues

#### Node ID Format

All node IDs must be exactly 24 characters long and consist of hexadecimal digits (0-9, a-f):

```json
// INCORRECT
"id": "start_node",

// CORRECT
"id": "abcdef0123456789abcdef01",
```

#### Node ID References

All references to node IDs (such as `to_node_id`, `err_node_id`) must also be 24 characters long:

```json
// INCORRECT
"to_node_id": "validate_input",

// CORRECT
"to_node_id": "abcdef0123456789abcdef02",
```



### 3. Node Configuration Issues

#### Missing Required Properties

Each node must include all required properties:

- `id`
- `obj_type`
- `condition`
- `title`
- `x`
- `y`

#### Condition Structure

The `condition` property must include both `logics` and `semaphors` arrays:

```json
// INCORRECT
"condition": {
  "logics": [
    // logic definitions
  ]
}

// CORRECT
"condition": {
  "logics": [
    // logic definitions
  ],
  "semaphors": []
}
```

#### Error Node References

All nodes that can fail (such as Code nodes, API Call nodes, Set Parameter nodes) must include an
`err_node_id` reference:

```json
// INCORRECT
{
  "type": "api_code",
  "lang": "js",
  "src": "// JavaScript code"
}

// CORRECT
{
  "type": "api_code",
  "lang": "js",
  "src": "// JavaScript code",
  "err_node_id": "abcdef0123456789abcdef15"
}
```

### 4. Parameter Configuration Issues

#### Extra and ExtraType Mismatch

All parameters defined in `extra` must have corresponding entries in `extra_type` and vice versa:

```json
// INCORRECT
"extra": {
  "param1": "value1",
  "param2": "value2"
},
"extra_type": {
  "param1": "string"
}

// CORRECT
"extra": {
  "param1": "value1",
  "param2": "value2"
},
"extra_type": {
  "param1": "string",
  "param2": "string"
}
```

#### Data Type Mismatch

The data types specified in `extra_type` must match the actual data types in `extra`:

```json
// INCORRECT
"extra": {
  "param1": "[1, 2, 3]"
},
"extra_type": {
  "param1": "string"
}

// CORRECT
"extra": {
  "param1": "[1, 2, 3]"
},
"extra_type": {
  "param1": "array"
}
```

### 5. JSON Formatting Issues

#### Proper JSON Escaping

Ensure proper escaping of quotes and special characters in JSON strings:

```json
// INCORRECT
"extra": "{\"key\":\"value with \"quotes\" inside\"}",

// CORRECT
"extra": "{\"key\":\"value with \\\"quotes\\\" inside\"}",
```

#### Consistent Indentation

Use consistent indentation throughout the JSON file to improve readability and reduce errors:

```json
// INCORRECT
{
"property1": "value1",
    "property2": "value2"
}

// CORRECT
{
  "property1": "value1",
  "property2": "value2"
}
```

### 6. Parameter Validation Best Practices

#### Avoid Redundant Validation for Required Parameters

When a parameter is marked as `required` in the parameter definition, there is no need to add
explicit validation checks for its existence in the process flow:

```json
// INCORRECT - Redundant validation
{
  "params": [
    {
      "name": "input_param",
      "type": "string",
      "flags": ["required", "input"]
    }
  ],
  "scheme": {
    "nodes": [
      // Node that checks if input_param exists
      {
        "title": "Validate Input",
        "condition": {
          "logics": [
            {
              "type": "go_if_const",
              "conditions": [
                {
                  "fun": "eq",
                  "const": "",
                  "param": "input_param",
                  "cast": "string"
                }
              ]
            }
          ]
        }
      }
    ]
  }
}

// CORRECT - No redundant validation
{
  "params": [
    {
      "name": "input_param",
      "type": "string",
      "flags": ["required", "input"]
    }
  ],
  "scheme": {
    "nodes": [
      // Process the input directly without checking if it exists
    ]
  }
}
```

The Corezoid API will not allow tasks to be sent to a process if any required parameters are
missing, making explicit validation checks redundant and unnecessarily complex.

## Validation Tools

To prevent "Invalid scheme" errors, use the following validation tools:

1. **Schema Validation**: Use the npm script to validate your process JSON against the schema:

   ```bash
   npm run validate:schema
   ```

2. **JSON Formatting**: Use the npm script to format your JSON files:

   ```bash
   npm run format
   ```

3. **Node Repositioning**: Use the npm script to automatically position nodes according to best
   practices:
   ```bash
   npm run reposition-nodes
   ```

## Related Documentation

- [UUID and Node ID Validation Requirements](uuid-validation-requirements.md)
- [Process Schema](process-schema.json)
- [Node Positioning Best Practices](node-positioning-best-practices.md)
- [Best Practices for Building Fast and Effective Processes](best-practices.md)
