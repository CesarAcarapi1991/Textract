def get_value(section, alias, threshold=80):
    # Busca un campo dentro de una sección del expediente limpio por Clase 3.
    item = (section or {}).get(alias)

    # Si el campo viene con value/confidence, aplicamos umbral.
    if isinstance(item, dict):
        if float(item.get("confidence") or 0) < threshold:
            # La respuesta existe, pero no es suficientemente confiable.
            return None
        return item.get("value")

    # Si ya era un valor simple, lo devolvemos tal cual.
    return item

employment = {
    "employee_name": {"value": "JAIME RONNY RIVERA ROJAS", "confidence": 88},
    "employer_name": {"value": "Tecnologias Integrales del Sur S.R.L", "confidence": 49},
    "declared_salary": {"value": "Bs. 12.500", "confidence": 50},
}

for field in ["employee_name", "employer_name", "declared_salary"]:
    print(f"{field} -> {get_value(employment, field)}")