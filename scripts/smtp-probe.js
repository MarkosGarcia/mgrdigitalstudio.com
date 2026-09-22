const net = require("net");

const host = process.argv[2] || "route1.mx.cloudflare.net";
const rcpt = process.argv[3] || "admin@websitesconverting.ca";

const socket = net.createConnection(25, host);
let step = 0;
const steps = [
  `EHLO probe.local\r\n`,
  `MAIL FROM:<probe@example.com>\r\n`,
  `RCPT TO:<${rcpt}>\r\n`,
  `QUIT\r\n`,
];

let buffer = "";
socket.setTimeout(15000, () => {
  console.log("TIMEOUT");
  socket.destroy();
});

socket.on("data", (data) => {
  buffer += data.toString();
  console.log("<< " + data.toString().trim());
  // Send next command once we see a complete reply line (ends with space after code)
  if (/^\d{3} /m.test(data.toString()) || /^\d{3}-/.test(data.toString()) === false) {
    if (step < steps.length) {
      console.log(">> " + steps[step].trim());
      socket.write(steps[step]);
      step++;
    } else {
      socket.end();
    }
  }
});

socket.on("error", (err) => {
  console.log("ERROR: " + err.message);
});

socket.on("close", () => {
  console.log("CLOSED");
});
