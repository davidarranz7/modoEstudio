<?php
// This trusted harness executes student files ONLY in the disposable container.
$payload = json_decode(fgets(STDIN), true, 32, JSON_THROW_ON_ERROR);
$folder = '/tmp/estudio';
if (!mkdir($folder, 0700) && !is_dir($folder)) throw new RuntimeException('No se pudo preparar el directorio temporal');
foreach ($payload['files'] as $name => $source) {
    if (!preg_match('/^[A-Za-z0-9_-]+\.(php|json|txt)$/D', $name)) throw new RuntimeException('Nombre de archivo inválido');
    if (str_ends_with($name, '.php') && !str_starts_with(ltrim($source), '<?')) $source = "<?php\n" . $source;
    file_put_contents($folder . '/' . $name, $source);
}
chdir($folder);
$entry = $folder . '/' . $payload['entry'];
if (!$payload['tests']) { require $entry; exit; }
ob_start();
try { require $entry; }
catch (Throwable $e) { ob_end_clean(); fwrite(STDERR, $e::class . ': ' . $e->getMessage() . "\n"); exit(1); }
$initialOutput = ob_get_clean();
$results = [];
foreach ($payload['tests'] as $test) {
    $actual = null;
    $error = null;
    ob_start();
    try {
        if (!function_exists($test['functionName'])) throw new RuntimeException('No existe la función ' . $test['functionName']);
        $actual = call_user_func_array($test['functionName'], $test['args']);
    } catch (Throwable $e) { $error = $e::class . ': ' . $e->getMessage(); }
    $printed = ob_get_clean();
    if ($test['mode'] === 'output') $actual = $printed;
    $results[] = ['actual'=>$actual,'printed'=>$printed,'error'=>$error];
}
echo json_encode(['initialOutput'=>$initialOutput,'cases'=>$results], JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_THROW_ON_ERROR);
