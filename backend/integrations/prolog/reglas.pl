% ==========================================
% MOTOR DE REGLAS - SISTEMA DE GIMNASIO
% ==========================================

% ------------------------------------------
% 1. CONDICIONES VALIDAS
% ------------------------------------------

socio_habilitado(activo).

membresia_habilitada(vigente).

pagos_habilitados(si).


% ------------------------------------------
% 2. REGLAS DE DECISION DE INGRESO
% ------------------------------------------

% Regla 1: socio inactivo
decision_ingreso(inactivo, _, _, denegado(socio_inactivo)) :- !.

% Regla 2: membresia vencida
decision_ingreso(activo, vencida, _, denegado(membresia_vencida)) :- !.

% Regla 3: pagos pendientes
decision_ingreso(activo, vigente, no, denegado(pago_pendiente)) :- !.

% Regla 4: socio autorizado
decision_ingreso(Estado, Membresia, Pagos, autorizado) :-
    socio_habilitado(Estado),
    membresia_habilitada(Membresia),
    pagos_habilitados(Pagos),
    !.

% Regla 5: datos que no cumplen ninguna condicion
decision_ingreso(_, _, _, denegado(datos_no_validos)).

% ==========================================
% COMUNICACION CON PYTHON
% ==========================================

:- use_module(library(http/json)).

% Recibe JSON, evalua las reglas y devuelve JSON.
main :-
    json_read_dict(user_input, Datos),

    get_dict(estado_socio, Datos, EstadoTexto),
    get_dict(estado_membresia, Datos, MembresiaTexto),
    get_dict(pagos_al_dia, Datos, PagosTexto),

    atom_string(Estado, EstadoTexto),
    atom_string(Membresia, MembresiaTexto),
    atom_string(Pagos, PagosTexto),

    decision_ingreso(Estado, Membresia, Pagos, Decision),

    convertir_resultado(Decision, Respuesta),

    json_write_dict(user_output, Respuesta),
    nl.

% Resultado autorizado
convertir_resultado(
    autorizado,
    _{
        resultado: "autorizado",
        motivo: null
    }
).

% Resultado denegado por socio inactivo
convertir_resultado(
    denegado(socio_inactivo),
    _{
        resultado: "denegado",
        motivo: "socio_inactivo"
    }
).

% Resultado denegado por membresia vencida
convertir_resultado(
    denegado(membresia_vencida),
    _{
        resultado: "denegado",
        motivo: "membresia_vencida"
    }
).

% Resultado denegado por pagos pendientes
convertir_resultado(
    denegado(pago_pendiente),
    _{
        resultado: "denegado",
        motivo: "pago_pendiente"
    }
).

% Resultado denegado por datos no validos
convertir_resultado(
    denegado(datos_no_validos),
    _{
        resultado: "denegado",
        motivo: "datos_no_validos"
    }
).