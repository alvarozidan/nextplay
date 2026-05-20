<?php
$order_id     = 'ORDER-1';
$status_code  = '200';
$gross_amount = '50000.00';
$server_key   = 'Mid-server-aIsaUgvlUdkRwRNO4aiE1mkt';

$signature = hash('sha512', $order_id . $status_code . $gross_amount . $server_key);
echo $signature;