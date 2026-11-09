import json
import subprocess

from pathlib import Path


DIRECTORIO = Path(__file__).resolve().parent

ARCHIVO_REGLAS = DIRECTORIO / "reglas.pl"

SWIPL = r"C:\Program Files\swipl\bin\swipl.exe"


class MotorProlog:

    @staticmethod
    def evaluar_ingreso(
        estado_socio: str,
        estado_membresia: str,
        pagos_al_dia: bool
    ) -> dict:

        datos = {
            "estado_socio": estado_socio.lower(),
            "estado_membresia": estado_membresia.lower(),
            "pagos_al_dia": "si" if pagos_al_dia else "no"
        }

        try:
            proceso = subprocess.run(
                [
                    SWIPL,
                    "-q",
                    "-s", str(ARCHIVO_REGLAS),
                    "-g", "main",
                    "-t", "halt"
                ],
                input=json.dumps(datos),
                capture_output=True,
                text=True,
                encoding="utf-8",
                timeout=10
            )

            if proceso.returncode != 0:
                raise RuntimeError(proceso.stderr)

            return json.loads(proceso.stdout)

        except subprocess.TimeoutExpired:
            raise RuntimeError(
                "El motor Prolog excedió el tiempo de ejecución."
            )

        except (subprocess.SubprocessError, json.JSONDecodeError) as error:
            raise RuntimeError(
                f"Error al comunicarse con Prolog: {error}"
            )