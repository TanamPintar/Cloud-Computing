## Authentication

## Register

- Endpoint :
    - /signup
- Method :
    - POST
- Header :
    - Content-Type: application/json
    - Accept: application/json
- Body :
```json 
{
    "name"      : "string, no whistespace, alphanumeric, required",
    "email"     : "string, email, required",
    "password"  : "string, min:8, required",
}
```
- Response :
    - If Success
    ```json 
    {
        "status"    : "success",
        "data"      : {
            "id": "string UUID",
            "name": "string",
            "token": "string jwt",
        }
    }
    ```

    - If Failed
    ```json 
    {
        "status"    : "failed",
        "message"   : "error message",
    }
    ```

## Login

- Endpoint :
    - /signup
- Method :
    - POST
- Header :
    - Content-Type: application/json
    - Accept: application/json
- Body :
```json 
{
    "email"     : "string, email, required",
    "password"  : "string, min:8, required",
}
```
- Response :
    - If Success
    ```json 
    {
        "status"    : "success",
        "data"      : {
            "id": "string UUID",
            "token": "string jwt",
        }
    }
    ```

    - If Failed
    ```json 
    {
        "status"    : "failed",
        "message"   : "error message",
    }
    ```

## Soils - Get All

- Endpoint :
    - /soils/
- Method :
    - POST
- Header :
    - Content-Type: application/json
    - Accept: application/json
- Response :
    - If Success
    ```json 
    {
        "status"    : "success",
        "data"      : {
            "<soil_id>": {
                "soil_name": "<soil_name>",
                "description": "<description>",
                "image_url": "<image_url>"
            },
            "<soil_id>": {
                "soil_name": "> soil_name <",
                "description": "> description <",
                "image_url": "> image_url <"
            },
            ...
        }
    }
    ```

    - If Failed
    ```json 
    {
        "status"    : "failed",
        "message"   : "error message",
    }
    ```

## Soils - Get Soil By ID

- Endpoint :
    - /soils/:id
- Method :
    - POST
- Header :
    - Content-Type: application/json
    - Accept: application/json
- Response :
    - If Success
    ```json 
    {
        "status"    : "success",
        "data"      : {
            "id": "<soil_id>",
            "soil_name": "<soil_name>",
            "description": "<description>",
            "image_url": "<image_url>"
        }
    }
    ```

    - If Failed
    ```json 
    {
        "status"    : "failed",
        "message"   : "error message",
    }
    ```

## Plants - Get All Plants

- Endpoint :
    - /plants/
- Method :
    - POST
- Header :
    - Content-Type: application/json
    - Accept: application/json
- Response :
    - If Success
    ```json 
    {
        "status"    : "success",
        "data"      : {
            "<plant_id>": {
                "plant_name": "<plant_name>",
                "description": "<description>",
                "image_url": "<image_url>"
            },
            "<plant_id>": {
                "plant_name": "> plant_name <",
                "description": "> description <",
                "image_url": "> image_url <"
            },
            ...
        }
    }
    ```

    - If Failed
    ```json 
    {
        "status"    : "failed",
        "message"   : "error message",
    }
    ```

## Soils - Get Plant By ID

- Endpoint :
    - /plants/:id
- Method :
    - POST
- Header :
    - Content-Type: application/json
    - Accept: application/json
- Response :
    - If Success
    ```json 
    {
        "status"    : "success",
        "data"      : {
            "id": "<plant_id>",
            "plant_name": "<plant_name>",
            "description": "<description>",
            "image_url": "<image_url>"
        }
    }
    ```

    - If Failed
    ```json 
    {
        "status"    : "failed",
        "message"   : "error message",
    }
    ```
<br>