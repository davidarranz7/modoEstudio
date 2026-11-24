<?php
function sumarMayores(array $numeros, int $limite): int {
    $suma = 0;
    foreach ($numeros as $numero) {
        if ($numero > $limite) {
            $suma += $numero;
        }
    }
    return $suma;
}
function crearMatriz(int $filas, int $columnas): array {
    $resultado = [];
    for ($i = 0; $i < $filas; $i++) {
        for ($j = 0; $j < $columnas; $j++) {
            $resultado[$i][$j] = rand(0, 10);
        }
    }
    return $resultado;
}
echo sumarMayores([4, 12, 11, -3, 20], 10) . PHP_EOL;
print_r(crearMatriz(2, 3));
