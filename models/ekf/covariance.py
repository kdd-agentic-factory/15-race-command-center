def diagonal_covariance(size: int, value: float) -> list[list[float]]:
    return [[value if row == col else 0.0 for col in range(size)] for row in range(size)]


def trace(covariance: list[list[float]]) -> float:
    return sum(row[index] for index, row in enumerate(covariance))

