import re
from datetime import datetime

MONTHS = {
    "enero": "01",
    "febrero": "02",
    "marzo": "03",
    "abril": "04",
    "mayo": "05",
    "junio": "06",
    "unio": "06",
    "julio": "07",
    "agosto": "08",
    "septiembre": "09",
    "setiembre": "09",
    "octubre": "10",
    "noviembre": "11",
    "diciembre": "12",
}

def clean_date(value):
    # Si el campo no existe o fue descartado por confianza, no hay fecha.
    if value is None:
        return None

    text = str(value).strip().lower()

    # Primero probamos formatos numéricos comunes.
    for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
        try:
            return datetime.strptime(text, fmt).date().isoformat()
        except ValueError:
            pass

    # Luego probamos fechas textuales en español:
    # "12 de Febrero de 1983".
    match = re.search(r"(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})", text)
    if match:
        day, month_name, year = match.groups()
        month = MONTHS.get(month_name)
        if month:
            return f"{year}-{month}-{int(day):02d}"

    # Si no reconocemos el formato, dejamos el campo como faltante.
    return None

tests = [
    "12 de Febrero de 1983",
    "2 de unio de 2031",
    "15/05/2026",
    "2026-05-15",
    None,
]

for item in tests:
    print(f"{item!r} -> {clean_date(item)}")