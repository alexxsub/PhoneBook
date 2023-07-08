
# Открытие файрвола и создания прокси для доступа из внешней сети до WSL сервисов
# работает с WSL дистрибутивом по умолчанию 
# в терминале windows wsl -l смотрим список дистрибутивов и умолчание, нужно выставить правильный wsl --set-default <Distribution Name>

$remoteaddr = bash.exe -c "hostname -I"
$found = $remoteaddr -match '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}';

if( !$found ){
  echo "The Script Exited, the ip address of WSL 2 cannot be found";
  exit;
}

#[Порты]

#перечень портов, которые нужно пробросить
$ports=@(80,443,5000,9000,9001,9002,9003,9500);


#[Static ip]
#можно ограничить конкретным адресом, нули- будет принимать входящий со всех устройств
$addr='0.0.0.0';
$ports_a = $ports -join ",";


#Удаляем правило файрвола, при первом старте может быть ошибка, т.к. нет такого правила

iex "Remove-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' ";

#Добавляем правила для исходящего и входящего трафика
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort $ports_a -Action Allow -Protocol TCP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort $ports_a -Action Allow -Protocol TCP";


# создаем прокси для всех портов

for( $i = 0; $i -lt $ports.length; $i++ ){
  $port = $ports[$i];
  iex "netsh interface portproxy delete v4tov4 listenport=$port listenaddress=$addr";
  iex "netsh interface portproxy add v4tov4 listenport=$port listenaddress=$addr connectport=$port connectaddress=$remoteaddr";
}
