import re

def clean_money(value):
    # Si Textract no devolvió nada, no podemos limpiar el monto.
    if value is None:
        return None

    text = str(value).strip()

    # Validación mínima: si no hay ningún dígito, es una etiqueta
    # como "Saldo final", no un monto.
    if not re.search(r"\d", text):
        return None

    # Dejamos solo números, comas, puntos y signo negativo.
    # Esto elimina "Bs.", espacios y otros símbolos.
    text = re.sub(r"[^0-9,.-]", "", text)

    # Caso boliviano frecuente: "10.400,00".
    # El punto es separador de miles y la coma es decimal.
    if "," in text and "." in text:
        text = text.replace(".", "").replace(",", ".")
    elif "." in text:
        parts = text.split(".")
        # Si el último grupo tiene 3 dígitos, asumimos punto de miles:
        # "500.000" -> "500000".
        if len(parts[-1]) == 3:
            text = "".join(parts)
    elif "," in text:
        parts = text.split(",")
        # Si la parte final tiene 2 dígitos, asumimos coma decimal:
        # "10400,00" -> "10400.00".
        if len(parts[-1]) == 2:
            text = "".join(parts[:-1]) + "." + parts[-1]
        else:
            text = "".join(parts)

    try:
        # Si después de limpiar queda un número válido, lo convertimos.
        return round(float(text), 2)
    except ValueError:
        # Si el texto sigue sin ser convertible, lo marcamos como faltante.
        return None

tests = [
    "Bs. 12.500",
    "Bs. 10.400,00",
    "12.500,00",
    "Bs. 2.100,00",
    "Bs. 18.700,00",
    "Bs. 14.450,00",
    "Bs. 500.000",
    "Bs. 185.000",
    "Saldo final",
    None,
]

for item in tests:
    print(f"{item!r} -> {clean_money(item)}")