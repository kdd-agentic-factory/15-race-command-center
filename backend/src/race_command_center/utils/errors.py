from fastapi import HTTPException


def not_found(resource: str, id: str) -> HTTPException:
    return HTTPException(status_code=404, detail=f"{resource} '{id}' not found")


def bad_request(message: str) -> HTTPException:
    return HTTPException(status_code=400, detail=message)


def service_unavailable(service: str) -> HTTPException:
    return HTTPException(status_code=503, detail=f"Upstream service '{service}' unavailable")
