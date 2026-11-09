
import json
import os
import subprocess
from pathlib import Path


# ==========================================
# CONFIGURACION
# ==========================================

DIRECTORIO = Path(__file__).resolve().parent

SBT = (
    Path.home()
    / "AppData"
    / "Local"
    / "Coursier"
    / "data"
    / "bin"
    / "sbt.bat"
)

RUTA_PROYECTO = DIRECTORIO / "reportes-scala" / "reportes-scala"


# ==========================================
# DATOS DE PRUEBA
# ==========================================

datos = {
    "pagos": [
        {
            "codigo": "P001",
            "fecha": "2026-01-10",
            "importe": 100.0
        },
        {
            "codigo": "P002",
            "fecha": "2026-01-15",
            "importe": 150.0
        },
        {
            "codigo": "P003",
            "fecha": "2026-02-05",
            "importe": 120.0
        },
        {
            "codigo": "P004",
            "fecha": "2026-02-20",
            "importe": 200.0
        }
    ]
}


# ==========================================
# EJECUCION DE SCALA
# ==========================================

def ejecutar_scala():

    if not SBT.exists():
        raise FileNotFoundError(f"No se encontro SBT: {SBT}")

    if not (RUTA_PROYECTO / "build.sbt").exists():
        raise FileNotFoundError(
            f"No se encontro build.sbt: {RUTA_PROYECTO}"
        )

    entorno = os.environ.copy()

    entorno["PATH"] = (
        entorno.get("PATH", "")
        + os.pathsep
        + str(SBT.parent)
    )

    try:

        proceso = subprocess.run(
            [
                "cmd",
                "/c",
                str(SBT),
                "run"
            ],
            cwd=RUTA_PROYECTO,
            input=json.dumps(datos),
            capture_output=True,
            text=True,
            encoding="utf-8",
            env=entorno,
            timeout=120
        )

        print("\n========== STDOUT ==========")
        print(proceso.stdout)

        print("\n========== STDERR ==========")
        print(proceso.stderr)

        # Detectar errores de compilacion o ejecucion
        if proceso.returncode != 0 or "[error]" in proceso.stdout:
            raise RuntimeError("Scala termino con errores.")

        # Buscar la linea que contiene el JSON de respuesta
        lineas = proceso.stdout.splitlines()

        respuesta_json = next(
            (
                linea.strip()
                for linea in reversed(lineas)
                if linea.strip().startswith("{")
                and linea.strip().endswith("}")
            ),
            None
        )

        if respuesta_json is None:
            raise ValueError("Scala no devolvio una respuesta JSON.")

        resultado = json.loads(respuesta_json)

        print("\n========== REPORTE GENERADO ==========")

        print(
            json.dumps(
                resultado,
                indent=4,
                ensure_ascii=False
            )
        )

        return resultado

    except subprocess.TimeoutExpired:
        raise TimeoutError("Scala excedio el tiempo de ejecucion.")


# ==========================================
# PUNTO DE ENTRADA
# ==========================================

if __name__ == "__main__":

    try:
        ejecutar_scala()

    except Exception as error:
        print(f"\nError: {error}")
