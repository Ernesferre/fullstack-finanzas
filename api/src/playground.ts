import jwt from "jsonwebtoken";

const token = jwt.sign({ userId: "abc123" }, "mi-clave-secreta", { expiresIn: "1h" });
console.log("Token:", token);

const payload = jwt.verify(token, "mi-clave-secreta");
console.log("Payload:", payload);

try {
  jwt.verify(token, "otra-clave");
} catch (error) {
  console.log("Con otra clave:", (error as Error).message);
};