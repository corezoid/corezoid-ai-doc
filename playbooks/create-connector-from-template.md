# Creating a Corezoid Connector from Template

## 1. General Concept

This playbook describes creating a Corezoid connector using the existing template `templates/connector.json`. The template provides a pre-built process structure that only requires modification of two specific nodes: "Prepare Request" and "API Call".

The user must specify the following parameters:
- API_URL
- API_LOGIN
- API_SECRET
- WORKSPACE_ID
- PROC_ID

All these parameters must be passed when calling the convctl.sh command.

---

## 2. =� Template Structure

The template `templates/connector.json` contains a complete process with all necessary nodes:

1. **Start** - process entry point
2. **Prepare Request** - data preparation node (MODIFY THIS)
3. **API Call** - external API call (MODIFY THIS) 
4. **Reply** - successful response
5. **Reply Error** - error responses
6. **Final** - successful completion
7. **Error nodes** - error handling

**IMPORTANT**: Only modify the "Prepare Request" and "API Call" nodes. All other nodes should remain unchanged.

---

## 3. 🔧 Required Modifications

### 3.1 Process Parameters Configuration

**IMPORTANT**: You must configure the `params` field in the root process object to define all incoming parameters that the user should pass when calling the process.

```json
{
  "obj_type": 1,
  "title": "My API Connector",
  "params": [
    {
      "id": "userId",
      "name": "User ID",
      "type": "string",
      "required": true
    },
    {
      "id": "email",
      "name": "Email Address", 
      "type": "string",
      "required": false
    }
  ],
  "scheme": {
    "nodes": [...]
  }
}
```

👉 params - all incoming parameters that the user should pass when calling the process. More details: [process-with-parameters.md](./docs/process/process-with-parameters.md)

### 3.2 "Prepare Request" Node Modifications

In the `api_code` logic, you must set the following required fields:

```javascript
// Required fields that MUST be set:
data.url = ""; // Set the base API URL
data.pathAndQuery = ""; // Set the path and query parameters
data.requestBody = {}; // Set request body for POST/PUT methods
```

**Example for GET request:**
```javascript
data.url = "https://api.example.com";
data.pathAndQuery = "/users/" + data.userId;
data.requestBody = {}; // Empty for GET
```

**Example for POST request:**
```javascript
data.url = "https://api.example.com";
data.pathAndQuery = "/users";
data.requestBody = {
    name: data.name,
    email: data.email
};
```

### 3.3 "API Call" Node Modifications

Modify the API call configuration:

```json
{
  "type": "api",
  "rfc_format": true,
  "format": "",
  "content_type": "application/json",
  "method": "GET", // Change to appropriate method (GET, POST, PUT, DELETE)
  "url": "{{url}}{{pathAndQuery}}", // Use prepared values
  "extra_headers": {
    "content-type": "application/json", // Adjust as needed
    "Authorization": "Bearer {{API_TOKEN}}" // Add auth headers if needed
  },
  "cert_pem": "",
  "max_threads": 5,
  "send_sys": false,
  "debug_info": true,
  "err_node_id": "68602771e552e82315e085e9",
  "customize_response": true,
  "response": {
    "responseHeaders": "{{header}}",
    "responseBody": "{{body}}"
  },
  "response_type": {
    "responseHeaders": "object",
    "responseBody": "object"
  },
  "version": 2,
  "is_migrate": true
}
```

**For POST/PUT requests**, add the request body:
```json
{
  "raw_body": "{{requestBody}}",
  "format": "raw"
}
```

---

## 4. =� Implementation Steps

1. **Copy the template**: Start with `templates/connector.json`
2. **Configure parameters**: Define all incoming parameters in `params`
3. **Analyze the API**: Understand the target API structure
4. **Modify "Prepare Request"**: Set `data.url`, `data.pathAndQuery`, and `data.requestBody`
5. **Modify "API Call"**: Update method, headers, and body configuration
6. **Test the connector**: Use convctl.sh to validate

---

## 5. =� Key Requirements

| Element | Requirement |
|:--------|:------------|
| Template base | Must use `templates/connector.json` |
| Process params | Must configure incoming parameters |
| Nodes to modify | Only "Prepare Request" and "API Call" |
| Required fields | `data.url`, `data.pathAndQuery`, `data.requestBody` |
| API Call method | Must match the target API requirements |
| Error handling | Pre-configured, do not modify |

---

## 6. >� Testing Instructions

After creating the connector from template:

### 6.1 =� Save the Process
Save the modified process to:
```bash
~/repos/corezoid-ai-doc/.processes/my_api_process.json
```

### 6.2 =
 Test the Process
```bash
API_URL=<API_URL> API_LOGIN=<API_LOGIN> API_SECRET=<API_SECRET> WORKSPACE_ID=<WORKSPACE_ID> ./convctl.sh run-process <PROC_ID> ~/repos/corezoid-ai-doc/.processes/my_api_process.json <task_data>
```

**Example:**
```bash
API_URL=https://admin.corezoid.com API_LOGIN=123 API_SECRET=123 WORKSPACE_ID=123 ./convctl.sh run-process 123 ~/repos/corezoid-ai-doc/.processes/my_api_process.json '{"userId":"123"}'
```

---


Only focus on the API-specific logic in the two designated nodes.

---

## 8. =� Related Documentation
- [Original Connector Guide](./playbooks/create-connector.md)
- [Template File](./templates/connector.json)
- [Node Documentation](./docs/nodes/)