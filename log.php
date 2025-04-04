<?php
// JSON verisini al
$data = file_get_contents("php://input");
$logData = json_decode($data, true);

// Log dosyasına yaz
if ($logData) {
    $logFile = "logs.txt"; // Log dosyasının adı
    $logEntry = "IP: " . $logData['ip'] . " | Şehir: " . $logData['city'] . " | Ülke: " . $logData['country'] . " | Zaman: " . $logData['time'] . "\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND); // Dosyaya ekleme yap
    echo "Log başarıyla kaydedildi.";
} else {
    echo "Geçersiz veri.";
}
?>