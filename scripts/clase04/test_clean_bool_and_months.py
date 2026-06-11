import re

def clean_bool(value):
    # Si no hay valor, no asumimos verdadero ni falso.
    if value is None:
        return None

    text = str(value).strip().lower()

    # Negaciones directas.
    if text in ["no", "false", "falso"]:
        return False

    # Frases negativas que contienen palabras como "mora".
    # Deben evaluarse antes de buscar la palabra "mora".
    if any(phrase in text for phrase in ["sin mora", "sin atraso", "no registra mora"]):
        return False

    # Afirmaciones directas.
    if text in ["si", "sí", "yes", "true", "verdadero"]:
        return True

    # Si aparece mora, atraso o default sin negación, lo tratamos como riesgo.
    if any(word in text for word in ["mora", "vencido", "atraso", "default"]):
        return True

    # Si no podemos inferirlo, no inventamos un booleano.
    return None

def clean_months(value):
    # El plazo puede venir como "240 meses", "20 años" o mixto.
    if value is None:
        return None

    text = str(value).lower()

    # Priorizamos el número entre paréntesis porque suele ser el dato exacto:
    # "20 anos (240 meses)" -> 240.
    match = re.search(r"\((\d+)\s*mes", text)
    if match:
        return int(match.group(1))

    # Si viene en años, lo convertimos a meses.
    years = re.search(r"(\d+)\s*(anos|años|anios|years)", text)
    if years:
        return int(years.group(1)) * 12

    # Si ya viene en meses, usamos ese número.
    months = re.search(r"(\d+)\s*(mes|meses|months)", text)
    if months:
        return int(months.group(1))

    # Si no detectamos plazo, lo dejamos faltante.
    return None

print("clean_bool")
for item in ["No", "Sí", "Tiene mora", "Sin mora", None]:
    print(f"{item!r} -> {clean_bool(item)}")

print("\nclean_months")
for item in ["20 anos (240 meses)", "5 años", "18 meses", None]:
    print(f"{item!r} -> {clean_months(item)}")