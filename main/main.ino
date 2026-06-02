#define LED1_PIN 12
#define LED2_PIN 13

String serialBuf = "";

void execCommand(String cmd) {
    if (cmd == "1") digitalWrite(LED1_PIN, HIGH);
    else if (cmd == "0") digitalWrite(LED1_PIN, LOW);
    else if (cmd == "3") digitalWrite(LED2_PIN, HIGH);
    else if (cmd == "2") digitalWrite(LED2_PIN, LOW);
    else if (cmd.length() > 0) Serial.println(cmd);
}

void setup() {
    pinMode(LED1_PIN, OUTPUT);
    pinMode(LED2_PIN, OUTPUT);
    digitalWrite(LED1_PIN, LOW);
    digitalWrite(LED2_PIN, LOW);
    Serial.begin(9600);
}

void loop() {
    while (Serial.available() > 0) {
        char c = Serial.read();
        if (c == '\n') {
            serialBuf.trim();
            execCommand(serialBuf);
            serialBuf = "";
        } else if (c != '\r' && serialBuf.length() < 64) {
            serialBuf += c;
        }
    }
}
