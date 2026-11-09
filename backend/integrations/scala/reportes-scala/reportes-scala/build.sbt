val scala3Version = "3.10.0"

lazy val root = project
  .in(file("."))
  .settings(
    name := "reportes-scala",
    version := "0.1.0-SNAPSHOT",

    scalaVersion := scala3Version,

    libraryDependencies += "org.scalameta" %% "munit" % "1.3.6" % Test,
    libraryDependencies += "com.lihaoyi" %% "ujson" % "4.3.2"
  )
