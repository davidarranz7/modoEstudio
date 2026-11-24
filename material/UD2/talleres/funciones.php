<?php
const PORCENTAJE_DESCUENTO = 0.10;
function calcularImporte(float $precio, int $sesiones): float {
    return $precio * $sesiones;
}
/**
 * Devuelve el importe del descuento aplicable.
 * @param float $importe Importe antes del descuento.
 * @param int $sesiones Número de sesiones.
 * @return float Valor del descuento.
 */
function calcularDescuento(float $importe, int $sesiones): float {
    return $sesiones >= 5 ? $importe * PORCENTAJE_DESCUENTO : 0.0;
}
function calcularTotal(float $importe, float $descuento): float {
    return $importe - $descuento;
}
