
import ujson.*

object Main {

  def main(args: Array[String]): Unit = {

    // Recibir JSON desde Python
    val entrada = scala.io.Source.stdin.mkString

    // Convertir JSON
    val json = ujson.read(entrada)

    // Obtener lista de pagos
    val pagos = json("pagos").arr

    // Agrupar pagos por año y mes (YYYY-MM)
    val resultado = pagos
      .groupBy { pago =>
        pago("fecha").str.substring(0, 7)
      }
      .toList
      .sortBy(_._1)
      .map { case (mes, lista) =>

        // Calcular ingresos del mes
        val total = lista.map(p => p("importe").num).sum

        Obj(
          "mes" -> mes,
          "total" -> total
        )
      }

    // Construir respuesta
    val respuesta = Obj(
      "reporte" -> "ingresos_mensuales",
      "resultados" -> Arr.from(resultado)
    )

    // Devolver JSON a Python
    println(ujson.write(respuesta))
  }
}
